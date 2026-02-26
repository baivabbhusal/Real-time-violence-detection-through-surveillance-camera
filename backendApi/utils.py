from models import db, Users

def insert_dummy_data():
    if Users.query.count() == 0:
        dummy_users = [
            {'first_name': 'John', 'last_name': 'Doe', 'user_name': 'johndoe', 'password': 'superSecretPassword', 'email': 'john.doe@example.com'},
            {'first_name': 'Jane', 'last_name': 'Doe', 'user_name': 'janedoe', 'password': 'anotherSecret', 'email': 'jane.doe@example.com'}
        ]
        for user_info in dummy_users:
            new_user = Users(
                first_name=user_info['first_name'],
                last_name=user_info['last_name'],
                user_name=user_info['user_name'],
                password=user_info['password'],  # Pass plain text password; constructor handles hashing
                email=user_info['email']
            )
            db.session.add(new_user)
        db.session.commit()