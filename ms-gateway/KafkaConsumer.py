from kafka import KafkaConsumer
import numpy as np
import cv2
import requests

consumer_video = KafkaConsumer('video-stream', bootstrap_servers='localhost:9092')


def reading_stream():
    for msg in consumer_video:
        user_id = msg.user_id
        camera_id = msg.camera_id
        img_frame = msg.value
        frame = np.frombuffer(img_frame, dtype=np.uint8)
        img = cv2.imdecode(frame, cv2.IMREAD_COLOR)

        _, buffer = cv2.imencode('.jpg', img)

        requests.post("http://localhost:5001/load_frame",
                      json={'userId': user_id, 'camera_id': camera_id},
                      files={'file': buffer.tobytes()}
                      )
