import { Request, Response } from "express";
import Question from "../models/QuestionsTaskTwo";

export class QuestionsControllerTaskTwo {
  static async getSpeakingQuestionsCueCard(req: Request, res: Response) {
    try {
      const { topic, level } = req.query;

      const filter: any = {
        isActive: true,
        language: { $regex: /^english$/i },
      };

      if (topic) filter.topic = topic;
      if (level) filter.level = level;

      const questions = await Question.find(filter, {
        mainQuestion: 1,
        prompts: 1,
      }).sort({ createdAt: 1 });

      if (questions.length === 0) {
        res.status(404).json({ error: "No Task 2 questions found" });
        return;
      }

      res.json(questions);
    } catch (error) {
      console.error("Error getting speaking Task 2 questions:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
