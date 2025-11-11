import axios from "../lib/axios";

export interface PracticeResultData {
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
    toneType?: "formal" | "informal" | "semi-formal";
    taskRelevance?: "adequate" | "partial" | "not-relevant";
    recordingDuration?: number;
  };
}

export interface UserStats {
  totalPractices: number;
  averageBand: number | null;
  byTypeAndTask: {
    _id: { type: string; task: string };
    avgBand: number;
    count: number;
  }[];
  commonErrors: {
    _id: string;
    count: number;
  }[];
  recentProgress: {
    _id: string;
    avgBand: number;
    count: number;
  }[];
  currentStreak: number;
}

export interface PracticeHistory {
  practices: any[];
  total: number;
  hasMore: boolean;
}

export const AnalyticsAPI = {
  // Guardar resultado de práctica
  savePracticeResult: async (data: PracticeResultData) => {
    console.log("💾 Saving practice result...");
    console.log("Token:", localStorage.getItem("AUTH_TOKEN"));

    try {
      const response = await axios.post("/analytics/results", data);
      console.log("✅ Save response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Error saving:", error.response?.data || error.message);
      throw error;
    }
  },

  // Obtener estadísticas del usuario
  getUserStats: async (): Promise<UserStats> => {
    console.log("📊 Fetching user stats...");
    console.log("Token:", localStorage.getItem("AUTH_TOKEN"));

    try {
      const response = await axios.get("/analytics/stats");
      console.log("✅ Stats response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Error fetching stats:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Obtener historial de prácticas
  getPracticeHistory: async (params?: {
    type?: string;
    task?: string;
    limit?: number;
    skip?: number;
  }): Promise<PracticeHistory> => {
    console.log("📜 Fetching practice history...");

    try {
      const response = await axios.get("/analytics/history", { params });
      console.log("✅ History response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Error fetching history:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Obtener detalle de una práctica
  getPracticeDetail: async (id: string) => {
    console.log("🔍 Fetching practice detail for:", id);

    try {
      const response = await axios.get(`/analytics/history/${id}`);
      console.log("✅ Detail response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Error fetching detail:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Obtener comparación de progreso
  getProgressComparison: async (params?: {
    startDate?: string;
    endDate?: string;
  }) => {
    console.log("📈 Fetching progress comparison...");

    try {
      const response = await axios.get("/analytics/comparison", { params });
      console.log("✅ Comparison response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Error fetching comparison:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};
