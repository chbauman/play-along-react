"""This script contains some experiment with MongoDB.

The idea would be to serve the scores from a MongoDB instead of 
having all XML files in the Github repository.
"""
import json
import os
from pathlib import Path

import requests


PUBLIC_PATH = Path("play-along/public")
RAW_SCORES_PATH = PUBLIC_PATH / "scores"
REDUCED_SCORES_PATH = PUBLIC_PATH / "scores"
JSON_SCORE_INFO = PUBLIC_PATH / "score_info.json"


if __name__ == "__main__":
    with open(JSON_SCORE_INFO) as f:
        json_info = json.load(f)

    for info in json_info:
        print(info)

    url = (
        "https://data.mongodb-api.com/app/data-iydcr/endpoint/data/v1/action/insertOne"
    )
    payload = json.dumps(
        {
            "collection": "scores",
            "database": "ytp",
            "dataSource": "Cluster0",
            "document": {"test": "another test"},
        }
    )
    headers = {
        "Content-Type": "application/json",
        "Access-Control-Request-Headers": "*",
        "api-key": os.environ.get("MDB_API_KEY"),
    }
    response = requests.request("POST", url, headers=headers, data=payload)
    print(response.text)
