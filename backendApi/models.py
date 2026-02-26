# models.py
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash

db = SQLAlchemy()

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    user_name = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)  # Increase size to handle large hashes
    email = db.Column(db.String(100), unique=True, nullable=False)

    def __init__(self, first_name, last_name, user_name, password, email):
        self.first_name = first_name
        self.last_name = last_name
        self.user_name = user_name
        self.password_hash = generate_password_hash(password)
        self.email = email

    def to_dict(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "user_name": self.user_name,
            "email": self.email
        }