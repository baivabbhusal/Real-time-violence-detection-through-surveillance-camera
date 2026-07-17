import os
import pandas as pd
from sklearn.model_selection import train_test_split

# Get current file directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Build absolute paths
METADATA_PATH = os.path.join(BASE_DIR, "..", "dataset", "metadata.csv")

SPLIT_DIR = os.path.join(BASE_DIR, "..", "dataset", "splits")

os.makedirs(SPLIT_DIR, exist_ok=True)

print(f"Reading metadata from:")
print(METADATA_PATH)

# Load metadata
df = pd.read_csv(METADATA_PATH)

# Train split
train_df, temp_df = train_test_split(
    df,
    test_size=0.30,
    stratify=df["label"],
    random_state=42
)

# Validation + Test split
val_df, test_df = train_test_split(
    temp_df,
    test_size=0.50,
    stratify=temp_df["label"],
    random_state=42
)

# Save files
train_df.to_csv(os.path.join(SPLIT_DIR, "train.csv"), index=False)
val_df.to_csv(os.path.join(SPLIT_DIR, "val.csv"), index=False)
test_df.to_csv(os.path.join(SPLIT_DIR, "test.csv"), index=False)

print("\nDataset split complete.")
print(f"Train samples: {len(train_df)}")
print(f"Validation samples: {len(val_df)}")
print(f"Test samples: {len(test_df)}")