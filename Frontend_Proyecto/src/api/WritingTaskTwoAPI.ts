import axios from "../lib/axios";

export const WritingAPI = {
  getTaskTwoQuestions: async (params?: { topic?: string; level?: string }) => {
    const response = await axios.get("/writing/task-two/questions", {
      params,
    });
    return response.data;
  },
};
