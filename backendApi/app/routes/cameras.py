"""
routes/cameras.py
-----------------
Camera management and live streaming routes.

GET  /cameras              — list all cameras for logged-in user
POST /cameras              — add a new camera
DELETE /cameras/<id>       — remove a camera
GET  /cameras/<id>/stream  — MJPEG live stream (browser video src)
POST /cameras/<id>/start   — start detection on a camera
POST /cameras/<id>/stop    — stop detection on a camera
"""

from flask import Blueprint, request, jsonify, Response
from app.auth_service import token_required
from app import models, stream_handler

cameras_bp = Blueprint("cameras", __name__, url_prefix="/cameras")


# ── List cameras ──────────────────────────────────────────────────────────────

@cameras_bp.route("/", methods=["GET"])
@token_required
def list_cameras(current_user):
    """Returns all cameras belonging to the logged-in user."""
    cameras = models.get_cameras_for_user(current_user["user_id"])
    return jsonify({"cameras": cameras}), 200


# ── Add camera ────────────────────────────────────────────────────────────────

@cameras_bp.route("/", methods=["POST"])
@token_required
def add_camera(current_user):
    """
    Adds a new camera.

    Request body:
        {
            "name":     "Front Door",
            "rtsp_url": "rtsp://192.168.1.100:554/stream",
            "location": "Main entrance"   (optional)
        }

    For webcam testing use rtsp_url: "0" (device index 0)
    """
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    name     = (data.get("name", "") or "").strip()
    rtsp_url = (data.get("rtsp_url", "") or "").strip()
    location = (data.get("location", "") or "").strip()

    if not name:
        return jsonify({"error": "Camera name is required"}), 400
    if not rtsp_url:
        return jsonify({"error": "RTSP URL is required"}), 400

    camera_id = models.add_camera(
        owner_id = current_user["user_id"],
        name     = name,
        rtsp_url = rtsp_url,
        location = location,
    )

    return jsonify({
        "message":   "Camera added",
        "camera_id": camera_id,
    }), 201


# ── Delete camera ─────────────────────────────────────────────────────────────

@cameras_bp.route("/<camera_id>", methods=["DELETE"])
@token_required
def delete_camera(current_user, camera_id):
    stream_handler.stop_stream(camera_id)
    deleted = models.delete_camera(camera_id, current_user["user_id"])

    if not deleted:
        return jsonify({"error": "Camera not found"}), 404

    return jsonify({"message": "Camera removed"}), 200


# ── Start detection ───────────────────────────────────────────────────────────

@cameras_bp.route("/<camera_id>/start", methods=["POST"])
@token_required
def start_detection(current_user, camera_id):
    """
    Starts the background detection thread for a camera.
    The stream handler opens the RTSP connection and begins processing.
    """
    camera = models.get_camera_by_id(camera_id, current_user["user_id"])
    if not camera:
        return jsonify({"error": "Camera not found"}), 404

    user = models.find_user_by_id(current_user["user_id"])

    stream_handler.start_stream(
        camera_id   = camera_id,
        owner_id    = current_user["user_id"],
        rtsp_url    = camera["rtsp_url"],
        owner_email = user["email"],
    )

    return jsonify({"message": f"Detection started for camera {camera_id}"}), 200


# ── Stop detection ────────────────────────────────────────────────────────────

@cameras_bp.route("/<camera_id>/stop", methods=["POST"])
@token_required
def stop_detection(current_user, camera_id):
    stream_handler.stop_stream(camera_id)
    return jsonify({"message": f"Detection stopped for camera {camera_id}"}), 200


# ── MJPEG live stream ─────────────────────────────────────────────────────────

@cameras_bp.route("/<camera_id>/stream", methods=["GET"])
@token_required
def live_stream(current_user, camera_id):
    """
    Streams live MJPEG frames to the browser.

    Use in frontend as:
        <img src="/cameras/<id>/stream" />

    The browser renders it as a live video — no WebSocket needed.
    The Authorization header must still be sent (use fetch + blob URL for this,
    or temporarily issue a short-lived stream token).
    """
    camera = models.get_camera_by_id(camera_id, current_user["user_id"])
    if not camera:
        return jsonify({"error": "Camera not found"}), 404

    active_stream = stream_handler.get_stream(camera_id)

    if not active_stream:
        # Auto-start stream if not running
        user = models.find_user_by_id(current_user["user_id"])
        active_stream = stream_handler.start_stream(
            camera_id   = camera_id,
            owner_id    = current_user["user_id"],
            rtsp_url    = camera["rtsp_url"],
            owner_email = user["email"],
        )

    return Response(
        active_stream.generate_mjpeg(),
        mimetype="multipart/x-mixed-replace; boundary=frame",
    )