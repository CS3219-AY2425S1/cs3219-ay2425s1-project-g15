const { LeetCode } = require("leetcode-query");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();

const leetcode = new LeetCode();
const client = new MongoClient(
  "mongodb+srv://cs3219:zpAKCgY8xDxgIz0z@questionbank.4xtdt.mongodb.net/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

async function fetchQuestionDetails(titleSlug) {
  try {
    const question = await leetcode.problem(titleSlug);
    return question;
  } catch (error) {
    console.error(`Error fetching question ${titleSlug}:`, error);
    return null;
  }
}

function parseExamples(content) {
  const examplePattern =
    /<strong class="example">Example (\d+):<\/strong>.*?<strong>Input:<\/strong>\s*(.*?)\s*<strong>Output:<\/strong>\s*(.*?)\s*(?:<strong>Explanation:<\/strong>\s*(.*?))?<\/pre>/gs;
  const matches = [...content.matchAll(examplePattern)];
  return matches.map((match, index) => ({
    example_num: index + 1,
    expected_input: match[2].trim(),
    expected_output: match[3].trim(),
    explanation: match[4] ? match[4].trim() : "",
  }));
}

async function populateQuestionsWithExamples() {
  try {
    await client.connect();
    const db = client.db("questionbank");
    const collection = db.collection("questions");

    const questions = await collection.find().toArray();
    const outputFilePath = path.join(__dirname, "qn_full.json");
    const outputStream = fs.createWriteStream(outputFilePath, { flags: "w" });

    for (const [index, question] of questions.entries()) {
      try {
        console.log(`Processing question ${index + 1}: ${question.title}`);
        const questionDetails = await fetchQuestionDetails(question.slug);
        if (questionDetails) {
          const examples = parseExamples(questionDetails.content);
          question.examples = examples;
          outputStream.write(JSON.stringify(question, null, 2) + ",\n");
        }
      } catch (error) {
        console.error(`Error processing question ${question.title}:`, error);
      }
    }

    outputStream.end();
    console.log("Processing completed.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    await client.close();
  }
}

populateQuestionsWithExamples();
