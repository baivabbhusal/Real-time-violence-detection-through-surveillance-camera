from flask import Blueprint
from flask import jsonify
from flask import Response

from app.utils.decorators import token_required

from app.services.camera_service import (
    start_camera,
    stop_camera,
    get_camera,
    get_status
)

ai_bp = Blueprint(
    'ai_bp',
    __name__
)

# ---------------------------------------------------
# START AI
# ---------------------------------------------------

@ai_bp.route(
    '/start-ai',
    methods=['POST']
)
@token_required
def start_ai():

    result = start_camera()

    return result


# ---------------------------------------------------
# STOP AI
# ---------------------------------------------------

@ai_bp.route(
    '/stop-ai',
    methods=['POST']
)
@token_required
def stop_ai():

    result = stop_camera()

    return result


# ---------------------------------------------------
# STATUS
# ---------------------------------------------------

@ai_bp.route(
    '/status',
    methods=['GET']
)
def status():

    status_data = get_status()

    return jsonify(status_data)

# VIDEO FEED

@ai_bp.route(
    '/video-feed',
    methods=['GET']
)
def video_feed():

    camera = get_camera()

    if camera is None:

        return jsonify({
            'message': 'Camera not running'
        }), 404

    return Response(
        camera.generate_frames(),
        mimetype='multipart/x-mixed-replace; boundary=frame'
    )