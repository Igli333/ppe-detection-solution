import requests
from flask import Flask, request
from KafkaConsumer import reading_stream
import redis
from flask_socketio import SocketIO, emit

from UsersService import find_user

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", message_queue="redis://redis:6379")
redis_client = redis.Redis(host="redis", port=6379, db=0)


@app.route('/')
def initiate():
    reading_stream()


@socketio.on('connect')
def handle_connection(message):
    username = message.get('username')
    user_id = find_user(username)

    if user_id:  # perform proper authentication
        redis_client.set(user_id, request.sid)


@socketio.on("disconnect")
def handle_disconnect():
    user_id = next((for k in redis_client.keys() if redis_client.get(k).decode() == request.sid), None)
    if user_id:
        redis_client.delete("user_id")
        print(f"User {user_id} disconnected")


@app.post('/notification')
def notification(data):
    user_id = data.get('user_id')
    camera_id = data.get('camera_id')
    notification_message = data.get('message')

    session_id = redis_client.get(user_id)
    if session_id:
        socketio.emit("notification", {"camera": camera_id, "message": notification_message})
        return 200
    else:
        return 404


@app.get('/notifications')
def archived_notifications(user_id, camera_id):
    dictionary = {
        "user_id": user_id,
        "camera_id": camera_id,
    }

    data = requests.get("https://localhost:5005/get_notifications_of_user", params=dictionary)
    return data.json()


if __name__ == '__main__':
    app.run()
