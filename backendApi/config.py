# config.py
class Config:
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:@localhost:3307/demo'
    SECRET_KEY = 'a93fcf7d1d337e904d69f5cbd6aaeb9c2d80eb8a65999d7332399c66479965e9'
    DEBUG = True