# app.py
from flask import Flask, render_template, redirect, url_for, session

from auth import auth_bp
from config import Config
from models import db, Users  # Import db and Users from models.py
from utils import insert_dummy_data

app = Flask(__name__)
app.config.from_object(Config)  # Load configurations from Config object

db.init_app(app)

# Register the Blueprint
app.register_blueprint(auth_bp)

@app.route('/', methods=['GET'])
def home():
    return render_template('login.html')  # Render login page


@app.route('/main', methods=['GET'])
def main_page():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    user_id = session['user_id']
    user = Users.query.get(user_id)

    return render_template('main.html', user=user)


if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Ensure all tables are created
        insert_dummy_data()
    app.run()