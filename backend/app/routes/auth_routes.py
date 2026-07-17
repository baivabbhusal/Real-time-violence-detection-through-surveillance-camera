from flask import Blueprint
from flask import request
from flask import jsonify

from app.services.auth_service import (
    register_user,
    login_user
)

auth_bp = Blueprint(
    'auth_bp',
    __name__
)

# ---------------------------------------------------
# REGISTER
# ---------------------------------------------------

@auth_bp.route(
    '/register',
    methods=['POST']
)
def register():

    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    if not email or not password:

        return jsonify({
            'message': 'Email and password required'
        }), 400

    result = register_user(
        email,
        password
    )

    return result


# ---------------------------------------------------
# LOGIN
# ---------------------------------------------------

@auth_bp.route(
    '/login',
    methods=['POST']
)
def login():

    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    if not email or not password:

        return jsonify({
            'message': 'Email and password required'
        }), 400

    result = login_user(
        email,
        password
    )

    return result