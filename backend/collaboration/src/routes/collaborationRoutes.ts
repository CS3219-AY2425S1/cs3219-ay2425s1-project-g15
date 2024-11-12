import express, { Request, Response } from "express";
import { validationResult } from "express-validator";
import ChatLog from "../models/ChatLog";
import Session, { TSession } from "../models/Session";
import {
  createChatLogValidators,
  createSessionValidators,
  getChatLogValidators,
  idValidators,
  updateSessionValidators,
} from "./validators";

/**
 * Router for the collaboration service.
 */

const router = express.Router();

router.get("/", (req, res) => {
  console.log("Sending Greetings!");
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
      const { collabid, users, language, question_id } = req.body;

      const existingSession = await Session.findOne({ collabid: collabid });
      if (existingSession) {
        return res.status(400).json({
          message: "A session with this id already exists",
        });
      }

      const session = {
        collabid,
        users,
        language,
        question_id,
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

// Get all sessions with a specific user id in the users array
router.post("/sessions/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sessions: TSession[] = await Session.find({ users: id }).exec();

    return res.status(200).json(sessions);
  } catch (error) {
    return res.status(500).send(error);
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

// Check if a session exists
router.get(
  "/:id/check",
  [...idValidators],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;

    try {
      const sessionExists = await Session.exists({ collabid: id });
      res.status(200).json({ exists: Boolean(sessionExists) });
    } catch (error) {
      return res.status(500).send("Internal server error");
    }
  }
);

// Check if a session exists with a specific user id in the users array
router.get(
  "/:id/check/:userid/:username",
  [...idValidators],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id, userid, username } = req.params;

    try {
      // Find a session that has the given collabid and has the given user id or username in the users array
      const sessionExists = await Session.exists({
        collabid: id,
        $or: [{ users: userid }, { users: username }],
      });

      res.status(200).json({ exists: Boolean(sessionExists) });
    } catch (error) {
      return res.status(500).send("Internal server error");
    }
  }
);

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

// Create a single chat log
router.post("/chat/:collabid/create_chatlog", [...createChatLogValidators], async (req: Request, res: Response) => {
  // TODO: Add validation check to check if a collab ID exists and if the sender and recipient IDs are valid

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { message, senderId, recipientId, timestampEpoch } = req.body;
    const { collabid } = req.params;
    const chatLog = {
      collabid,
      message,
      senderId,
      recipientId,
      timestampEpoch
    };
    
    const newChatLog = new ChatLog(chatLog);
    await newChatLog.save();
    res.status(200).json({ message: "Chat log created successfully", chatLog: newChatLog });
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal server error");
  }
})

// Fetch chat logs for a specific collabID with pagination
router.get("/chat/:collabid/get_chatlogs", [...getChatLogValidators], async (req: Request, res: Response) => {
  try {
    const { collabid } = req.params;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const skip = (page - 1) * limit;

    // Fetch chat logs for the specified collabID, with pagination and sorted by timestamp
    const chatLogs = await ChatLog.find({ collabId: collabid })
      .sort({ timestamp: -1 }) // Sort by timestamp in descending order (latest first)
      .skip(skip)
      .limit(limit);

    chatLogs.reverse();

    // Get total count of chat logs for the given collabID
    const totalLogs = await ChatLog.countDocuments({ collabid });
    const totalPages = Math.ceil(totalLogs / limit);

    res.status(200).json({
      message: "Chat logs fetched successfully",
      chatLogs: chatLogs,
      pagination: {
        page,
        limit,
        totalPages,
        totalLogs,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

export default router;
