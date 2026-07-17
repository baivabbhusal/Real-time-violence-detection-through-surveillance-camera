import tensorflow as tf
from tensorflow.keras import layers
from tensorflow.keras import models


def build_violence_model(
    sequence_length=8,
    image_size=160
):

    # MobileNetV2 Backbone


    base_model = tf.keras.applications.MobileNetV2(
        input_shape=(image_size, image_size, 3),
        include_top=False,
        weights="imagenet"
    )

    # Freeze backbone initially
    base_model.trainable = False


    # Model Architecture


    model = models.Sequential()

    # Process each frame independently
    model.add(
        layers.TimeDistributed(
            base_model,
            input_shape=(
                sequence_length,
                image_size,
                image_size,
                3
            )
        )
    )

    # Convert feature maps into vectors
    model.add(
        layers.TimeDistributed(
            layers.GlobalAveragePooling2D()
        )
    )

    # Temporal sequence learning
    model.add(
        layers.Bidirectional(
            layers.LSTM(
                64,
                return_sequences=False
            )
        )
    )

    # Regularization
    model.add(layers.Dropout(0.5))

    # Dense feature learning
    model.add(
        layers.Dense(
            64,
            activation="relu"
        )
    )

    model.add(layers.Dropout(0.3))

    # Binary classification
    model.add(
        layers.Dense(
            1,
            activation="sigmoid"
        )
    )

    return model