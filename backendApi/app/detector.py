"""
detector.py
-----------
Loads the trained Keras model once at startup and runs inference
on sequences of frames from the stream handler.

The model expects input shape: (1, SEQUENCE_LENGTH, 100, 100, 3)
Output: softmax probabilities over [NonViolence, Violence, Weaponized]
"""

import os
import cv2
import numpy as np
import tensorflow as tf
from app.config import Config

# Class index → label name (must match your training label order)
LABELS = ["NonViolence", "Violence", "Weaponized"]


class ViolenceDetector:
    """
    Singleton-style detector. Load once, call repeatedly.

    Usage:
        detector = ViolenceDetector()
        result = detector.predict(frames)   # frames: list of 16 numpy arrays
    """

    def __init__(self):
        model_path = os.path.abspath(Config.MODEL_PATH)

        if not os.path.exists(model_path):
            raise FileNotFoundError(
                f"Model not found at {model_path}. "
                f"Check MODEL_PATH in your .env file."
            )

        print(f"[Detector] Loading model from {model_path} ...")
        self.model     = tf.keras.models.load_model(model_path)
        self.threshold = Config.DETECTION_THRESHOLD
        self.seq_len   = Config.SEQUENCE_LENGTH
        self.frame_size = Config.FRAME_SIZE
        print("[Detector] Model loaded successfully")

    def preprocess_frames(self, frames: list[np.ndarray]) -> np.ndarray:
        """
        Prepares a list of raw BGR frames (from OpenCV) for model input.

        Steps:
            1. Resize each frame to 100x100
            2. Convert BGR → RGB
            3. Normalize pixels to [0.0, 1.0]
            4. Stack into shape (1, 16, 100, 100, 3)

        The leading 1 is the batch dimension Keras expects.
        """
        processed = []
        for frame in frames:
            frame = cv2.resize(frame, self.frame_size)
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frame = frame.astype(np.float32) / 255.0
            processed.append(frame)

        # Stack: (16, 100, 100, 3) then add batch dim → (1, 16, 100, 100, 3)
        sequence = np.stack(processed, axis=0)
        return np.expand_dims(sequence, axis=0)

    def predict(self, frames: list[np.ndarray]) -> dict:
        """
        Runs inference on a sequence of frames.

        Args:
            frames: list of SEQUENCE_LENGTH BGR numpy arrays from OpenCV

        Returns dict:
            {
                "label":      "Violence",       # predicted class
                "confidence": 0.91,             # probability of predicted class
                "is_violent": True,             # True if Violence or Weaponized
                "probabilities": {              # all class probabilities
                    "NonViolence": 0.05,
                    "Violence":    0.91,
                    "Weaponized":  0.04,
                }
            }
        """
        if len(frames) < self.seq_len:
            # Pad with the last frame if sequence is too short
            frames = frames + [frames[-1]] * (self.seq_len - len(frames))

        input_tensor = self.preprocess_frames(frames[:self.seq_len])
        predictions  = self.model.predict(input_tensor, verbose=0)[0]  # shape: (3,)

        predicted_idx = int(np.argmax(predictions))
        label         = LABELS[predicted_idx]
        confidence    = float(predictions[predicted_idx])

        return {
            "label":         label,
            "confidence":    round(confidence, 4),
            "is_violent":    label in ("Violence", "Weaponized"),
            "probabilities": {
                LABELS[i]: round(float(predictions[i]), 4)
                for i in range(len(LABELS))
            },
        }


# ── Module-level singleton ────────────────────────────────────────────────────
# Loaded once when the Flask app starts, shared across all streams.
# This avoids reloading the model on every request.

_detector_instance = None

def get_detector() -> ViolenceDetector:
    global _detector_instance
    if _detector_instance is None:
        _detector_instance = ViolenceDetector()
    return _detector_instance