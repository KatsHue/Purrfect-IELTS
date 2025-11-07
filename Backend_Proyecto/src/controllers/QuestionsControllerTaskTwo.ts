//QuestionsControllerTaskTwo.ts
import { RequestHandler } from "express";
import QuestionTaskTwo from "../models/QuestionsTaskTwo";

export class QuestionsControllerTaskTwo {
  static getSpeakingQuestionsCueCard: RequestHandler = async (req, res) => {
    try {
      const { topic, level } = req.query;

      const filter: any = {
        isActive: true,
        language: { $regex: /^english$/i },
      };

      if (topic) filter.topic = topic;
      if (level) filter.level = level;

      // Traer todas las preguntas que cumplen el filtr
      const questions = await QuestionTaskTwo.find(filter, {
        question: 1,
      }).sort({
        createdAt: 1,
      });

      if (questions.length === 0) {
        res.status(404).json({ error: "No Task 2 questions found" });
        return;
      }

      // Devolver solo el texto de las preguntas
      res.json(questions.map((q) => q.question));
    } catch (error) {
      console.error("Error getting speaking questions:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
