// TranscriptionAI.ts
import axios from "axios";

const ASSEMBLY_TIMEOUT_MS = 15000; // 15s por solicitud individual
const MAX_POLLING_ATTEMPTS = 20; // máximo 60 segundos de polling
const POLLING_INTERVAL_MS = 3000;
const MAX_UPLOAD_RETRIES = 2;

const assemblyHeaders = {
  authorization: import.meta.env.VITE_API_IA_ASSEMBLY,
  "Content-Type": "application/json",
};

// Función auxiliar de reintento con backoff exponencial
async function withRetry<T>(
  fn: () => Promise<T>,
  retries: number = MAX_UPLOAD_RETRIES,
  delayMs: number = 3000,
): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    // Solo reintentar en errores de servidor (5xx) o red, no en errores de cliente (4xx)
    const status = error.response?.status;
    const isRetryable = !status || status === 429 || status >= 500;

    if (retries > 0 && isRetryable) {
      console.warn(
        `⚠️ Reintento en ${delayMs}ms. Intentos restantes: ${retries}`,
      );
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return withRetry(fn, retries - 1, delayMs * 2); // backoff exponencial
    }
    throw error;
  }
}

export const transcriptionAI = async (audioBlob: Blob): Promise<string> => {
  try {
    // 1. Subir audio con reintento automático
    const uploadResponse = await withRetry(() =>
      axios.post("https://api.assemblyai.com/v2/upload", audioBlob, {
        headers: {
          authorization: import.meta.env.VITE_API_IA_ASSEMBLY,
          "Content-Type": "application/octet-stream",
        },
        timeout: ASSEMBLY_TIMEOUT_MS,
      }),
    );

    const audioUrl = uploadResponse.data.upload_url;
    console.log("✅ Audio subido, URL:", audioUrl);

    // 2. Crear transcripción con reintento
    const transcriptResponse = await withRetry(() =>
      axios.post(
        "https://api.assemblyai.com/v2/transcript",
        { audio_url: audioUrl },
        {
          headers: assemblyHeaders,
          timeout: ASSEMBLY_TIMEOUT_MS,
        },
      ),
    );

    const transcriptId = transcriptResponse.data.id;
    console.log("📝 Transcript ID:", transcriptId);

    // 3. Polling con límite de intentos (degradación controlada)
    let status = "queued";
    let transcriptText = "";
    let attempts = 0;

    while (status !== "completed" && status !== "error") {
      if (attempts >= MAX_POLLING_ATTEMPTS) {
        // Degradación controlada: no bloquear al usuario indefinidamente
        console.warn("⚠️ Tiempo máximo de transcripción alcanzado");
        return "[Transcripción no disponible: el servicio tardó demasiado. Por favor, ingresa tu respuesta manualmente.]";
      }

      await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL_MS));
      attempts++;

      const pollingResponse = await axios.get(
        `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
        {
          headers: assemblyHeaders,
          timeout: ASSEMBLY_TIMEOUT_MS,
        },
      );

      status = pollingResponse.data.status;
      console.log(
        `⏳ Status (intento ${attempts}/${MAX_POLLING_ATTEMPTS}):`,
        status,
      );

      if (status === "completed") {
        transcriptText = pollingResponse.data.text;
      } else if (status === "error") {
        throw new Error(pollingResponse.data.error || "Error en transcripción");
      }
    }

    console.log("✅ Transcripción lista:", transcriptText);
    return transcriptText;
  } catch (err: any) {
    console.error(
      "❌ Error en transcriptionAI:",
      err.response?.data || err.message,
    );

    if (err.code === "ECONNABORTED") {
      return "[Servicio de transcripción no disponible por timeout.]";
    }
    if (!err.response) {
      return "[Sin conexión con el servicio de transcripción.]";
    }
    // 👇 AGREGAR ESTO
    if (err.response?.status === 401) {
      return "[Servicio de transcripción no disponible: credenciales inválidas.]";
    }
    if (err.response?.status === 429) {
      return "[Servicio de transcripción no disponible: límite de solicitudes alcanzado.]";
    }
    if (err.response?.status >= 500) {
      return "[Servicio de transcripción temporalmente fuera de línea.]";
    }

    return "[Error en transcripción. Por favor ingresa tu respuesta manualmente.]";
    // 👆 Ya no lanzar throw, devolver mensaje amigable siempre
  }
};
