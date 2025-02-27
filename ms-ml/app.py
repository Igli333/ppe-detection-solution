import redis
import requests
import numpy as np
import cv2

from flask import Flask, request, jsonify
from flask_socketio import SocketIO
from YoloRecognitionModel import recognize_ppe

app = Flask(__name__)

redis_client = redis.Redis(host="redis", port=6379, db=0)
socketio = SocketIO(app, cors_allowed_origins="*", message_queue="redis://redis:6379")


@app.route('/perform_recognition')
def perform_recognition():
    user_id = request.form.get('userId')
    camera_id = request.form.get('camera_id')

    file = request.files.get('file')
    if file is None:
        return jsonify({"error": "No file uploaded"}), 400

    image_bytes = file.read()
    np_arr = np.frombuffer(image_bytes, np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    result_data, result_image = recognize_ppe(frame)
    _, buffer = cv2.imencode('.jpg', result_image)

    session_id = redis_client.get(user_id + "-" + camera_id)
    if session_id:
        requests.post("http://localhost:5004/stream_detection_results",
                      json={'userId': user_id, 'camera_id': camera_id},
                      files={'file': buffer.tobytes()}
                      )
    if result_data:
        requests.post("http://localhost:5003/evaluate",
                          json={
                              'userId': user_id,
                              'camera_id': camera_id,
                              "result": result_data
                          }
                      )
    return 200


if __name__ == '__main__':
    app.run()
