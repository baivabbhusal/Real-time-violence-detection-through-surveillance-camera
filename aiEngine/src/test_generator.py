import os

from generator import VideoGenerator

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

TRAIN_CSV = os.path.join(
    BASE_DIR,
    "..",
    "dataset",
    "splits",
    "train.csv"
)

train_gen = VideoGenerator(
    csv_path=TRAIN_CSV,
    batch_size=2
)

X, y = train_gen[0]

print("Input shape:", X.shape)
print("Labels:", y)