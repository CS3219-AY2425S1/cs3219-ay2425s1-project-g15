import html
import json
from typing import List
from pymongo import MongoClient
import re
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
    for entry in data[1:]:
        questionid = entry.get("questionid")
        print("Processing questionid", questionid)
        try:
            if questionid is not None:
                qn_doc = collection.find_one({"questionid": questionid})
                if qn_doc is None:
                    print(f"No document found with questionid {questionid}")
                    continue
                examples = qn_doc.get("examples", [])
                solution = entry.get("solution")

                cleaned_examples = []
                cleaned_solution = ""
                if examples:
                    for example in examples:
                        new_example = {}
                        new_example["expected_input"] = html.unescape(
                            example.get("expected_input")
                        )
                        new_example["expected_input"] = re.sub(
                            r"<[^>]+>", "", new_example["expected_input"]
                        )
                        new_example["expected_output"] = html.unescape(
                            example.get("expected_output")
                        )
                        new_example["expected_output"] = re.sub(
                            r"<[^>]+>", "", new_example["expected_output"]
                        )
                        if example.get("explanation"):
                            new_example["explanation"] = html.unescape(
                                example.get("explanation")
                            )
                            new_example["explanation"] = re.sub(
                                r"<[^>]+>", "", new_example["explanation"]
                            )

                        cleaned_examples.append(new_example)
                if solution:
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
