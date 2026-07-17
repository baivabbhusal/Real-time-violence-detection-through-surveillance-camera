import cv2
import numpy as np


# ---------------------------------------------------
# PREPROCESS SINGLE FRAME
# ---------------------------------------------------

def preprocess_frame(frame, frame_size=(160, 160)):

    # Resize
    img = cv2.resize(
        frame,
        frame_size
    )

    # Convert BGR → RGB
    img = cv2.cvtColor(
        img,
        cv2.COLOR_BGR2RGB
    )

    # Normalize
    img = (
        img.astype(np.float32) / 127.5
    ) - 1.0

    return img