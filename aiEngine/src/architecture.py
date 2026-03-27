import tensorflow as tf
from tensorflow.keras import layers, models

def build_violence_model(input_shape=(16, 224, 224, 3)):
    """
    input_shape: (Frames, Height, Width, Channels)
    Standard is 16 frames of 224x224 RGB images.
    """
    
    # 1. THE EYES: MobileNetV2 (Pre-trained on ImageNet)
    # We freeze it so we don't ruin the pre-trained weights
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=(224, 224, 3), 
        include_top=False, 
        weights='imagenet'
    )
    base_model.trainable = False 

    model = models.Sequential()

    # 2. THE WRAPPER: Apply MobileNetV2 to every one of the 16 frames
    model.add(layers.TimeDistributed(base_model, input_shape=input_shape))
    model.add(layers.TimeDistributed(layers.GlobalAveragePooling2D()))

    # 3. THE MEMORY: LSTM (This detects the "movement" of violence)
    model.add(layers.LSTM(64, return_sequences=False))
    
    # 4. THE DECISION: Dense Layers
    model.add(layers.Dense(64, activation='relu'))
    model.add(layers.Dropout(0.3)) # Prevents cheating/overfitting
    model.add(layers.Dense(1, activation='sigmoid')) # Output: 0 (Normal) or 1 (Violence)

    return model

if __name__ == "__main__":
    # Test if the model builds correctly
    my_model = build_violence_model()
    my_model.summary()