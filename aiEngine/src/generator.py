import numpy as np
import cv2
import pandas as pd
import tensorflow as tf
from tensorflow.keras.utils import Sequence

class VideoGenerator(Sequence):
    def __init__(self, csv_path, batch_size=8, seq_len=16, img_size=(224, 224), shuffle=True):
        self.data = pd.read_csv(csv_path)
        self.batch_size = batch_size
        self.seq_len = seq_len
        self.img_size = img_size
        self.shuffle = shuffle
        
        # --- CRITICAL ACADEMIC FIX: Randomize the order at the start ---
        if self.shuffle:
            self.data = self.data.sample(frac=1).reset_index(drop=True)

    def on_epoch_end(self):
        # Re-shuffle after every epoch so the AI doesn't memorize the order
        if self.shuffle:
            self.data = self.data.sample(frac=1).reset_index(drop=True)

    def __len__(self):
        return int(np.floor(len(self.data) / self.batch_size))

    def __getitem__(self, index):
        batch_slice = self.data.iloc[index * self.batch_size : (index + 1) * self.batch_size]
        
        X = [] 
        y = [] 
        
        for _, row in batch_slice.iterrows():
            # Ensure path is valid for Linux/Colab (Forward slashes)
            path = row['video_path'].replace('\\', '/')
            
            video_tensor = self._process_video(path)
            X.append(video_tensor)
            y.append(row['label'])
            
        return np.array(X, dtype="float32"), np.array(y, dtype="float32")

    def _process_video(self, path):
        cap = cv2.VideoCapture(path)
        frames = []
        
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        # If video is empty/broken, return a sequence of zeros
        if total_frames <= 0:
            return np.zeros((self.seq_len, *self.img_size, 3), dtype="float32")

        interval = max(int(total_frames / self.seq_len), 1)
        
        for i in range(self.seq_len):
            cap.set(cv2.CAP_PROP_POS_FRAMES, i * interval)
            success, frame = cap.read()
            
            if not success:
                frame = np.zeros((*self.img_size, 3), dtype="uint8")
            else:
                frame = cv2.resize(frame, self.img_size)
                frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Normalization to [-1, 1] range for MobileNetV2
            frame = (frame.astype("float32") / 127.5) - 1.0
            frames.append(frame)
            
        cap.release()
        return np.array(frames)