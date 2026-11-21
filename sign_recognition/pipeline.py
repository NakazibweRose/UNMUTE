"""Build a dataset from recorded clips, train, and predict.

Record clips into one folder per sign:

    data/
      hello/   clip1.mp4 clip2.mp4 ...
      thanks/  ...
      name/    ...

Then:

    python -m sign_recognition.pipeline train   data/ model.npz
    python -m sign_recognition.pipeline predict  model.npz some_clip.mp4

Extraction needs mediapipe + opencv (requirements.txt). Predicting from a saved
model.npz needs only numpy. Record several signers per sign and keep some
signers aside to measure real generalization, not memorization.
"""
import glob
import os
import sys

import numpy as np

from .classifier import SignClassifier
from .features import clip_to_features

VIDEO_EXTS = ("*.mp4", "*.webm", "*.mov", "*.m4v")


def build_dataset(data_dir):
    X, y = [], []
    for label in sorted(os.listdir(data_dir)):
        folder = os.path.join(data_dir, label)
        if not os.path.isdir(folder):
            continue
        clips = []
        for ext in VIDEO_EXTS:
            clips += glob.glob(os.path.join(folder, ext))
        for clip in sorted(clips):
            print(f"  {label}: {os.path.basename(clip)}")
            X.append(clip_to_features(clip))
            y.append(label)
    if not X:
        sys.exit(f"No clips found under {data_dir}/<label>/*.mp4")
    return np.array(X, np.float32), y


def main(argv):
    if len(argv) == 3 and argv[0] == "train":
        X, y = build_dataset(argv[1])
        SignClassifier().fit(X, y).save(argv[2])
        print(f"Trained on {len(y)} clips across {len(set(y))} signs -> {argv[2]}")
    elif len(argv) == 3 and argv[0] == "predict":
        clf = SignClassifier.load(argv[1])
        label, conf = clf.predict_with_confidence(clip_to_features(argv[2]))
        print(f"{label}  ({conf:.0%})")
    else:
        print(__doc__)


if __name__ == "__main__":
    main(sys.argv[1:])
