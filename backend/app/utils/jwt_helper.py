import jwt
import datetime

SECRET_KEY = 'your_super_secret_key'


# ---------------------------------------------------
# GENERATE JWT TOKEN
# ---------------------------------------------------

def generate_token(email):

    payload = {

        'email': email,

        'exp': (
            datetime.datetime.utcnow()
            + datetime.timedelta(hours=24)
        )
    }

    token = jwt.encode(
        payload,
        SECRET_KEY,
        algorithm='HS256'
    )

    return token


# ---------------------------------------------------
# VERIFY JWT TOKEN
# ---------------------------------------------------

def verify_token(token):

    try:

        decoded = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=['HS256']
        )

        return decoded

    except jwt.ExpiredSignatureError:

        return None

    except jwt.InvalidTokenError:

        return None