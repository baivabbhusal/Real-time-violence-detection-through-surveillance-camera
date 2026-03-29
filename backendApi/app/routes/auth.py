"""
routes/auth.py
--------------
Authentication routes:
    POST /auth/register   — create new account
    POST /auth/login      — returns JWT token
    GET  /auth/me         — returns current user info (protected)
"""

from flask import Blueprint, request, jsonify
from app.auth_service import hash_password, verify_password, generate_token, token_required
from app import models

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


# ── Register ──────────────────────────────────────────────────────────────────

@auth_bp.route("/register", methods=["POST"])
def register():
    """
    Creates a new user account.

    Request body (JSON):
        { "name": "John", "email": "john@example.com", "password": "secret123" }

    Response 201:
        { "message": "Account created", "user_id": "..." }

    Response 400:
        { "error": "Email already registered" }
    """
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    name     = (data.get("name", "") or "").strip()
    email    = (data.get("email", "") or "").strip()
    password = data.get("password", "") or ""

    # Basic validation
    if not name:
        return jsonify({"error": "Name is required"}), 400
    if not email or "@" not in email:
        return jsonify({"error": "Valid email is required"}), 400
    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400

    # Check if email already exists
    existing = models.find_user_by_email(email)
    if existing:
        return jsonify({"error": "Email already registered"}), 400

    # Hash the password with bcrypt (salt generated automatically)
    password_hash = hash_password(password)

    user_id = models.create_user(name, email, password_hash)

    return jsonify({
        "message": "Account created successfully",
        "user_id": user_id,
    }), 201


# ── Login ─────────────────────────────────────────────────────────────────────

@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Authenticates a user and returns a JWT token.

    Request body (JSON):
        { "email": "john@example.com", "password": "secret123" }

    Response 200:
        { "token": "<jwt>", "user": { "id": "...", "name": "...", "email": "..." } }

    Response 401:
        { "error": "Invalid email or password" }
    """
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    email    = (data.get("email", "") or "").strip()
    password = data.get("password", "") or ""

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Look up user — use a generic error message to avoid
    # leaking whether an email exists in the system
    user = models.find_user_by_email(email)
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    if not verify_password(password, user["password_hash"]):
        return jsonify({"error": "Invalid email or password"}), 401

    token = generate_token(str(user["_id"]), user["email"])

    return jsonify({
        "token": token,
        "user": {
            "id":    str(user["_id"]),
            "name":  user["name"],
            "email": user["email"],
        },
    }), 200


# ── Current user ──────────────────────────────────────────────────────────────

@auth_bp.route("/me", methods=["GET"])
@token_required
def me(current_user):
    """
    Returns the currently authenticated user's profile.
    Requires Authorization: Bearer <token> header.
    """
    user = models.find_user_by_id(current_user["user_id"])
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id":         str(user["_id"]),
        "name":       user["name"],
        "email":      user["email"],
        "created_at": user["created_at"].isoformat(),
    }), 200