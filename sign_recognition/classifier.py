"""Tiny pure-numpy softmax classifier for Phase-1.

ponytail: linear multinomial logistic regression on flattened landmark
features. Depends on numpy alone, so the whole pipeline is runnable before any
ML stack is installed. Swap for an sklearn SVM or a Keras GRU (exportable to
TensorFlow.js for in-browser inference) once you have real multi-signer data.
"""
import numpy as np


def _softmax(z):
    z = z - z.max(axis=1, keepdims=True)
    e = np.exp(z)
    return e / e.sum(axis=1, keepdims=True)


class SignClassifier:
    def __init__(self, labels=None, W=None, b=None, mean=None, std=None):
        self.labels = labels
        self.W, self.b = W, b
        self.mean, self.std = mean, std

    def fit(self, X, y, epochs=400, lr=0.5, seed=0):
        X = np.asarray(X, np.float32)
        self.labels = sorted(set(y))
        col = {lab: i for i, lab in enumerate(self.labels)}
        Y = np.eye(len(self.labels))[[col[v] for v in y]]
        self.mean, self.std = X.mean(0), X.std(0) + 1e-6
        Xn = (X - self.mean) / self.std
        rng = np.random.default_rng(seed)
        self.W = rng.normal(0, 0.01, (Xn.shape[1], len(self.labels)))
        self.b = np.zeros(len(self.labels))
        for _ in range(epochs):
            P = _softmax(Xn @ self.W + self.b)
            grad = (P - Y) / len(Xn)
            self.W -= lr * (Xn.T @ grad + 1e-4 * self.W)   # tiny L2
            self.b -= lr * grad.sum(0)
        return self

    def predict_proba(self, X):
        X = np.asarray(X, np.float32)
        if X.ndim == 1:
            X = X[None]
        return _softmax(((X - self.mean) / self.std) @ self.W + self.b)

    def predict_with_confidence(self, x, threshold=0.6):
        """Return (label, confidence). Abstains with "not sure" below threshold
        so a guess is never presented as a verified translation."""
        p = self.predict_proba(x)[0]
        i = int(p.argmax())
        return (self.labels[i] if p[i] >= threshold else "not sure", float(p[i]))

    def save(self, path):
        np.savez(path, labels=np.array(self.labels, dtype=object),
                 W=self.W, b=self.b, mean=self.mean, std=self.std)

    @classmethod
    def load(cls, path):
        d = np.load(path, allow_pickle=True)
        return cls(labels=list(d["labels"]), W=d["W"], b=d["b"],
                   mean=d["mean"], std=d["std"])
