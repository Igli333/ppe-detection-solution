import requests
from flask import Flask, request, jsonify
import cv2
import numpy as np

from DataProcessingService import process

app = Flask(__name__)


@app.route('/load_frame', methods=['POST'])
def load_frame():
    user_id = request.form.get('userId')
    camera_id = request.form.get('camera_id')

    file = request.files.get('file')
    if file is None:
        return jsonify({"error": "No file uploaded"}), 400

    image_bytes = file.read()
    np_arr = np.frombuffer(image_bytes, np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    processed_frame = process(frame)
    _, buffer = cv2.imencode('.jpg', processed_frame)

    requests.post("http://localhost:5002/perform_recognition",
                  json={'userId': user_id, 'camera_id': camera_id},
                  files={'file': buffer.tobytes()}
                  )
    return 200


if __name__ == '__main__':
    app.run()
