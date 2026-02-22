import numpy as np
import cv2
import os
import tensorflow as tf
from tensorflow.keras.utils import Sequence
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

class VideoDataGenerator(Sequence):
    def __init__(self, csv_file, base_path, batch_size=8, seq_len=16, img_size=(224, 224)):
        self.df = pd.read_csv(csv_file)
        self.base_path = base_path # This will be 'aiEngine/dataset/processed'
        self.batch_size = batch_size
        self.seq_len = seq_len
        self.img_size = img_size
        self.labels = self.df['label'].values
        self.clip_paths = self.df['relative_path'].values

    def __len__(self):
        return int(np.floor(len(self.df) / self.batch_size))

    def __getitem__(self, index):
        # Select a batch of clips
        batch_paths = self.clip_paths[index * self.batch_size : (index + 1) * self.batch_size]
        batch_labels = self.labels[index * self.batch_size : (index + 1) * self.batch_size]
        
        X = np.empty((self.batch_size, self.seq_len, *self.img_size, 3))
        
        for i, clip_rel_path in enumerate(batch_paths):
            clip_full_path = os.path.join(self.base_path, clip_rel_path)
            X[i] = self._load_frames(clip_full_path)
            
        return X, np.array(batch_labels)

    def _load_frames(self, path):
        frames = []
        # Get list of images in the clip folder and sort them
        all_frames = sorted([f for f in os.listdir(path) if f.endswith(('.jpg', '.png'))])
        
        # Ensure we only take the exact sequence length
        selected_frames = all_frames[:self.seq_len]
        
        for frame_name in selected_frames:
            img_path = os.path.join(path, frame_name)
            img = cv2.imread(img_path)
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            img = cv2.resize(img, self.img_size)
            # MobileNetV2 preprocessing (scales pixels between -1 and 1)
            img = preprocess_input(img) 
            frames.append(img)
            
        return np.array(frames)