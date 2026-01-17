import { useEffect, useState } from "react";
import { Sparkles, TrendingUp, Clock, Award } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function ImprovedHeroSection() {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out",
    });
  }, []);

  const handleStartPractice = () => {
    window.location.href = "https://purrfect-ielts.onrender.com/speaking";
  };

  const handleExploreAI = () => {
    // Scroll al chatbot section o abrir chatbot
    console.log("Explorar IA");
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white via-orange-50/30 to-pink-50/30 overflow-hidden">
      {/* Elementos decorativos sutiles de fondo */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-pink-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div
        className="absolute bottom-40 left-10 w-40 h-40 bg-orange-200 rounded-full blur-3xl opacity-20 animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-1/2 right-1/4 w-24 h-24 bg-yellow-200 rounded-full blur-2xl opacity-20 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-28 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Columna Izquierda - Contenido */}
          <div
            className="space-y-8 text-center lg:text-left"
            data-aos="fade-right"
          >
            {/* Badge Superior */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-100 to-orange-100 rounded-full border border-pink-200/50 shadow-sm">
              <Sparkles className="w-4 h-4 text-pink-600" />
              <span className="text-sm font-bold text-pink-800">
                Preparación con IA Avanzada
              </span>
            </div>

            {/* Título Principal */}
            <h1 className="space-y-2">
              <div className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight">
                <span className="block text-pink-600">Domina el</span>
                <span className="block bg-gradient-to-r from-orange-600 via-pink-600 to-pink-700 bg-clip-text text-transparent">
                  IELTS
                </span>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-700">
                con confianza 🎯
              </div>
            </h1>

            {/* Descripción */}
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Practica{" "}
              <span className="font-bold text-orange-600">
                Speaking y Writing
              </span>{" "}
              con retroalimentación instantánea de IA. Mejora tu puntuación con
              ejercicios personalizados.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <button
                onClick={handleStartPractice}
                className="group px-8 py-4 bg-gradient-to-r from-pink-600 to-orange-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>Comenzar Práctica</span>
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </button>

              <button
                onClick={handleExploreAI}
                className="px-8 py-4 bg-white text-orange-600 font-bold text-lg rounded-xl shadow-md hover:shadow-lg border-2 border-orange-200 hover:border-orange-300 hover:scale-105 transition-all duration-300"
              >
                Chatbot IA 💬
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-6 max-w-lg mx-auto lg:mx-0">
              <div
                className="bg-white rounded-xl p-4 shadow-md border border-pink-100 hover:shadow-lg transition-shadow"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <div className="flex flex-col items-center gap-1">
                  <Award className="w-6 h-6 text-pink-600 mb-1" />
                  <p className="text-2xl sm:text-3xl font-black text-pink-600">
                    100%
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-gray-600">
                    Gratis
                  </p>
                </div>
              </div>

              <div
                className="bg-white rounded-xl p-4 shadow-md border border-orange-100 hover:shadow-lg transition-shadow"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="flex flex-col items-center gap-1">
                  <Clock className="w-6 h-6 text-orange-600 mb-1" />
                  <p className="text-2xl sm:text-3xl font-black text-orange-600">
                    24/7
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-gray-600">
                    Disponible
                  </p>
                </div>
              </div>

              <div
                className="bg-white rounded-xl p-4 shadow-md border border-amber-100 hover:shadow-lg transition-shadow"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="flex flex-col items-center gap-1">
                  <TrendingUp className="w-6 h-6 text-amber-600 mb-1" />
                  <p className="text-2xl sm:text-3xl font-black text-amber-600">
                    IA
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-gray-600">
                    Avanzada
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha - Ilustración */}
          <div className="relative" data-aos="fade-left" data-aos-delay="200">
            <div className="relative w-full max-w-lg mx-auto">
              {/* Contenedor de imagen con fallback */}
              <div className="relative z-10">
                {!imageError ? (
                  <img
                    src="/assets/images/hero.svg"
                    alt="Purrfect IELTS - Preparación para el examen"
                    className="w-full h-auto drop-shadow-2xl"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  // Ilustración alternativa si la imagen no carga
                  <div className="w-full aspect-square bg-gradient-to-br from-pink-400 via-orange-400 to-pink-500 rounded-3xl shadow-2xl flex items-center justify-center p-12">
                    <div className="text-center text-white space-y-4">
                      <div className="text-8xl animate-bounce">😺</div>
                      <div className="text-4xl font-black">Purrfect</div>
                      <div className="text-2xl font-bold">IELTS</div>
                      <div className="flex gap-4 text-5xl justify-center mt-6">
                        <span className="animate-pulse">📚</span>
                        <span
                          className="animate-pulse"
                          style={{ animationDelay: "0.2s" }}
                        >
                          ✨
                        </span>
                        <span
                          className="animate-pulse"
                          style={{ animationDelay: "0.4s" }}
                        >
                          🎯
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Elementos decorativos alrededor */}
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-pink-300 rounded-full opacity-40 blur-xl animate-pulse"></div>
              <div
                className="absolute -bottom-6 -right-6 w-28 h-28 bg-orange-300 rounded-full opacity-40 blur-xl animate-pulse"
                style={{ animationDelay: "0.5s" }}
              ></div>
              <div
                className="absolute top-1/3 -left-4 w-16 h-16 bg-yellow-300 rounded-full opacity-40 blur-xl animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>

              {/* Floating badges */}
              <div
                className="hidden lg:block absolute -top-8 -right-8 bg-white px-4 py-2 rounded-full shadow-xl border border-pink-200 animate-bounce"
                style={{ animationDelay: "0.5s" }}
              >
                <span className="text-sm font-bold text-pink-600">
                  🎤 Speaking
                </span>
              </div>

              <div
                className="hidden lg:block absolute -bottom-4 -left-8 bg-white px-4 py-2 rounded-full shadow-xl border border-orange-200 animate-bounce"
                style={{ animationDelay: "1s" }}
              >
                <span className="text-sm font-bold text-orange-600">
                  ✍️ Writing
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Onda decorativa en la parte inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
}
