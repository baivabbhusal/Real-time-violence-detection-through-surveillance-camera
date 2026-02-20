import os
import cv2
from datasets import load_dataset,Video

# ============================
# CONFIG
# ============================

DATASET_NAME = "Baivab001/Real_Time_Violence"
OUTPUT_FOLDER = "../dataset/processed"
FRAME_SIZE = (224, 224)
FRAME_SKIP = 5   # every 5th frame save


# ============================
# Frame Extraction Function
# ============================

def extract_frames(video_path, output_folder):

    os.makedirs(output_folder, exist_ok=True)

    cap = cv2.VideoCapture(video_path)
    count = 0
    saved_count = 0

    while True:
        ret, frame = cap.read()

        if not ret:
            break

        # Skip frames (reduce dataset size)
        if count % FRAME_SKIP == 0:

            frame = cv2.resize(frame, FRAME_SIZE)

            frame_path = os.path.join(
                output_folder,
                f"frame_{saved_count}.jpg"
            )

            cv2.imwrite(frame_path, frame)
            saved_count += 1

        count += 1

    cap.release()


# ============================
# Main Preprocessing Pipeline
# ============================

def preprocess_dataset():

    print("Loading dataset from Hugging Face...")

    ds = load_dataset(DATASET_NAME)
    print(ds)

    train_data = ds["train"]
    train_data = train_data.cast_column("video", Video(decode=False))

    for i, sample in enumerate(train_data):
        if i>2:
            break

        video_path = sample["video"]["path"]
        label = str(sample["label"])
        print(video_path,label)

        output_folder = os.path.join(
            OUTPUT_FOLDER,
            label,
            f"video_{i}"
        )

        print(f"Processing Video {i} | Label: {label}")

        extract_frames(video_path, output_folder)

    print("Preprocessing Completed!")


# ============================
# Run Script
# ============================

if __name__ == "__main__":
    preprocess_dataset()
