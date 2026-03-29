"""
main.py
-------
Flask application factory.
Creates the app, registers all blueprints, and initialises extensions.

Run locally:
    python main.py

Run in production (gunicorn):
    gunicorn -w 1 -b 0.0.0.0:5000 "app.main:create_app()"
    (use 1 worker — model is loaded as a global singleton)
"""

from flask import Flask, jsonify
from flask_bcrypt import Bcrypt
from flask_cors import CORS

from app.config import Config
from app import models as db

# ── Extensions (initialised without app, bound in create_app) ─────────────────
bcrypt = Bcrypt()


def create_app() -> Flask:
    app = Flask(__name__)
    app.config["SECRET_KEY"] = Config.SECRET_KEY

    # Allow requests from your React frontend during development
    CORS(app, resources={r"/*": {"origins": "*"}})

    # Bind extensions
    bcrypt.init_app(app)

    # Create MongoDB indexes on startup
    with app.app_context():
        db.create_indexes()

    # ── Register blueprints ───────────────────────────────────────────────────
    from app.routes.auth    import auth_bp
    from app.routes.cameras import cameras_bp
    from app.routes.alerts  import alerts_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(cameras_bp)
    app.register_blueprint(alerts_bp)

    # ── Health check ──────────────────────────────────────────────────────────
    @app.route("/health")
    def health():
        return jsonify({"status": "ok", "service": "VisionGuard API"}), 200

    # ── Global error handlers ─────────────────────────────────────────────────
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Route not found"}), 404

    @app.errorhandler(405)
    def method_not_allowed(e):
        return jsonify({"error": "Method not allowed"}), 405

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"error": "Internal server error"}), 500

    return app


if __name__ == "__main__":
    app = create_app()
    # debug=False in production — set to True only during development
    app.run(host="0.0.0.0", port=5000, debug=True, threaded=True)