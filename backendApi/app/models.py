"""
models.py
---------
MongoDB collection wrappers.
Each function is a thin helper — no ORM, just clean pymongo calls.

Collections:
    users    — registered accounts
    cameras  — RTSP camera entries per user
    alerts   — violence detection incidents
"""

from datetime import datetime, timezone
from pymongo import MongoClient, DESCENDING
from bson import ObjectId
from app.config import Config

# Single shared client — pymongo handles connection pooling internally
_client = MongoClient(Config.MONGO_URI)
_db     = _client.get_default_database()

users_col   = _db["users"]
cameras_col = _db["cameras"]
alerts_col  = _db["alerts"]

# ── Indexes (run once on startup) ─────────────────────────────────────────────

def create_indexes():
    users_col.create_index("email", unique=True)
    cameras_col.create_index("owner_id")
    alerts_col.create_index([("created_at", DESCENDING)])
    alerts_col.create_index("camera_id")


# ── User helpers ──────────────────────────────────────────────────────────────

def create_user(name: str, email: str, password_hash: str) -> str:
    """
    Inserts a new user document.
    Returns the inserted document's string id.
    """
    doc = {
        "name":          name,
        "email":         email.lower().strip(),
        "password_hash": password_hash,
        "created_at":    datetime.now(timezone.utc),
    }
    result = users_col.insert_one(doc)
    return str(result.inserted_id)


def find_user_by_email(email: str) -> dict | None:
    return users_col.find_one({"email": email.lower().strip()})


def find_user_by_id(user_id: str) -> dict | None:
    try:
        return users_col.find_one({"_id": ObjectId(user_id)})
    except Exception:
        return None


# ── Camera helpers ────────────────────────────────────────────────────────────

def add_camera(owner_id: str, name: str, rtsp_url: str, location: str = "") -> str:
    """
    Adds a new camera for a user.
    rtsp_url can be an RTSP stream URL or a local device index (e.g. "0" for webcam).
    Returns the new camera's string id.
    """
    doc = {
        "owner_id":   owner_id,
        "name":       name,
        "rtsp_url":   rtsp_url,
        "location":   location,
        "active":     True,
        "created_at": datetime.now(timezone.utc),
    }
    result = cameras_col.insert_one(doc)
    return str(result.inserted_id)


def get_cameras_for_user(owner_id: str) -> list[dict]:
    cameras = cameras_col.find({"owner_id": owner_id, "active": True})
    return [_serialize(c) for c in cameras]


def get_camera_by_id(camera_id: str, owner_id: str) -> dict | None:
    try:
        doc = cameras_col.find_one({
            "_id":      ObjectId(camera_id),
            "owner_id": owner_id,
            "active":   True,
        })
        return _serialize(doc) if doc else None
    except Exception:
        return None


def delete_camera(camera_id: str, owner_id: str) -> bool:
    result = cameras_col.update_one(
        {"_id": ObjectId(camera_id), "owner_id": owner_id},
        {"$set": {"active": False}}
    )
    return result.modified_count > 0


# ── Alert helpers ─────────────────────────────────────────────────────────────

def create_alert(camera_id: str, owner_id: str, label: str,
                 confidence: float, clip_path: str) -> str:
    """
    Records a violence detection incident.
    label: "Violence" or "Weaponized"
    confidence: model's output probability (0.0 – 1.0)
    clip_path: local path to the saved video clip
    """
    doc = {
        "camera_id":  camera_id,
        "owner_id":   owner_id,
        "label":      label,
        "confidence": round(confidence, 4),
        "clip_path":  clip_path,
        "created_at": datetime.now(timezone.utc),
        "notified":   False,
    }
    result = alerts_col.insert_one(doc)
    return str(result.inserted_id)


def mark_alert_notified(alert_id: str):
    alerts_col.update_one(
        {"_id": ObjectId(alert_id)},
        {"$set": {"notified": True}}
    )


def get_alerts_for_user(owner_id: str, limit: int = 50) -> list[dict]:
    docs = alerts_col.find(
        {"owner_id": owner_id},
        sort=[("created_at", DESCENDING)],
        limit=limit
    )
    return [_serialize(d) for d in docs]


# ── Serialization helper ──────────────────────────────────────────────────────

def _serialize(doc: dict) -> dict:
    """Converts ObjectId and datetime to JSON-safe strings."""
    if doc is None:
        return None
    doc["id"]         = str(doc.pop("_id"))
    doc["created_at"] = doc["created_at"].isoformat()
    return doc