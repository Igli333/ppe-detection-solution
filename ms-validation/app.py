import requests
from flask import Flask, request
from elasticsearch import Elasticsearch
import datetime

from ValidationService import evaluate_results

app = Flask(__name__)
es = Elasticsearch("http://localhost:9200", basic_auth=("elastic", "password"))
LOG_INDEX = "evaluation_logs"


@app.route('/evaluate', methods=['POST'])
def evaluate():
    data = request.json
    user_id = data.get("user_id", None)
    camera_id = data.get("camera_id", None)
    result_data = data.get("result_date", None)

    message, type_of_error, missing_ppe = evaluate_results(result_data)
    timestamp = datetime.datetime.utcnow().isoformat()

    if type_of_error and missing_ppe:
        requests.post("http://localhost:5005/generate_notification",
                      json={
                          'userId': user_id,
                          'camera_id': camera_id,
                          "timestamp": timestamp,
                          "message": message,
                          "typeOfError": type_of_error,
                          "missingPpe": missing_ppe
                      }
                      )

    log_to_elasticsearch(timestamp, data, message)
    return 200


def log_to_elasticsearch(timestamp, data, message):
    log_entry = {
        'userId': data.user_id,
        'camera_id': data.camera_id,
        "timestamp": timestamp,
        "message": message,
        "typeOfError": data.type_of_error,
        "missingPpe": data.missing_ppe
    }

    es.index(index=LOG_INDEX, document=log_entry)


if __name__ == '__main__':
    app.run()
