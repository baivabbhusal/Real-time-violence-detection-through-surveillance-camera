import os
import pandas as pd

# Get absolute path of current file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Build paths safely
DATASET_DIR = os.path.join(BASE_DIR, "..", "dataset", "raw")
OUTPUT_CSV = os.path.join(BASE_DIR, "..", "dataset", "metadata.csv")

def generate_metadata():

    records = []

    classes = {
        "Violence": 1,
        "NonViolence": 0
    }

    print(f"Dataset directory: {DATASET_DIR}")

    for class_name, label in classes.items():

        class_path = os.path.join(DATASET_DIR, class_name)

        print(f"\nChecking: {class_path}")

        if not os.path.exists(class_path):
            print(f"Folder not found: {class_path}")
            continue

        for video_name in os.listdir(class_path):

            if video_name.endswith((".mp4", ".avi", ".mov", ".mkv")):

                full_path = os.path.join(class_path, video_name)

                records.append({
                    "video_path": full_path,
                    "label": label,
                    "class_name": class_name
                })

    df = pd.DataFrame(records)

    if len(df) == 0:
        print("\nNo videos found.")
        return

    df = df.sample(frac=1, random_state=42).reset_index(drop=True)

    df.to_csv(OUTPUT_CSV, index=False)

    print(f"\nMetadata saved to:")
    print(OUTPUT_CSV)

    print(f"\nTotal videos indexed: {len(df)}")

if __name__ == "__main__":
    generate_metadata()