import axios from "../lib/axios";

export const SpeakingAPI = {
  getTaskOneQuestions: async (params?: {
    topic?: string;
    difficulty?: string;
  }) => {
    const response = await axios.get("/speaking/task-one/questions", {
      params,
    });
    return response.data;
  },
};
