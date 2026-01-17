import { useEffect, useState } from "react";
import {
  Mic,
  PenTool,
  BarChart3,
  History,
  Sparkles,
  TrendingUp,
  Clock,
  Award,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function DashboardMainView() {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out",
    });
  }, []);

  const quickActions = [
    {
      icon: <Mic className="w-10 h-10" />,
      title: "Speaking",
      subtitle: "Practica conversación",
      gradient: "from-pink-400 via-rose-400 to-pink-500",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      emoji: "🎤",
      link: "https://purrfect-ielts.onrender.com/speaking",
    },
    {
      icon: <PenTool className="w-10 h-10" />,
      title: "Writing",
      subtitle: "Mejora tu escritura",
      gradient: "from-amber-400 via-yellow-400 to-amber-500",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      emoji: "✍️",
      link: "https://purrfect-ielts.onrender.com/writing/",
    },
  ];

  const historyActions = [
    {
      icon: <BarChart3 className="w-10 h-10" />,
      title: "Analíticos",
      subtitle: "Revisa tu progreso",
      gradient: "from-purple-400 via-violet-400 to-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      emoji: "📊",
      link: "https://purrfect-ielts.onrender.com/history/analytics",
    },
    {
      icon: <History className="w-10 h-10" />,
      title: "Historial",
      subtitle: "Tus prácticas anteriores",
      gradient: "from-orange-400 via-amber-400 to-orange-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      emoji: "📝",
      link: "https://purrfect-ielts.onrender.com/history/history-complete",
    },
  ];

  const handleNavigation = (link: string) => {
    window.location.href = link;
  };

  const handleStartPractice = () => {
    window.location.href = "https://purrfect-ielts.onrender.com/speaking";
  };

  const handleExploreAI = () => {
    // Scroll suave al chatbot section
    const chatbotSection = document.getElementById("chatbot-section");
    if (chatbotSection) {
      chatbotSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="max-w-7xl mx-auto relative z-10">
        <section className="relative bg-gradient-to-b from-white via-orange-50/30 to-pink-50/30 pt-4 pb-12 sm:pt-6 sm:pb-16 lg:pt-8 lg:pb-20">
          <div className="absolute top-20 right-10 w-32 h-32 bg-pink-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div
            className="absolute bottom-20 left-10 w-40 h-40 bg-orange-200 rounded-full blur-3xl opacity-20 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>

          <div className="px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Columna Izquierda - Contenido */}
              <div
                className="space-y-8 text-center lg:text-left"
                data-aos="fade-right"
              >
                {/* Título Principal */}
                <h1 className="space-y-2">
                  <div className="text-4xl sm:text-5xl lg:text-6xl xl:text-6xl font-black leading-tight">
                    <span className="block text-pink-600">Domina el IELTS</span>
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
                  con retroalimentación instantánea de IA. Mejora tu puntuación
                  con ejercicios personalizados.
                </p>

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
              <div
                className="relative"
                data-aos="fade-left"
                data-aos-delay="200"
              >
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
                  <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-pink-300 rounded-full opacity-40 blur-xl animate-pulse"></div>
                  <div
                    className="absolute -bottom-6 -right-6 w-28 h-28 bg-orange-300 rounded-full opacity-40 blur-xl animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                  <div
                    className="absolute top-1/3 -left-4 w-16 h-16 bg-yellow-300 rounded-full opacity-40 blur-xl animate-pulse"
                    style={{ animationDelay: "1s" }}
                  ></div>

                  <div
                    className="hidden lg:block absolute -bottom-4 -right-8 bg-white px-4 py-2 rounded-full shadow-xl border border-pink-200 animate-bounce"
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
        </section>

        {/* SECCIÓN COMIENZA A PRACTICAR */}
        <section className="mb-20 px-4" data-aos="fade-up" data-aos-delay="200">
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="text-3xl">✨</div>
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-600 to-amber-600 bg-clip-text text-transparent">
              Comienza a practicar
            </h2>
            <div className="text-3xl">✨</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(action.link)}
                className={`group relative overflow-hidden ${action.bgColor} rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-rotate-1 transition-all duration-500 border-3 ${action.borderColor} cursor-pointer`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                ></div>

                <div className="absolute -top-4 -right-4 text-7xl opacity-20 group-hover:opacity-40 group-hover:rotate-12 transition-all duration-500">
                  {action.emoji}
                </div>

                <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                </div>

                <div className="relative z-10 flex flex-col items-start text-left gap-6">
                  <div
                    className={`w-20 h-20 bg-gradient-to-br ${action.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                  >
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="font-black text-3xl mb-2 text-amber-900 group-hover:text-pink-700 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-lg text-amber-700 font-medium">
                      {action.subtitle}
                    </p>
                  </div>

                  <div className="mt-2 text-pink-500 group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-2">
                    <span className="text-2xl font-bold">→</span>
                    <span className="text-lg">¡Vamos!</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* SECCIÓN TU PROGRESO */}
        <section className="mb-20 px-4" data-aos="fade-up" data-aos-delay="300">
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="text-3xl">📈</div>
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
              Tu progreso
            </h2>
            <div className="text-3xl">🎯</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {historyActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(action.link)}
                className={`group relative overflow-hidden ${action.bgColor} rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:rotate-1 transition-all duration-500 border-3 ${action.borderColor} cursor-pointer`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                ></div>

                <div className="absolute -top-4 -right-4 text-7xl opacity-20 group-hover:opacity-40 group-hover:-rotate-12 transition-all duration-500">
                  {action.emoji}
                </div>

                <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
                </div>

                <div className="relative z-10 flex flex-col items-start text-left gap-6">
                  <div
                    className={`w-20 h-20 bg-gradient-to-br ${action.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300`}
                  >
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="font-black text-3xl mb-2 text-amber-900 group-hover:text-purple-700 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-lg text-amber-700 font-medium">
                      {action.subtitle}
                    </p>
                  </div>

                  <div className="mt-2 text-purple-500 group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-2">
                    <span className="text-2xl font-bold">→</span>
                    <span className="text-lg">¡Ver más!</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* SECCIÓN CHATBOT CON IA */}
        <section
          id="chatbot-section"
          className="px-4"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <div className="relative overflow-hidden bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 rounded-3xl p-8 sm:p-12 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 group border-4 border-pink-300">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
            </div>

            <div className="absolute top-8 right-8 text-5xl opacity-20 animate-bounce">
              🐾
            </div>
            <div
              className="absolute bottom-8 left-8 text-5xl opacity-20 animate-bounce"
              style={{ animationDelay: "0.5s" }}
            >
              🐾
            </div>

            <div className="relative z-10 text-center">
              <div className="inline-block mb-6">
                <div className="text-6xl sm:text-8xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  💬
                </div>
              </div>
              <h3 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4">
                Chatbot con IA
              </h3>
              <p className="text-lg sm:text-xl md:text-2xl opacity-95 max-w-3xl mx-auto leading-relaxed mb-6 px-4">
                Tu asistente personal que{" "}
                <span className="font-black underline decoration-wavy">
                  siempre
                </span>{" "}
                está disponible para ayudarte con estrategias y resolver dudas
                sobre el IELTS en tiempo real
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
