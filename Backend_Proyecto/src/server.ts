import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { corsConfig } from "./config/cors";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import projectRoutes from "./routes/projectRoutes";
import speakingTaskOneRoutes from "./routes/SpeakingTaskOneRoutes";
import speakingTaskTwoRoutes from "./routes/SpeakingTaskTwoRoutes";
import writingTaskOneRoutes from "./routes/WritingTaskOneRoutes";
import writingTaskTwoRoutes from "./routes/WritingTaskTwoRoutes";
import analyticsRoutes from "./routes/AnalyticsRoutes";

dotenv.config();

connectDB();

const app = express();
app.use(cors(corsConfig));
app.use(express.json());

// Routes existentes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

// Rutas Speaking Questions
app.use("/api/speaking/task-one", speakingTaskOneRoutes);
app.use("/api/speaking/task-two", speakingTaskTwoRoutes);

// Rutas Writing Questions
app.use("/api/writing/task-one", writingTaskOneRoutes);
app.use("/api/writing/task-two", writingTaskTwoRoutes);

// Rutas Historial
app.use("/api/analytics", analyticsRoutes);

app.get("/", (req, res) => {
  res.send("✅ Purrfect IELTS API funcionando correctamente en Render 🚀");
});

export default app;
