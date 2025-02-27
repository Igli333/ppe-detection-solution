import pymongo

from User import User

mongo_client = pymongo.MongoClient("mongodb://localhost:27017/")
db = mongo_client["ppe_database"]
users_collection = db["users"]


def find_user(username):
    for usr in users_collection.find_one({"username": username}):
        user_obj = User.from_dict(usr)
        return user_obj.user_id
