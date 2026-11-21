"""Runnable self-check (numpy only) for the Phase-1 pipeline.

Proves features + classifier work end to end on synthetic landmark data,
without mediapipe/opencv installed. Run:

    python -m sign_recognition.selfcheck
"""
import numpy as np

from .classifier import SignClassifier
from .features import FEATURE_DIM, N_FRAMES, normalize, resample, sequence_feature


def _clip_for(pattern, rng, T=24):
    """A noisy clip of one sign, placed at a random position + scale."""
    frames = pattern[None, :] + rng.normal(0, 0.01, (T, FEATURE_DIM))
    return (frames * rng.uniform(0.5, 2.0) + rng.uniform(-5, 5)).astype(np.float32)


def _featurize(clip):
    return sequence_feature(resample(normalize(clip), N_FRAMES))


def main():
    rng = np.random.default_rng(0)

    # 1. normalize is translation + scale invariant.
    s = rng.normal(0, 1, (10, FEATURE_DIM)).astype(np.float32)
    assert np.allclose(normalize(s), normalize(s * 3.0 + 10.0), atol=1e-4), \
        "normalize is not shift/scale invariant"
    assert resample(s, N_FRAMES).shape == (N_FRAMES, FEATURE_DIM)

    # 2. three synthetic signs, held-out clips classify correctly.
    patterns = {name: rng.normal(0, 1, FEATURE_DIM).astype(np.float32)
                for name in ("hello", "thanks", "name")}
    Xtr, ytr, Xte, yte = [], [], [], []
    for name, pat in patterns.items():
        for i in range(12):
            feat = _featurize(_clip_for(pat, rng))
            (Xtr if i < 9 else Xte).append(feat)
            (ytr if i < 9 else yte).append(name)

    clf = SignClassifier().fit(np.array(Xtr), ytr)
    acc = np.mean([clf.predict_with_confidence(x, threshold=0.0)[0] == t
                   for x, t in zip(Xte, yte)])
    assert acc >= 0.8, f"held-out accuracy too low: {acc:.0%}"

    # 3. confidence gate abstains when nothing clears the bar.
    assert clf.predict_with_confidence(Xte[0], threshold=1.1)[0] == "not sure"

    print(f"OK  invariance holds | held-out acc {acc:.0%} | abstain gate works")


if __name__ == "__main__":
    main()
