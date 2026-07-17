import os

from pymongo import MongoClient
from dotenv import load_dotenv


# ---------------------------------------------------
# LOAD ENV VARIABLES
# ---------------------------------------------------

load_dotenv()

MONGO_URI = os.getenv(
    'MONGO_URI'
)

# ---------------------------------------------------
# CONNECT DATABASE
# ---------------------------------------------------

client = MongoClient(MONGO_URI)

db = client['visionguard_db']

users_collection = db['users']

print('MongoDB connected successfully.')