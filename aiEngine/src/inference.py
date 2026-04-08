import os
import cv2
import numpy as np
import tensorflow as tf
from collections import deque
from tensorflow.keras.layers import TimeDistributed, LSTM, Dense, Input, GlobalAveragePooling2D
from tensorflow.keras.models import Model

# Suppress warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

# --- CONFIGURATION ---
MODEL_WEIGHTS_PATH = "aiEngine/artifacts/best_model.keras"
SEQUENCE_LENGTH = 16   
FRAME_SIZE = (224, 224) 
THRESHOLD = 0.90       

def build_mobilenet_skeleton():
    """
    Updated Reconstruction: 
    Matches the layer weights found in your file (LSTM 64 -> Dense 64 -> Dense 1)
    """
    from tensorflow.keras.layers import TimeDistributed, LSTM, Dense, Input, GlobalAveragePooling2D
    from tensorflow.keras.models import Model

    # 1. Base MobileNetV2
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=(*FRAME_SIZE, 3),
        include_top=False,
        weights=None
    )

    # 2. Input Sequence
    inputs = Input(shape=(SEQUENCE_LENGTH, *FRAME_SIZE, 3))
    
    # 3. Feature Extraction
    x = TimeDistributed(base_model)(inputs)
    x = TimeDistributed(GlobalAveragePooling2D())(x)
    
    # 4. Sequence Processing
    x = LSTM(64)(x)
    
    # --- THIS PART IS UPDATED ---
    # The error suggests there is a Dense layer with 64 units before the final output
    x = Dense(64, activation='relu')(x) 
    
    # Final Output Layer
    outputs = Dense(1, activation='sigmoid')(x)
    # -----------------------------
    
    return Model(inputs, outputs)

def run_inference():
    print("Reconstructing Custom MobileNet Architecture...")
    
    try:
        # Create the skeleton
        model = build_mobilenet_skeleton()
        
        # Load the weights from your .keras file
        # If your file is a full model, load_weights will extract just the parameters
        model.load_weights(MODEL_WEIGHTS_PATH)
        print("✅ Weights loaded into MobileNet skeleton successfully!")
    except Exception as e:
        print(f"❌ Failed to build/load model: {e}")
        print("\nNote: If you used a different base (MobileNetV1 or V3), change the class above.")
        return

    cap = cv2.VideoCapture(0)
    frame_queue = deque(maxlen=SEQUENCE_LENGTH)

    print("Webcam Active. Press 'q' to quit.")

    while True:
        ret, frame = cap.read()
        if not ret: break

        # Preprocess: MobileNet expects -1 to 1 or 0 to 1 depending on your training
        # Most custom MobileNet trainers use tf.keras.applications.mobilenet_v2.preprocess_input
        img = cv2.resize(frame, FRAME_SIZE)
        img = img.astype(np.float32) / 255.0 
        frame_queue.append(img)

        display_text = "Buffering..."
        color = (0, 255, 255)

        if len(frame_queue) == SEQUENCE_LENGTH:
            input_data = np.expand_dims(list(frame_queue), axis=0)
            prediction = model.predict(input_data, verbose=0)[0][0]

            if prediction > THRESHOLD:
                display_text = f"VIOLENCE: {prediction*100:.1f}%"
                color = (0, 0, 255)
            else:
                display_text = f"NORMAL: {prediction*100:.1f}%"
                color = (0, 255, 0)

        cv2.putText(frame, display_text, (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, color, 3)
        cv2.imshow("MobileNet Violence Detection Test", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    run_inference()