import axios from "../lib/axios";

export const WritingAPI = {
  getTaskOneQuestions: async (params?: { topic?: string; level?: string }) => {
    const response = await axios.get("/writing/task-one/questions", {
      params,
    });
    return response.data;
  },
};
