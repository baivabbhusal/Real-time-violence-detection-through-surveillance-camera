"""
config.py
---------
Central config — loads everything from .env once.
All other files import from here, never from os.environ directly.
"""

import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    # Flask
    SECRET_KEY = os.getenv("FLASK_SECRET_KEY", "dev-secret-change-in-production")

    # JWT
    JWT_SECRET_KEY        = os.getenv("JWT_SECRET_KEY", "jwt-secret-change-in-production")
    JWT_ACCESS_TOKEN_EXPIRES_HOURS = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES_HOURS", 24))

    # MongoDB
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/visionguard")

    # Gmail
    GMAIL_SENDER       = os.getenv("GMAIL_SENDER")
    GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD")

    # Model
    MODEL_PATH = os.getenv(
        "MODEL_PATH",
        os.path.join(os.path.dirname(__file__), "../../aiEngine/artifacts/best_model.keras")
    )

    # Clip storage
    CLIPS_DIR = os.getenv("CLIPS_DIR", "./clips")

    # Detection
    DETECTION_THRESHOLD = float(os.getenv("DETECTION_THRESHOLD", 0.75))
    SEQUENCE_LENGTH     = int(os.getenv("SEQUENCE_LENGTH", 16))
    FRAME_SIZE          = (100, 100)