import json
from typing import List
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

client = MongoClient(os.getenv("MONGODB_URI"))
db = client["questionbank"]
collection = db["questions"]


def populate_qns_with_examples():
    with open("qn_full.json", "r") as f:
        data = json.load(f)
    for entry in data:
        questionid = entry.get("questionid")
        examples = entry.get("examples", [])
        if questionid is not None:
            result = collection.update_one(
                {"questionid": questionid}, {"$set": {"examples": examples}}
            )
            if result.matched_count > 0:
                print(f"Updated document with questionid {questionid}")
            else:
                print(f"No document found with questionid {questionid}")
        else:
            print("Entry missing 'questionid' field")


if __name__ == "__main__":
    populate_qns_with_examples()
