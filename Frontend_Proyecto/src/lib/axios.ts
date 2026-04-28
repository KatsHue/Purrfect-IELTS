import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000, // 15 segundos de espera
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("AUTH_TOKEN");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de respuesta para manejo centralizado de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("Timeout: El servidor no respondió en el tiempo esperado");
      return Promise.reject(
        new Error(
          "El servicio no está disponible en este momento. Intenta de nuevo.",
        ),
      );
    }
    if (!error.response) {
      console.error("Sin conexión con el servidor backend");
      return Promise.reject(new Error("No se pudo conectar con el servidor."));
    }
    return Promise.reject(error);
  },
);

export default api;
