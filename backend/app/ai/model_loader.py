import os

from tensorflow.keras.models import load_model


# ---------------------------------------------------
# LOAD TRAINED MODEL
# ---------------------------------------------------

def load_ai_model():

    model_path = os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            '../../../aiEngine/artifacts/models/best_model.keras'
        )
    )

    print(f'Loading model from: {model_path}')

    # CHECK FILE EXISTS
    if not os.path.exists(model_path):

        raise FileNotFoundError(
            f'Model file not found: {model_path}'
        )

    model = load_model(model_path)

    print('Model loaded successfully.')

    return model