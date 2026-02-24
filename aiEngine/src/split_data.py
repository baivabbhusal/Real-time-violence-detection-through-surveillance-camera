import pandas as pd
from sklearn.model_selection import train_test_split
import os

def split_and_save():
    # 1. Setup paths relative to this script
    SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
    DATASET_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, "..", "dataset"))
    
    METADATA_PATH = os.path.join(DATASET_DIR, "metadata.csv")
    
    if not os.path.exists(METADATA_PATH):
        print(f"Error: Could not find {METADATA_PATH}")
        return

    # 2. Load data
    df = pd.read_csv(METADATA_PATH)

    # 3. First split: 70% Training, 30% for (Validation + Test)
    # stratify=df['label'] ensures both sets have the same % of violence
    train_df, temp_df = train_test_split(
        df, test_size=0.30, random_state=42, stratify=df['label']
    )

    # 4. Second split: Divide the 30% into half (15% Val, 15% Test)
    val_df, test_df = train_test_split(
        temp_df, test_size=0.50, random_state=42, stratify=temp_df['label']
    )

    # 5. Save the CSVs
    train_df.to_csv(os.path.join(DATASET_DIR, "train.csv"), index=False)
    val_df.to_csv(os.path.join(DATASET_DIR, "val.csv"), index=False)
    test_df.to_csv(os.path.join(DATASET_DIR, "test.csv"), index=False)

    print("Data successfully split!")
    print(f"Total: {len(df)} | Train: {len(train_df)} | Val: {len(val_df)} | Test: {len(test_df)}")

if __name__ == "__main__":
    split_and_save()