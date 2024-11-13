import json
from typing import List
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

client = MongoClient(os.getenv("MONGODB_URI"))
db = client["questionbank"]
collection = db["questions"]

TARGET_FILE = "qn_full_with_soln.json"


def populate_qns_from_file():
    with open(TARGET_FILE, "r") as f:
        data = json.load(f)
    for entry in data:
        questionid = entry.get("questionid")
        examples = entry.get("examples", [])
        solution = entry.get("solution")
        if questionid is not None:
            result = collection.update_one(
                {"questionid": questionid},
                {"$set": {"examples": examples, "solution": solution}},
            )
            if result.matched_count > 0:
                print(f"Updated document with questionid {questionid}")
            else:
                print(f"No document found with questionid {questionid}")
        else:
            print("Entry missing 'questionid' field")


if __name__ == "__main__":
    populate_qns_from_file()
