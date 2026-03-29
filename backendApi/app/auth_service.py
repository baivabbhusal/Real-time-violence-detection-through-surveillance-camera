"""
auth_service.py
---------------
Password hashing with bcrypt (hash + salt handled automatically).
JWT token creation and verification.

bcrypt automatically generates a unique salt per password —
you never need to manage salts manually.
"""

import jwt
from datetime import datetime, timedelta, timezone
from flask_bcrypt import Bcrypt
from functools import wraps
from flask import request, jsonify
from app.config import Config

bcrypt = Bcrypt()


# ── Password helpers ──────────────────────────────────────────────────────────

def hash_password(plain_password: str) -> str:
    """
    Hashes a password using bcrypt.
    bcrypt internally generates a random 16-byte salt, runs 12 rounds of
    the Blowfish cipher, and embeds the salt in the output hash.
    The returned string is safe to store directly in MongoDB.

    Example output: '$2b$12$saltsaltsaltsaltsaltsahashhashhashhashhash'
    """
    return bcrypt.generate_password_hash(plain_password).decode("utf-8")


def verify_password(plain_password: str, stored_hash: str) -> bool:
    """
    Checks plain_password against the stored bcrypt hash.
    bcrypt extracts the salt from the hash automatically — no separate
    salt storage needed.
    Returns True if the password matches, False otherwise.
    """
    return bcrypt.check_password_hash(stored_hash, plain_password)


# ── JWT helpers ───────────────────────────────────────────────────────────────

def generate_token(user_id: str, email: str) -> str:
    """
    Creates a signed JWT token containing user_id and email.
    Token expires after JWT_ACCESS_TOKEN_EXPIRES_HOURS (default 24h).

    The token is signed with JWT_SECRET_KEY — anyone with the key can
    verify it, but cannot forge a new one without it.
    """
    payload = {
        "user_id": user_id,
        "email":   email,
        "exp":     datetime.now(timezone.utc) + timedelta(
                       hours=Config.JWT_ACCESS_TOKEN_EXPIRES_HOURS
                   ),
        "iat":     datetime.now(timezone.utc),   # issued at
    }
    return jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm="HS256")


def decode_token(token: str) -> dict | None:
    """
    Decodes and validates a JWT token.
    Returns the payload dict on success, None if expired or invalid.
    """
    try:
        return jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


# ── Route decorator ───────────────────────────────────────────────────────────

def token_required(f):
    """
    Decorator that protects any Flask route with JWT authentication.

    Usage:
        @cameras_bp.route("/cameras")
        @token_required
        def get_cameras(current_user):
            ...

    The client must send the token in the Authorization header:
        Authorization: Bearer <token>

    If valid, injects current_user dict (from decoded payload) as
    the first argument to the route function.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")

        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing or malformed token"}), 401

        token = auth_header.split(" ", 1)[1]
        payload = decode_token(token)

        if payload is None:
            return jsonify({"error": "Token is invalid or expired"}), 401

        return f(payload, *args, **kwargs)

    return decorated