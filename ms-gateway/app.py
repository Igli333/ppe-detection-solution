import requests
from engineio.async_drivers import eventlet
from flask import Flask, request
from KafkaConsumer import reading_stream
import redis
from flask_socketio import SocketIO, emit
import numpy as np
import eventlet
import cv2

from UsersService import find_user

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", message_queue="redis://redis:6379")
redis_client = redis.Redis(host="redis", port=6379, db=0)
eventlet.monkey_patch()


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
def archived_notifications(data):
    dictionary = {
        "user_id": data.get("user_id"),
        "camera_id": data.get("camera_id")
    }

    data = requests.get("https://localhost:5005/get_notifications_of_user", params=dictionary)
    return data.json()


@app.get("/request_streaming")
def request_streaming(data):
    user_id = data.get('user_id')
    camera_id = data.get('camera_id')

    if user_id and camera_id:
        redis_client.set(user_id + "-" + camera_id, request.sid)

    return 200


@socketio.on('streaming')
def streaming(data):
    while True:
        response = requests.get(
            "http://localhost:5004/stream?user_id=" + data.get("user_id") + "&camera_id=" + data.get("camera_id"))
        if response.status_code != 200:
            continue

        frame_bytes = np.frombuffer(response.content, dtype=np.uint8)
        frame = cv2.imdecode(frame_bytes, cv2.IMREAD_COLOR)

        _, buffer = cv2.imencode('.jpg', frame)
        socketio.emit("video_frame", buffer.tobytes())

        eventlet.sleep(0.03)


if __name__ == '__main__':
    app.run()
