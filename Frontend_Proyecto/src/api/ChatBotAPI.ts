import axios from "axios";

const API_URL = import.meta.env.VITE_CHATBOT_API;

export const sendMessageToChatbot = async (
  message: string
): Promise<string> => {
  try {
    const response = await axios.post(API_URL, { message });
    return response.data.answer;
  } catch (error) {
    console.error("Error al comunicarse con el chatbot:", error);
    return "Ocurrió un error al conectar con el servidor del chatbot.";
  }
};
