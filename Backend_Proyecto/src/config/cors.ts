import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    const whitelist = [
      "https://purrfect-ielts.onrender.com",
      "http://localhost:5173",
    ];

    // Permitir peticiones sin origin (como health checks de Render)
    if (!origin) {
      return callback(null, true);
    }

    // Normaliza (por si viene con barra final)
    const cleanOrigin = origin.replace(/\/$/, "");

    if (whitelist.includes(cleanOrigin)) {
      callback(null, true);
    } else {
      console.log("❌ Bloqueado por CORS:", origin);
      callback(new Error("Error de CORS"));
    }
  },
  credentials: true, // si usas cookies o auth
};
