import { Router } from "express";
import { QuestionsControllerWritingTaskOne } from "../controllers/QuestionsControllerTaskOneWriting";

const router = Router();

router.get("/questions", QuestionsControllerWritingTaskOne.getWritingQuestions);

export default router;
