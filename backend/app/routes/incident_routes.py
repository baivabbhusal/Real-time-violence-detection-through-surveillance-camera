from flask import Blueprint
from flask.json import jsonify

from app.services.incident_service import (
    get_incidents
)

from app.utils.decorators import (
    token_required
)


incident_bp = Blueprint(
    'incident_bp',
    __name__
)


# ---------------------------------------------------
# GET INCIDENTS
# ---------------------------------------------------

@incident_bp.route(
    '/api/incidents',
    methods=['GET']
)

@token_required

def incidents():

    data = get_incidents()

    return jsonify(data)