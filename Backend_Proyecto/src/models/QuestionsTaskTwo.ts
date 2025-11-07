import { Schema, model, Document } from "mongoose";

export interface IQuestionTaskTwo extends Document {
  topic: string;
  mainQuestion: string; // Ej: "Describe a place you like to visit"
  prompts: string[]; // Ej: ["Where is it?", "What do you do there?", "Why do you like it?"]
  level: "easy" | "medium" | "hard";
  language: string;
  isActive: boolean;
}

const QuestionSchema = new Schema<IQuestionTaskTwo>(
  {
    topic: { type: String, required: true },
    mainQuestion: { type: String, required: true },
    prompts: [{ type: String, required: true }],
    level: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    language: { type: String, default: "english" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default model<IQuestionTaskTwo>(
  "QuestionsTaskTwo",
  QuestionSchema,
  "speakingT2_questions"
);
