import os
import json
import re

solutions_dir = "../../../../leetcode-js"


def main():
    with open("qn_full.json", "r") as f:
        questions = json.load(f)

    for question in questions:
        title_slug = question["slug"]
        # Create a regex pattern to match files with a numerical prefix followed by the titleSlug
        pattern = re.compile(rf"^\d+-{re.escape(title_slug)}\.\w+$")

        # Search for matching files in the solutions directory
        matched_files = [f for f in os.listdir(solutions_dir) if pattern.match(f)]

        if matched_files:
            # If multiple matches are found, you may need additional logic to select the correct one
            solution_filename = matched_files[
                0
            ]  # Assuming the first match is the desired one
            solution_path = os.path.join(solutions_dir, solution_filename)
            with open(solution_path, "r") as sol_file:
                solution_content = sol_file.read()
            # Add the solution content to the question data
            question["solution"] = solution_content
        else:
            question["solution"] = None  # Or handle as needed

    # Save the updated questions with solutions
    with open("questions_with_solutions.json", "w") as f:
        json.dump(questions, f, indent=4)


if __name__ == "__main__":
    main()
