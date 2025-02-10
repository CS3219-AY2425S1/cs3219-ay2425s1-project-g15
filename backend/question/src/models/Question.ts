import mongoose, { Document, Schema } from "mongoose";
import mongooseAutoIncrement from "mongoose-sequence";

export type TQuestionExample = {
  example_num: number;
  expected_input: string;
  expected_output: string;
  explanation: string;
}

/**
 * Model for the Question Schema for TypeScript.
 * Only includes the required fields as specified in the project document.
 */

export type TQuestion = {
  title: string;
  description: string;
  category: [string];
  complexity: string;
  deleted: boolean;
  examples: [TQuestionExample]
  solution: string;
  questionid?: number;
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
    examples: {
      type: [
        {
          example_num: Number,
          expected_input: String,
          expected_output: String,
          explanation: String,
        },
      ],
      required: false,
    },
    solution: {
      type: String,
      required: false,
    },
    deleted: {
      type: Boolean,
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
