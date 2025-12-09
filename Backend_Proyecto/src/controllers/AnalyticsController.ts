import { RequestHandler } from "express";
import PracticeResult from "../models/PracticeResult";
import { Types } from "mongoose";

export class AnalyticsController {
  static savePracticeResult: RequestHandler = async (req, res) => {
    try {
      const {
        type,
        task,
        question,
        userResponse,
        aiFeedback,
        estimatedBand,
        identifiedErrors,
        bulletPointsCovered,
        metadata,
      } = req.body;

      const userId = req.user.id;

      const result = await PracticeResult.create({
        userId,
        type,
        task,
        question,
        userResponse,
        aiFeedback,
        estimatedBand,
        identifiedErrors: identifiedErrors || [],
        bulletPointsCovered: bulletPointsCovered || [],
        metadata: metadata || {},
      });

      res.status(201).json(result);
    } catch (error) {
      console.error("Error saving practice result:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  static getUserStats: RequestHandler = async (req, res) => {
    try {
      //CONVERTIR a ObjectId
      const userId = new Types.ObjectId(req.user.id);

      console.log("📊 Fetching stats for userId:", userId);

      // Total de prácticas
      const totalPractices = await PracticeResult.countDocuments({ userId });
      console.log("Total practices:", totalPractices);

      // Usar ObjectId en las agregaciones
      const avgBandResult = await PracticeResult.aggregate([
        {
          $match: {
            userId: userId, // Ya es ObjectId
            estimatedBand: { $ne: null, $type: "number" },
          },
        },
        {
          $group: {
            _id: null,
            avgBand: { $avg: "$estimatedBand" },
          },
        },
      ]);
      console.log("Average band result:", avgBandResult);

      const avgByTypeAndTask = await PracticeResult.aggregate([
        {
          $match: {
            userId: userId,
            estimatedBand: { $ne: null, $type: "number" },
          },
        },
        {
          $group: {
            _id: { type: "$type", task: "$task" },
            avgBand: { $avg: "$estimatedBand" },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { "_id.type": 1, "_id.task": 1 },
        },
      ]);
      console.log("By type and task:", avgByTypeAndTask);

      const commonErrors = await PracticeResult.aggregate([
        { $match: { userId: userId } },
        { $unwind: "$identifiedErrors" },
        {
          $group: {
            _id: "$identifiedErrors",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]);
      console.log("Common errors:", commonErrors);

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentProgress = await PracticeResult.aggregate([
        {
          $match: {
            userId: userId,
            estimatedBand: { $ne: null, $type: "number" },
            createdAt: { $gte: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            avgBand: { $avg: "$estimatedBand" },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);
      console.log("Recent progress:", recentProgress);

      const allDates = await PracticeResult.distinct("createdAt", {
        userId: userId,
      });
      const streak = calculateStreak(allDates);

      res.json({
        totalPractices,
        averageBand: avgBandResult[0]?.avgBand || null,
        byTypeAndTask: avgByTypeAndTask,
        commonErrors,
        recentProgress,
        currentStreak: streak,
      });
    } catch (error) {
      console.error("Error getting user stats:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  static getPracticeHistory: RequestHandler = async (req, res) => {
    try {
      // ⭐ CONVERTIR a ObjectId
      const userId = new Types.ObjectId(req.user.id);
      const { type, task, limit = 20, skip = 0 } = req.query;

      const filter: any = { userId };
      if (type) filter.type = type;
      if (task) filter.task = task;

      const practices = await PracticeResult.find(filter)
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip(Number(skip))
        .select("-userResponse -aiFeedback");

      const total = await PracticeResult.countDocuments(filter);

      res.json({
        practices,
        total,
        hasMore: total > Number(skip) + Number(limit),
      });
    } catch (error) {
      console.error("Error getting practice history:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  static getPracticeDetail: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = new Types.ObjectId(req.user.id);

      if (!Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: "Invalid practice ID" });
        return;
      }

      const practice = await PracticeResult.findOne({
        _id: new Types.ObjectId(id),
        userId,
      });

      if (!practice) {
        res.status(404).json({ error: "Practice not found" });
        return;
      }

      res.json(practice);
    } catch (error) {
      console.error("Error getting practice detail:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  static getProgressComparison: RequestHandler = async (req, res) => {
    try {
      const userId = new Types.ObjectId(req.user.id);
      const { startDate, endDate } = req.query;

      const dateFilter: any = {};
      if (startDate) dateFilter.$gte = new Date(startDate as string);
      if (endDate) dateFilter.$lte = new Date(endDate as string);

      const comparison = await PracticeResult.aggregate([
        {
          $match: {
            userId: userId,
            estimatedBand: { $ne: null, $type: "number" },
            ...(Object.keys(dateFilter).length > 0 && {
              createdAt: dateFilter,
            }),
          },
        },
        {
          $group: {
            _id: "$type",
            avgBand: { $avg: "$estimatedBand" },
            minBand: { $min: "$estimatedBand" },
            maxBand: { $max: "$estimatedBand" },
            count: { $sum: 1 },
          },
        },
      ]);

      res.json(comparison);
    } catch (error) {
      console.error("Error getting progress comparison:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}

function calculateStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;

  const sortedDates = dates
    .map((d) => new Date(d).toDateString())
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let streak = 1;
  const today = new Date().toDateString();

  if (sortedDates[0] !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (sortedDates[0] !== yesterday.toDateString()) {
      return 0;
    }
  }

  for (let i = 0; i < sortedDates.length - 1; i++) {
    const current = new Date(sortedDates[i]);
    const next = new Date(sortedDates[i + 1]);
    const diffDays = Math.floor(
      (current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
