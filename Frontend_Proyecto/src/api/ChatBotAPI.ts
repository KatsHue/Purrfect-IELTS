import axios from "axios";

const API_URL = "http://localhost:5000/chat";

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
