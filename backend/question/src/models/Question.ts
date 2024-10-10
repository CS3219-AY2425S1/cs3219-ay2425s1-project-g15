import mongoose, { Document, Schema, model } from "mongoose";
import mongooseAutoIncrement from "mongoose-sequence";

/**
 * Model for the Question Schema for TypeScript.
 * Only includes the required fields as specified in the project document.
 */

export type TQuestion = {
  title: string;
  description: string;
  category: [string];
  complexity: string;
};

// Document provides an id field
export interface IQuestion extends TQuestion, Document {}

const questionSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: [String],
      required: true,
    },
    complexity: {
      type: String,
      required: true,
    },
  },
  { collection: "questions" }
);

// Pre-middleware for findOneAndUpdate
questionSchema.pre("findOneAndUpdate", async function (next) {
  const doc = await this.model.findOne(this.getQuery());
  if (!doc) {
    return next(new Error("Document not found"));
  }
  next();
});

//Pre-middleware for findOneAndDelete
questionSchema.pre("findOneAndDelete", async function (next) {
  const doc = await this.model.findOne(this.getQuery());
  if (!doc) {
    return next(new Error("Document not found"));
  }
  next();
});

//questionid will be autoincrementing, starting from a large number to avoid conflicts with the existing data
// @ts-ignore
const AutoIncrement = mongooseAutoIncrement(mongoose);
// @ts-ignore
questionSchema.plugin(AutoIncrement, {
  inc_field: "questionid",
  start_seq: 1090,
});
const QuestionBank = mongoose.connection.useDb("questionbank");
const Question = QuestionBank.model<IQuestion>(
  "Question",
  questionSchema,
  "questions"
);

export default Question;
