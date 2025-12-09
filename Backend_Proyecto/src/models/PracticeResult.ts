import { Schema, model, Document, Types } from "mongoose";

export interface IPracticeResult extends Document {
  userId: Types.ObjectId;
  type: "speaking" | "writing";
  task: "task-one" | "task-two" | "task-three";
  question: string;
  userResponse: string;
  aiFeedback: string;
  estimatedBand: number | null;
  identifiedErrors: string[];
  bulletPointsCovered?: {
    point: string;
    status: "covered" | "partial" | "not-covered";
  }[];
  metadata?: {
    toneType?: "formal" | "informal" | "semi-formal"; // Para Writing Task 1
    taskRelevance?: "adequate" | "partial" | "not-relevant"; // Para evaluar si respondió bien
    recordingDuration?: number; // Para speaking (en segundos) (revisar, no es seguro que funcione bien)
  };
  createdAt: Date;
  updatedAt: Date;
}

const PracticeResultSchema = new Schema<IPracticeResult>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["speaking", "writing"],
      required: true,
      index: true,
    },
    task: {
      type: String,
      enum: ["task-one", "task-two", "task-three"],
      required: true,
      index: true,
    },
    question: {
      type: String,
      required: true,
    },
    userResponse: {
      type: String,
      required: true,
    },
    aiFeedback: {
      type: String,
      required: true,
    },
    estimatedBand: {
      type: Number,
      min: 0,
      max: 9,
      default: null,
    },
    identifiedErrors: [{ type: String }],
    bulletPointsCovered: [
      {
        point: String,
        status: {
          type: String,
          enum: ["covered", "partial", "not-covered"],
        },
      },
    ],
    metadata: {
      toneType: {
        type: String,
        enum: ["formal", "informal", "semi-formal"],
      },
      taskRelevance: {
        type: String,
        enum: ["adequate", "partial", "not-relevant"],
      },
      recordingDuration: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Índice compuesto para búsquedas eficientes
PracticeResultSchema.index({ userId: 1, type: 1, task: 1, createdAt: -1 });

export default model<IPracticeResult>("PracticeResult", PracticeResultSchema);
