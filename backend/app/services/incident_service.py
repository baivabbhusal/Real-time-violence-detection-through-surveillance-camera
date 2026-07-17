from datetime import datetime

from app.models.incident_model import (
    incident_collection
)


# ---------------------------------------------------
# SAVE INCIDENT
# ---------------------------------------------------

def save_incident(
    confidence,
    image_path
):

    incident = {

        "confidence":
        float(confidence),

        "image":
        image_path,

        "timestamp":
        datetime.now()

    }

    result = incident_collection.insert_one(
        incident
    )

    return str(result.inserted_id)


# ---------------------------------------------------
# GET INCIDENTS
# ---------------------------------------------------

def get_incidents():

    incidents = list(

        incident_collection.find().sort(
            "timestamp",
            -1
        )

    )

    for incident in incidents:

        incident["_id"] = str(
            incident["_id"]
        )

        incident["timestamp"] = str(
            incident["timestamp"]
        )

    return incidents