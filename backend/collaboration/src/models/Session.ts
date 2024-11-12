import mongoose, { Document, Schema } from "mongoose";

/**
 * Model for the Session Schema for TypeScript.
 */

export type TSession = {
  collabid: string;
  users: [string];
  language: [string];
  question_id: number;
  code: string;
  createdAt: Date;
};

// Document provides an id field
export interface ISession extends TSession, Document {}

const sessionSchema: Schema = new Schema(
  {
    collabid: {
      type: String,
      required: true,
    },
    users: {
      type: [String],
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    question_id: {
      type: Number,
      required: true,
    },
    code: {
      type: String,
      required: false,
    },
    createdAt: {
      type: Date,
      required: false,
    }
  },
  { collection: "sessions" }
);

// Pre-middleware for findOneAndUpdate
sessionSchema.pre("findOneAndUpdate", async function (next) {
  const doc = await this.model.findOne(this.getQuery());
  if (!doc) {
    return next(new Error("Document not found"));
  }
  next();
});

//Pre-middleware for findOneAndDelete
sessionSchema.pre("findOneAndDelete", async function (next) {
  const doc = await this.model.findOne(this.getQuery());
  if (!doc) {
    return next(new Error("Document not found"));
  }
  next();
});

const SessionDB = mongoose.connection.useDb("Sessions");
const Session = SessionDB.model<ISession>("Session", sessionSchema, "sessions");

export default Session;
