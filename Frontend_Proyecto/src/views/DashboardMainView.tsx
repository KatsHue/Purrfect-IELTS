import { useEffect } from "react";
import { Mic, PenTool, BarChart3, History, Sparkles } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function DashboardMainView() {
  useEffect(() => {
    AOS.init({
      duration: 1500,
      once: true,
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

  return (
    <div className="min-h-screen bg-white py-12 px-4 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-20 left-10 text-6xl opacity-20 animate-bounce">
        📚
      </div>
      <div
        className="absolute top-40 right-20 text-5xl opacity-20 animate-bounce"
        style={{ animationDelay: "0.3s" }}
      >
        ✨
      </div>
      <div
        className="absolute bottom-40 left-20 text-7xl opacity-20 animate-bounce"
        style={{ animationDelay: "0.6s" }}
      >
        🎯
      </div>
      <div
        className="absolute bottom-20 right-40 text-6xl opacity-20 animate-bounce"
        style={{ animationDelay: "0.9s" }}
      >
        💡
      </div>
      <div
        className="absolute top-1/2 left-1/4 text-5xl opacity-20 animate-bounce"
        style={{ animationDelay: "1.2s" }}
      >
        🌟
      </div>
      <div
        className="absolute top-1/3 right-1/3 text-4xl opacity-20 animate-bounce"
        style={{ animationDelay: "1.5s" }}
      >
        📝
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Section estilo moderno */}
        <section className="mb-20" data-aos="fade-down">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[600px]">
            {/* Contenido Izquierdo */}
            <div className="space-y-8 px-4 lg:px-8">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight">
                <span className="block text-ambar-600">Prepárate</span>
                <span className="block text-ambar-600">para la</span>
                <span className="block block text-ambar-600 bg-clip-text text-transparent">
                  certificación IELTS
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-gray-700 leading-relaxed max-w-lg font-medium">
                Práctica interactiva con{" "}
                <span className="font-black text-orange-600">IA avanzada</span>,{" "}
                <span className="font-black text-pink-600">
                  feedback instantáneo
                </span>{" "}
                y coaching personalizado para alcanzar tu mejor puntuación.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="px-10 py-5 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-black text-xl rounded-2xl shadow-2xl hover:shadow-orange-300 hover:scale-105 transition-all duration-300 uppercase tracking-wide">
                  Comenzar Práctica
                </button>
              </div>

              {/* Stats mini */}
              <div className="flex gap-8 pt-6">
                <div>
                  <p className="text-4xl font-black text-pink-600">100%</p>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Gratis
                  </p>
                </div>
                <div>
                  <p className="text-4xl font-black text-orange-600">24/7</p>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Disponible
                  </p>
                </div>
                <div>
                  <p className="text-4xl font-black text-amber-600">IA</p>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Integrada
                  </p>
                </div>
              </div>
            </div>

            {/* Ilustración Derecha */}
            <div
              className="relative px-4"
              data-aos="fade-left"
              data-aos-delay="200"
            >
              <div className="relative">
                {/* Imagen SVG */}
                <img
                  src="/assets/images/hero.svg"
                  alt="Purrfect IELTS Hero"
                  className="w-full h-auto relative z-10 drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-20" data-aos="fade-up" data-aos-delay="200">
          <div className="flex items-center justify-center gap-3 mb-10 px-4">
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

        <section className="mb-20" data-aos="fade-up" data-aos-delay="300">
          <div className="flex items-center justify-center gap-3 mb-10 px-4">
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

        <section data-aos="fade-up" data-aos-delay="400">
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
