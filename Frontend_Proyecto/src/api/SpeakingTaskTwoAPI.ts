import axios from "../lib/axios";

export const SpeakingTaskTwoAPI = {
  getTaskTwoQuestions: async (params?: {
    topic?: string;
    difficulty?: string;
  }) => {
    const response = await axios.get("/speaking/task-two/questions", {
      params,
    });
    return response.data;
  },
};
