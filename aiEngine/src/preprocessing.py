import os
import cv2
from datasets import load_dataset, Video

# ============================
# CONFIG
# ============================

DATASET_NAME = "Baivab001/Real_Time_Violence"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_FOLDER = os.path.join(BASE_DIR, "..", "dataset", "processed")

FRAME_SIZE = (224, 224)
FRAME_SKIP = 5
MAX_FRAMES = 16            # max frames per video
MAX_PER_CLASS = 100        # balanced videos per class

LABEL_MAP = {
    0: "NonViolence",
    1: "Violence"
}

# ============================
# Frame Extraction Function
# ============================

def extract_frames(video_path, output_folder):

    os.makedirs(output_folder, exist_ok=True)

    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        print(" Failed to open:", video_path)
        return

    count = 0
    saved_count = 0

    while True:
        ret, frame = cap.read()

        if not ret:
            break

        if count % FRAME_SKIP == 0:

            frame = cv2.resize(frame, FRAME_SIZE)

            frame_path = os.path.join(
                output_folder,
                f"frame_{saved_count}.jpg"
            )

            cv2.imwrite(frame_path, frame)
            saved_count += 1

            if saved_count >= MAX_FRAMES:
                break

        count += 1

    cap.release()


# ============================
# Main Preprocessing Pipeline
# ============================

def preprocess_dataset():

    print("Loading dataset from Hugging Face...")

    ds = load_dataset(DATASET_NAME)
    print(ds)
    print("Saving to:", os.path.abspath(OUTPUT_FOLDER))

    train_data = ds["train"]
    train_data = train_data.cast_column("video", Video(decode=False))

    # Balanced counter
    class_counter = {
        "NonViolence": 0,
        "Violence": 0
    }

    for sample in train_data:

        label_name = LABEL_MAP[sample["label"]]

        # Skip if class limit reached
        if class_counter[label_name] >= MAX_PER_CLASS:
            continue

        video_index = class_counter[label_name]
        video_path = sample["video"]["path"]

        print(f"Processing {label_name} | Video {video_index}")

        output_folder = os.path.join(
            OUTPUT_FOLDER,
            label_name,
            f"video_{video_index}"
        )

        extract_frames(video_path, output_folder)

        class_counter[label_name] += 1

        # Stop when both classes are filled
        if all(count >= MAX_PER_CLASS for count in class_counter.values()):
            break

    print("\n Balanced Preprocessing Completed!")
    print("Final counts:", class_counter)


# ============================
# Run Script
# ============================

if __name__ == "__main__":
    preprocess_dataset()
