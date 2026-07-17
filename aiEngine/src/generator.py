import cv2
import numpy as np
import pandas as pd
import tensorflow as tf
import os

class VideoGenerator(tf.keras.utils.Sequence):

    def __init__(
        self,
        csv_path,
        batch_size=4,
        sequence_length=8,
        image_size=(160, 160),
        shuffle=True
    ):

        self.data = pd.read_csv(csv_path)

        self.batch_size = batch_size
        self.sequence_length = sequence_length
        self.image_size = image_size
        self.shuffle = shuffle

        self.on_epoch_end()

    def __len__(self):

        return len(self.data) // self.batch_size

    def on_epoch_end(self):

        if self.shuffle:
            self.data = self.data.sample(frac=1).reset_index(drop=True)

    def __getitem__(self, index):

        batch_data = self.data.iloc[
            index * self.batch_size:
            (index + 1) * self.batch_size
        ]

        X_batch = []
        y_batch = []

        for _, row in batch_data.iterrows():

            video_path = row["video_path"]
            label = row["label"]

            frames = self.load_video(video_path)

            X_batch.append(frames)
            y_batch.append(label)

        return np.array(X_batch), np.array(y_batch)

    def load_video(self, video_path):

        import os

        # Normalize path
        video_path = os.path.normpath(video_path)

        cap = cv2.VideoCapture(video_path)

        # Check video opened correctly
        if not cap.isOpened():

            print(f"\nERROR: Cannot open video:")
            print(video_path)

            return np.zeros(
                (
                    self.sequence_length,
                    self.image_size[0],
                    self.image_size[1],
                    3
                ),
                dtype=np.float32
            )

        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

        frames = []

        if total_frames <= 0:

            print(f"\nERROR: Empty video:")
            print(video_path)

            return np.zeros(
                (
                    self.sequence_length,
                    self.image_size[0],
                    self.image_size[1],
                    3
                ),
                dtype=np.float32
            )

        # Uniform temporal sampling
        frame_indices = np.linspace(
            0,
            total_frames - 1,
            self.sequence_length,
            dtype=int
        )

        for frame_index in frame_indices:

            cap.set(cv2.CAP_PROP_POS_FRAMES, frame_index)

            success, frame = cap.read()

            if not success:

                frame = np.zeros(
                    (
                        self.image_size[0],
                        self.image_size[1],
                        3
                    ),
                    dtype=np.uint8
                )

            else:

                frame = cv2.resize(
                    frame,
                    self.image_size
                )

                frame = cv2.cvtColor(
                    frame,
                    cv2.COLOR_BGR2RGB
                )

            # Normalize to [-1, 1]
            frame = (
                frame.astype(np.float32) / 127.5
            ) - 1.0

            frames.append(frame)

        cap.release()

        return np.array(frames)