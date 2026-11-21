"""Turn a sign-language clip into a fixed-size feature vector.

Pipeline: video -> per-frame hand landmarks (MediaPipe) -> per-frame
normalize (translation + scale invariant) -> resample to N_FRAMES -> flatten.

cv2 and mediapipe are imported lazily inside clip_to_sequence() so the pure
numpy parts (and selfcheck.py) run without them installed.
"""
import numpy as np

N_FRAMES = 32
HAND_DIM = 21 * 3            # 21 landmarks * (x, y, z)
FEATURE_DIM = 2 * HAND_DIM   # two hands, zero-filled when a hand is absent


def landmarks_vector(hand_results):
    """MediaPipe Hands result -> flat (FEATURE_DIM,) frame vector.

    Missing hands are left as zeros so every frame has the same length.
    """
    vec = np.zeros(FEATURE_DIM, dtype=np.float32)
    hands = getattr(hand_results, "multi_hand_landmarks", None) or []
    for i, hand in enumerate(hands[:2]):
        pts = np.array([[lm.x, lm.y, lm.z] for lm in hand.landmark],
                       dtype=np.float32)
        vec[i * HAND_DIM:(i + 1) * HAND_DIM] = pts.reshape(-1)
    return vec


def normalize(seq):
    """Per-frame translation + scale invariance.

    Centre each frame's points on their centroid and divide by their RMS, so
    where the signer stands and how far from the camera they are stop mattering.
    """
    seq = np.asarray(seq, dtype=np.float32).copy()
    for t in range(seq.shape[0]):
        frame = seq[t].reshape(-1, 3)
        mask = np.any(frame != 0, axis=1)
        if not mask.any():
            continue
        pts = frame[mask] - frame[mask].mean(axis=0)
        scale = np.sqrt((pts ** 2).sum(axis=1).mean()) or 1.0
        frame[mask] = pts / scale
        seq[t] = frame.reshape(-1)
    return seq


def resample(seq, n=N_FRAMES):
    """Linearly resample a (T, D) sequence to exactly n frames."""
    seq = np.asarray(seq, dtype=np.float32)
    dim = seq.shape[1] if seq.ndim == 2 else FEATURE_DIM
    if seq.shape[0] == 0:
        return np.zeros((n, dim), np.float32)
    if seq.shape[0] == n:
        return seq
    idx = np.linspace(0, seq.shape[0] - 1, n)
    lo, hi = np.floor(idx).astype(int), np.ceil(idx).astype(int)
    frac = (idx - lo)[:, None]
    return ((1 - frac) * seq[lo] + frac * seq[hi]).astype(np.float32)


def sequence_feature(seq):
    """Flatten a normalized (N_FRAMES, D) clip into one classifier input.

    ponytail: flattening drops fine temporal order; fine for a small isolated-
    sign vocab. Swap for a GRU over the (N_FRAMES, D) sequence as data grows.
    """
    return np.asarray(seq, dtype=np.float32).reshape(-1)


def clip_to_sequence(path, n=N_FRAMES):
    """Video file -> normalized, resampled (n, FEATURE_DIM) landmark sequence.

    Needs opencv-python + mediapipe (see requirements.txt).
    """
    import cv2
    import mediapipe as mp

    hands = mp.solutions.hands.Hands(static_image_mode=False, max_num_hands=2)
    cap = cv2.VideoCapture(str(path))
    frames = []
    try:
        while True:
            ok, img = cap.read()
            if not ok:
                break
            res = hands.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
            frames.append(landmarks_vector(res))
    finally:
        cap.release()
        hands.close()
    seq = (np.array(frames, dtype=np.float32) if frames
           else np.zeros((0, FEATURE_DIM), np.float32))
    return resample(normalize(seq), n)


def clip_to_features(path, n=N_FRAMES):
    """Video file -> single flattened feature vector for the classifier."""
    return sequence_feature(clip_to_sequence(path, n))
