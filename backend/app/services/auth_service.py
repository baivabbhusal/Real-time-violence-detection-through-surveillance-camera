from flask import jsonify
import datetime
import jwt

from app.database.connection import users_collection

SECRET_KEY = 'your_super_secret_key'

# REGISTER USER

def register_user(email, password):

    existing_user = users_collection.find_one({
        'email': email
    })

    if existing_user:

        return jsonify({
            'message': 'User already exists'
        }), 400

    users_collection.insert_one({
        'email': email,
        'password': password
    })

    return jsonify({
        'message': 'User registered successfully'
    }), 201

# LOGIN USER


def login_user(email, password):

    user = users_collection.find_one({
        'email': email,
        'password': password
    })

    if not user:

        return jsonify({
            'message': 'Invalid credentials'
        }), 401

    token = jwt.encode({

        'email': email,

        'exp': (
            datetime.datetime.utcnow()
            + datetime.timedelta(hours=24)
        )

    },
    SECRET_KEY,
    algorithm='HS256')

    return jsonify({
        'token': token
    }), 200