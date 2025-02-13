import express, { Request, Response } from "express";
import { validationResult } from "express-validator";
import Question, { TQuestion } from "../models/Question";
import {
  countQuestionValidators,
  createQuestionValidators,
  idValidators,
  pickQuestionValidators,
  updateQuestionValidators,
} from "./validators";

/**
 * Router for the question service.
 */

const router = express.Router();

router.get("/", (req, res) => {
  console.log("Sending Greetings!");
  res.send("Hello from question service!");
});

// Create a new question
router.post(
  "/create",
  [...createQuestionValidators],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { title, description, category, complexity, examples, solution } = req.body;

      const existingQuestion = await Question.findOne({ title: title.trim() });
      if (existingQuestion) {
        return res.status(400).json({
          message: "A question with this title already exists",
        });
      }

      const question = {
        title,
        description,
        category,
        complexity,
        examples,
        solution,
        deleted: false,
      };
      const newQuestion = new Question(question);
      await newQuestion.save();
      return res.status(200).json({
        message: "Question created successfully",
        question: newQuestion,
      });
    } catch (error) {
      return res.status(500).send("Internal server error");
    }
  }
);

// Retrieve all questions
router.post("/all", async (req: Request, res: Response) => {
  let pagination = parseInt(req.body.pagination as string, 10) || 1; // Default page is 1
  const page_size = parseInt(req.body.page_size as string, 10) || 10; // Default limit is 10
  const skip = (pagination - 1) * page_size; // Calculate how many documents to skip

  const { title, complexity, category } = req.body;

  const query: any = { deleted: false };
  if (title && title !== "") query.title = { $regex: title, $options: "i" };
  if (complexity && complexity.length > 0)
    query.complexity = { $in: complexity };
  if (category && category.length > 0) query.category = { $in: category };

  try {
    const questions = await Question.find(query, {
      questionid: 1,
      title: 1,
      description: 1,
      complexity: 1,
      category: 1,
    })
      .lean()
      .sort({ questionid: "ascending" })
      .skip(skip)
      .limit(page_size)
      .exec();

    const total = await Question.countDocuments(query).exec();
    const totalPages = Math.ceil(total / page_size);
    if (totalPages < pagination) pagination = 1;

    return res.json({
      questions,
      currentPage: pagination,
      totalPages: totalPages,
      totalQuestions: total,
    });
  } catch (error) {
    return res.status(500).send("Internal server error");
  }
});

// Retrieve all questions based on a list of question ids
router.post("/all-ids", async (req: Request, res: Response) => {
  const questionIds = req.body.questionIds;

  try {
    const questions = await Question.find(
      {
        questionid: { $in: questionIds },
      },
      {
        questionid: 1,
        title: 1,
        description: 1,
        complexity: 1,
        examples: 1,
        solution: 1,
        category: 1,
      }).lean().exec();
    return res.json(questions);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// Retrieve a specific question by id
router.get("/:id", [...idValidators], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const questionId = parseInt(req.params.id, 10);
  try {
    const question = await Question.findOne(
      { questionid: questionId },
      {
        questionid: 1,
        title: 1,
        description: 1,
        complexity: 1,
        category: 1,
        deleted: 1,
        examples: 1,
        solution: 1,
      }
    ).exec();

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    return res.json(question);
  } catch (error) {
    return res.status(500).send("Internal server error");
  }
});

// Retrieve the number of questions by complexity and category
router.post(
  "/count-question",
  [...countQuestionValidators],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { complexity, category } = req.body;

    try {
      const countPromises = complexity.map((com: string, index: number) => {
        const cat = category[index];
        const query: any = {
          deleted: false,
          complexity: com,
          category: { $in: [cat] },
        };
        return Question.countDocuments(query).exec();
      });

      const counts = await Promise.all(countPromises);

      return res.json({ counts });
    } catch (error) {
      return res.status(500).send("Internal server error");
    }
  }
);

// Retrieve a random question by complexity and category
router.post(
  "/pick-question",
  [...pickQuestionValidators],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { complexity, category } = req.body;

    const query: any = { deleted: false };
    if (complexity) query.complexity = complexity;
    if (category) query.category = { $in: [category] };

    try {
      let randomQuestion = await Question.aggregate([
        { $match: query }, // Filter by complexity and category
        { $sample: { size: 1 } }, // Randomly select one document
        {
          $project: {
            questionid: 1,
          },
        },
      ]).exec();

      if (!randomQuestion.length) {
        query.deleted = true; // Adjust the query to allow deleted questions
        randomQuestion = await Question.aggregate([
          { $match: query }, // Filter by complexity, category, and deleted
          { $sample: { size: 1 } }, // Randomly select one document
          {
            $project: {
              questionid: 1,
            },
          },
        ]).exec();
      }

      if (!randomQuestion.length) {
        return res.status(404).json({ message: "No questions found" });
      }

      return res.json(randomQuestion[0]);
    } catch (error) {
      return res.status(500).send("Internal server error");
    }
  }
);

// Update a specific question by id
router.post(
  "/:id/update",
  [...updateQuestionValidators],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const questionId = parseInt(req.params.id);
    const updateData: Partial<TQuestion> = {};
    console.log(req.body)
    if (req.body.title) {
      const existingQuestion = await Question.findOne({
        title: req.body.title.trim(),
      });
      if (existingQuestion && existingQuestion.questionid && existingQuestion.questionid !== questionId) {
        return res.status(400).json({
          message: "A question with this title already exists",
        });
      }

      updateData.title = req.body.title;
    }
    if (req.body.description) {
      updateData.description = req.body.description;
    }
    if (req.body.category) {
      updateData.category = req.body.category;
    }
    if (req.body.complexity) {
      updateData.complexity = req.body.complexity;
    }
    if (req.body.examples) {
      updateData.examples = req.body.examples;
    }
    if (req.body.solution) {
      updateData.solution = req.body.solution;
    }

    try {
      const question = await Question.findOne(
        { questionid: questionId },
        {
          questionid: 1,
          title: 1,
          description: 1,
          complexity: 1,
          category: 1,
          examples: 1,
          solution: 1,
          deleted: 1,
        }
      ).exec();
      if (!question || question.deleted) {
        return res.status(404).json({ message: "Question not found" });
      }

      const updatedQuestion = await Question.findOneAndUpdate(
        { questionid: questionId },
        { $set: updateData },
        { new: true }
      );
      return res.json(updatedQuestion);
    } catch (error) {
      return res.status(500).send("Internal server error");
    }
  }
);

// Delete a specific question by id
router.post(
  "/:id/delete",
  [...idValidators],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const questionId = parseInt(req.params.id);
    try {
      const deletedQuestion = await Question.findOneAndUpdate(
        { questionid: questionId },
        { $set: { deleted: true } },
        { new: true }
      ).exec();
      return res.json(deletedQuestion);
    } catch (error) {
      //to catch pre-middleware defined error
      if (error instanceof Error) {
        return res.status(404).json(error.message);
      }
      return res.status(500).send("Internal server error");
    }
  }
);

export default router;
