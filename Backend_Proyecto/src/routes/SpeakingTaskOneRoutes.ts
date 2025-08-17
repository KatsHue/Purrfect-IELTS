import { Router } from "express";
import { QuestionsController } from "../controllers/QuestionsControllerTaskOne";

const router = Router();

// Solo el endpoint relativo
router.get("/questions", QuestionsController.getSpeakingQuestions);

export default router;
