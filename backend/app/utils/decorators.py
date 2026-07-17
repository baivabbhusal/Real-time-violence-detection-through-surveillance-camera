from functools import wraps
from flask import request
from flask import jsonify

from app.utils.jwt_helper import verify_token


# ---------------------------------------------------
# TOKEN REQUIRED DECORATOR
# ---------------------------------------------------

def token_required(f):

    @wraps(f)
    def decorated(*args, **kwargs):

        token = request.headers.get(
            'Authorization'
        )

        if not token:

            return jsonify({
                'message': 'Token is missing'
            }), 401

        decoded = verify_token(token)

        if not decoded:

            return jsonify({
                'message': 'Invalid or expired token'
            }), 401

        return f(*args, **kwargs)

    return decorated