from app.database.connection import db


# ---------------------------------------------------
# INCIDENT COLLECTION
# ---------------------------------------------------

incident_collection = (
    db['incidents']
)