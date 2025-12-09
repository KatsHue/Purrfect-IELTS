import { Router } from "express";
import { QuestionsControllerTaskTwo } from "../controllers/QuestionsControllerTaskTwo";

const router = Router();

router.get(
  "/questions",
  QuestionsControllerTaskTwo.getSpeakingQuestionsCueCard
);

export default router;
