//QuestionTaskTwo.ts
import { Schema, model, Document } from "mongoose";

export interface IQuestionTaskTwo extends Document {
  topic: string;
  subtopic: string;
  question: string;
  level: "easy" | "medium" | "hard";
  language: string;
  tags: string[];
  isActive: boolean;
  timesDisplayed: number;
  lastDisplayedAt?: Date;
}

const QuestionSchema = new Schema<IQuestionTaskTwo>(
  {
    topic: { type: String, required: true },
    subtopic: { type: String, required: true },
    question: { type: String, required: true },
    level: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    language: {
      type: String,
      default: "english",
    },
    tags: [{ type: String }],
    isActive: {
      type: Boolean,
      default: true,
    },
    timesDisplayed: {
      type: Number,
      default: 0,
    },
    lastDisplayedAt: { type: Date },
  },
  { timestamps: true }
);

export default model<IQuestionTaskTwo>(
  "QuestionsTaskTwo",
  QuestionSchema,
  "speakingT2_questions"
);
