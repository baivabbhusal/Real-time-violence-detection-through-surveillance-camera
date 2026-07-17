import os
import cv2
import numpy as np
import tensorflow as tf
from collections import deque
from tensorflow.keras.layers import TimeDistributed, LSTM, Dense, Input, GlobalAveragePooling2D
from tensorflow.keras.models import Model

# Suppress TensorFlow logging
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

# --- CONFIGURATION ---
MODEL_WEIGHTS_PATH = "aiEngine/artifacts/best_model.keras"
SEQUENCE_LENGTH = 16   
FRAME_SIZE = (224, 224) 
THRESHOLD = 0.50       

def build_mobilenet_skeleton():
    """
    Reconstructs the Keras functional model layout matching 
    the architecture used during training.
    """
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
    x = Dense(64, activation='relu')(x) 
    outputs = Dense(1, activation='sigmoid')(x)
    
    return Model(inputs, outputs)

def run_inference():
    print("Reconstructing Custom MobileNet Architecture...")
    
    try:
        model = build_mobilenet_skeleton()
        model.load_weights(MODEL_WEIGHTS_PATH)
        print("✅ Weights loaded into MobileNet skeleton successfully!")
    except Exception as e:
        print(f"❌ Failed to build/load model: {e}")
        return

    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("❌ Error: Could not open webcam.")
        return

    frame_queue = deque(maxlen=SEQUENCE_LENGTH)

    print("\n--- Webcam Active. Press 'q' to quit. ---\n")

    try:
        while True:
            ret, frame = cap.read()
            if not ret: 
                print("Failed to read frame.")
                break

            # 1. Resize and format the frame
            img = cv2.resize(frame, FRAME_SIZE)
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            img = (img.astype(np.float32) / 127.5) - 1.0 
            
            frame_queue.append(img)

            display_text = "Buffering..."
            color = (0, 255, 255) # Yellow for buffering

            if len(frame_queue) == SEQUENCE_LENGTH:
                input_data = np.expand_dims(list(frame_queue), axis=0)
                prediction = model.predict(input_data, verbose=0)[0][0]

                if prediction > THRESHOLD:
                    display_text = f"🚨 VIOLENCE DETECTED: {prediction * 100:.1f}%"
                    color = (0, 0, 255) # Red for violence
                else:
                    display_text = f"🟢 NORMAL: {prediction * 100:.1f}%"
                    color = (0, 255, 0) # Green for normal

            # Print continuous status to terminal
            print(f"\rStatus: {display_text}", end="")

            # Show the visual status on a frame if needed
            display_frame = frame.copy()
            cv2.putText(display_frame, display_text, (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)
            cv2.imshow("VisionGuard - Violence Detection", display_frame)

            # Press 'q' to exit
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

    except KeyboardInterrupt:
        print("\nProcess interrupted by user.")
        
    finally:
        cap.release()
        cv2.destroyAllWindows()
        print("\nCamera released successfully.")

if __name__ == "__main__":
    run_inference()