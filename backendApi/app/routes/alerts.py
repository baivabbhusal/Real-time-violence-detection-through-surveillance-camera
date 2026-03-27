"""
routes/alerts.py
----------------
Alert and incident history routes.

GET /alerts           — last 50 alerts for logged-in user
GET /alerts/<id>      — single alert detail
"""

from flask import Blueprint, jsonify, request
from app.auth_service import token_required
from app import models

alerts_bp = Blueprint("alerts", __name__, url_prefix="/alerts")


@alerts_bp.route("/", methods=["GET"])
@token_required
def get_alerts(current_user):
    """Returns the most recent 50 alerts for the logged-in user."""
    limit  = min(int(request.args.get("limit", 50)), 100)
    alerts = models.get_alerts_for_user(current_user["user_id"], limit=limit)
    return jsonify({"alerts": alerts, "count": len(alerts)}), 200