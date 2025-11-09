import { Router } from "express";
import { QuestionsControllerWritingTaskTwo } from "../controllers/QuestionsControllerTaskTwoWriting";

const router = Router();

router.get("/questions", QuestionsControllerWritingTaskTwo.getWritingQuestions);

export default router;
