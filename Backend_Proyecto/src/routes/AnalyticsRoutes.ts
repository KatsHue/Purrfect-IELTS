import { Router } from "express";
import { AnalyticsController } from "../controllers/AnalyticsController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

// Guardar resultado de práctica
router.post("/results", AnalyticsController.savePracticeResult);

// Obtener estadísticas generales
router.get("/stats", AnalyticsController.getUserStats);

// Obtener historial de prácticas
router.get("/history", AnalyticsController.getPracticeHistory);

// Obtener detalle de una práctica específica
router.get("/history/:id", AnalyticsController.getPracticeDetail);

// Obtener comparación de progreso
router.get("/comparison", AnalyticsController.getProgressComparison);

export default router;
