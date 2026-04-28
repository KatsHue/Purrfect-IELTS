// ChatBotAPI.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_CHATBOT_API;
const CHATBOT_TIMEOUT_MS = 10000; // 10 segundos
const MAX_RETRIES = 2;

async function withRetry<T>(
  fn: () => Promise<T>,
  retries: number,
  delayMs: number = 2000,
): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const status = error.response?.status;
    const isRetryable = !status || status === 429 || status >= 500;

    if (retries > 0 && isRetryable) {
      console.warn(`⚠️ Chatbot no disponible. Reintento en ${delayMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return withRetry(fn, retries - 1, delayMs * 2);
    }
    throw error;
  }
}

export const sendMessageToChatbot = async (
  message: string,
): Promise<string> => {
  try {
    const response = await withRetry(
      () => axios.post(API_URL, { message }, { timeout: CHATBOT_TIMEOUT_MS }),
      MAX_RETRIES,
    );
    return response.data.answer;
  } catch (error: any) {
    console.error("❌ Error al comunicarse con el chatbot:", error.message);

    // Degradación controlada: el chatbot no disponible no debe
    // afectar los módulos de práctica principales
    if (error.code === "ECONNABORTED") {
      return "El asistente no está disponible en este momento (timeout). Los módulos de práctica siguen funcionando con normalidad.";
    }
    if (!error.response) {
      return "No se pudo conectar con el asistente. Por favor intenta más tarde.";
    }
    return "El asistente encontró un problema. Puedes continuar tu práctica sin él.";
  }
};
