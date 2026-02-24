import os
import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

# 1. Environment Configuration
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

# --- UPDATE PATHS ---
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Make sure your video is in the visionGuard folder
VIDEO_PATH = os.path.join(BASE_DIR, "test_video.mp4") 
MODEL_PATH = os.path.join(BASE_DIR, "artifacts", "best_model.keras")

def build_skeleton():
    base_cnn = MobileNetV2(weights=None, include_top=False, input_shape=(224, 224, 3))
    inputs = layers.Input(shape=(16, 224, 224, 3))
    x = layers.TimeDistributed(base_cnn)(inputs)
    x = layers.TimeDistributed(layers.GlobalAveragePooling2D())(x)
    x = layers.LSTM(64)(x)
    x = layers.Dense(64, activation='relu')(x)
    x = layers.Dropout(0.3)(x)
    outputs = layers.Dense(1, activation='sigmoid')(x)
    return models.Model(inputs, outputs)

print(" Initializing VisionGuard AI...")
model = build_skeleton()
model.load_weights(MODEL_PATH)
print(" Weights Loaded Successfully!")

def start_video_test():
    if not os.path.exists(VIDEO_PATH):
        print(f" ERROR: Video file not found at {VIDEO_PATH}")
        return

    cap = cv2.VideoCapture(VIDEO_PATH)
    frame_buffer = []
    
    print(f"🎬 Processing: {os.path.basename(VIDEO_PATH)}")

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Pre-process for AI
        img = cv2.resize(frame, (224, 224))
        img_pre = preprocess_input(img)
        frame_buffer.append(img_pre)
        
        if len(frame_buffer) > 16:
            frame_buffer.pop(0)

        # Run AI Prediction
        if len(frame_buffer) == 16:
            input_tensor = np.expand_dims(np.array(frame_buffer), axis=0)
            prediction = model.predict(input_tensor, verbose=0)[0][0]
            
            label = "VIOLENCE" if prediction > 0.5 else "NORMAL"
            color = (0, 0, 255) if label == "VIOLENCE" else (0, 255, 0)
            
            # UI Overlay
            cv2.rectangle(frame, (10, 10), (400, 70), (0, 0, 0), -1)
            cv2.putText(frame, f"{label} ({prediction:.2f})", (20, 50), 
                        cv2.FONT_HERSHEY_SIMPLEX, 1, color, 3)

        cv2.imshow('VisionGuard - File Test', frame)
        
        # Press 'q' to exit
        if cv2.waitKey(25) & 0xFF == ord('q'):
            break

    print(" Processing Finished.")
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    start_video_test()