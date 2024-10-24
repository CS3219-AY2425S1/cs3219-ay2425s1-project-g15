import express, { Request, Response } from "express";
import Session, { TSession } from "../models/Session";
import {
  createSessionValidators,
  idValidators,
  updateSessionValidators,
} from "./validators";
import { validationResult } from "express-validator";

/**
 * Router for the collaboration service.
 */

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello from collaboration service!");
});

// Create a new session
router.post(
  "/create",
  [...createSessionValidators],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const {
        collabid,
        users,
        difficulty,
        language,
        topic,
        question_title,
        question_description,
      } = req.body;

      const existingSession = await Session.findOne({ collabid: collabid });
      if (existingSession) {
        return res.status(400).json({
          message: "A session with this id already exists",
        });
      }

      const session = {
        collabid,
        users,
        difficulty,
        language,
        topic,
        question_title,
        question_description,
        code: "",
      };

      const newSession = new Session(session);
      await newSession.save();
      res.status(200).json({
        message: "Session created successfully",
        session: newSession,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal server error");
    }
  }
);

// Get all sessions
router.get("/sessions", async (req: Request, res: Response) => {
  try {
    const sessions: TSession[] = await Session.find().exec();
    res.status(200).json(sessions);
  } catch (error) {
    return res.status(500).send("Internal server error");
  }
});

// Get a single session by collabid
router.get("/:id", [...idValidators], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { id } = req.params;

  try {
    const session = await Session.findOne({ collabid: id }).exec();
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.status(200).json(session);
  } catch (error) {
    return res.status(500).send("Internal server error");
  }
});

// Update a session by ID
router.post(
  "/:id/update",
  [...updateSessionValidators],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;

    const updateSession: Partial<TSession> = {};

    // if (req.body.users) {
    //   updateSession.users = req.body.users;
    // }
    // if (req.body.difficulty) {
    //   updateSession.difficulty = req.body.difficulty;
    // }
    // if (req.body.language) {
    //   updateSession.language = req.body.language;
    // }
    // if (req.body.topic) {
    //   updateSession.topic = req.body.topic;
    // }
    // if (req.body.question_title) {
    //   updateSession.question_title = req.body.question_title;
    // }
    // if (req.body.question_description) {
    //   updateSession.question_description = req.body.question_description;
    // }
    updateSession.code = req.body.code;

    try {
      const session = await Session.findOne({ collabid: id }).exec();
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      const updatedSession = await Session.findOneAndUpdate(
        { collabid: id },
        { $set: updateSession },
        { new: true }
      );
      res.status(200).json(updatedSession);
    } catch (error) {
      return res.status(500).send("Internal server error");
    }
  }
);

// Delete a session by ID
router.delete(
  "/:id",
  [...idValidators],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { id } = req.params;

      const deletedSession = await Session.findOneAndDelete({
        collabid: id,
      }).exec();
      if (!deletedSession) {
        return res.status(404).json({ message: "Session not found" });
      }

      res.status(200).json({ message: "Session deleted successfully" });
    } catch (error) {
      return res.status(500).send("Internal server error");
    }
  }
);

export default router;
