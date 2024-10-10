import express, { Request, Response } from "express";
import { validationResult } from "express-validator";
import Question, { TQuestion } from "../models/Question";
import {
  createQuestionValidators,
  idValidators,
  updateQuestionValidators,
} from "./validators";

/**
 * Router for the question service.
 */

const router = express.Router();

router.get("/", (req, res) => {
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
      const { title, description, category, complexity } = req.body;

      const existingQuestion = await Question.findOne({ title: title.trim() });
      if (existingQuestion) {
        return res.status(400).json({
          message: "A question with this title already exists",
        });
      }

      const question = { title, description, category, complexity };
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
router.get("/all", async (req: Request, res: Response) => {
  const pagination = parseInt(req.body.pagination as string, 10) || 1; // Default page is 1
  const page_size = parseInt(req.body.page_size as string, 10) || 10; // Default limit is 10
  const skip = (pagination - 1) * page_size; // Calculate how many documents to skip
  try {
    const questions = await Question.find(
      {},
      {
        questionid: 1,
        title: 1,
        description: 1,
        complexity: 1,
        category: 1,
      }
    )
      .lean()
      .sort({ questionid: "ascending" })
      .skip(skip)
      .limit(page_size)
      .exec();

    const total = await Question.countDocuments().exec();

    return res.json({
      questions,
      currentPage: pagination,
      totalPages: Math.ceil(total / page_size),
      totalQuestions: total,
    });
  } catch (error) {
    return res.status(500).send("Internal server error");
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
      { questionid: 1, title: 1, description: 1, complexity: 1, category: 1 }
    ).exec();
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    return res.json(question);
  } catch (error) {
    return res.status(500).send("Internal server error");
  }
});

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
    if (req.body.title) {
      const existingQuestion = await Question.findOne({
        title: req.body.title.trim(),
      });
      if (existingQuestion) {
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

    try {
      const updatedQuestion = await Question.findOneAndUpdate(
        { questionid: questionId },
        { $set: updateData },
        { new: true }
      );
      return res.json(updatedQuestion);
    } catch (error) {
      //to catch pre-middleware defined error
      if (error instanceof Error) {
        return res.status(404).json(error.message);
      }
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
      const deletedQuestion = await Question.findOneAndDelete({
        questionid: questionId,
      }).exec();
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
