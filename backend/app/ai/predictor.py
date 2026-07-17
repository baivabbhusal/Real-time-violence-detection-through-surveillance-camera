import numpy as np

from app.ai.model_loader import (
    load_ai_model
)


# ---------------------------------------------------
# LOAD MODEL ONCE
# ---------------------------------------------------

model = load_ai_model()


# ---------------------------------------------------
# RUN PREDICTION
# ---------------------------------------------------

def predict_violence(frame_buffer):

    input_data = np.expand_dims(
        list(frame_buffer),
        axis=0
    )

    print(
        "Input Shape:",
        input_data.shape
    )

    prediction = model.predict(
        input_data,
        verbose=0
    )[0][0]

    print(
        "Prediction:",
        prediction
    )

    confidence = float(prediction)

    is_violent = confidence > 0.5

    return {
        'is_violent': is_violent,
        'confidence': confidence
    }