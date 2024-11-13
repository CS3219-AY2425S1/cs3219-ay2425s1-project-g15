import html
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


def clean():
    with open(TARGET_FILE, "r") as f:
        data = json.load(f)
    for entry in data:
        questionid = entry.get("questionid")
        try:
            if questionid is not None:
                qn_doc = collection.find_one({"questionid": questionid})
                if qn_doc is None:
                    print(f"No document found with questionid {questionid}")
                    continue
                examples = qn_doc.get("examples", [])
                solution = entry.get("solution")

                cleaned_examples = html.unescape(
                    examples
                )  # Converts &quot; to ", &lt; to <, &gt; to >, etc.
                cleaned_solution = html.unescape(solution)

                result = collection.update_one(
                    {"questionid": questionid},
                    {
                        "$set": {
                            "examples": cleaned_examples,
                            "solution": cleaned_solution,
                        }
                    },
                )
                if result.matched_count > 0:
                    print(f"Updated document with questionid {questionid}")
                else:
                    print(f"No document found with questionid {questionid}")
        except Exception as e:
            print(f"Error: {e}")


if __name__ == "__main__":
    clean()
