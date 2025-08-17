import { Schema, model, Document } from "mongoose";

export interface IQuestion extends Document {
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

const QuestionSchema = new Schema<IQuestion>(
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
  {
    timestamps: true, // añade createdAt y updatedAt automáticamente
  }
);

export default model<IQuestion>(
  "QuestionsTaskOne",
  QuestionSchema,
  "speakingT1_questions"
);
