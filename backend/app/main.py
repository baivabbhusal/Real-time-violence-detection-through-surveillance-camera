from flask import Flask
from flask_cors import CORS
from flask import send_from_directory

# Route Blueprints
from app.routes.auth_routes import auth_bp
from app.routes.ai_routes import ai_bp
from app.routes.incident_routes import (
    incident_bp
)

def create_app():

    app = Flask(__name__)

    # BASIC CONFIG

    app.config['SECRET_KEY'] = 'your_super_secret_key'

    # ENABLE CORS

    CORS(app)

    # REGISTER ROUTES

    app.register_blueprint(
        auth_bp,
        url_prefix='/api'
    )

    app.register_blueprint(
        ai_bp,
        url_prefix='/api'
    )

    app.register_blueprint(
        incident_bp
    )

    # HEALTH CHECK

    @app.route('/')
    def home():

        return {
            "message": "VisionGuard Backend Running"
        }
    @app.route('/alerts/<path:filename>')

    def serve_alert(filename):

        return send_from_directory(
             '../alerts',
             filename
        )

    return app

# RUN SERVER

if __name__ == '__main__':

    app = create_app()

    app.run(
        host='0.0.0.0',
        port=5000,
        debug=False,
        use_reloader=False
    )