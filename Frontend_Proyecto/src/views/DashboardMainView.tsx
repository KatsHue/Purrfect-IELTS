import { useEffect } from "react";
import { Mic, PenTool, BarChart3, History, Sparkles, Star } from "lucide-react";
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
      {/* elementos decorativos */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-yellow-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-purple-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Section Mejorado */}
        <section className="mb-20 px-4" data-aos="fade-down">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Contenido Izquierdo */}
            <div className="text-center lg:text-left space-y-6">
              <div className="inline-block lg:block">
                <span className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-pink-100 px-4 py-2 rounded-full text-orange-800 font-semibold text-sm border border-orange-200">
                  <Sparkles className="w-4 h-4" />
                  Tu compañero de estudio perfecto
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight">
                <span className="bg-gradient-to-r from-amber-800 via-pink-700 to-amber-800 bg-clip-text text-transparent">
                  ¡Bienvenido a
                </span>
                <br />
                <span className="bg-gradient-to-r from-pink-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Purrfect IELTS!
                </span>
                <span className="inline-block ml-3 animate-bounce">🐱</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Prepárate para el IELTS con{" "}
                <span className="font-bold text-orange-700">
                  práctica interactiva
                </span>
                , <span className="font-bold text-pink-600">IA avanzada</span> y
                mucho{" "}
                <span className="font-bold text-amber-600">amor gatuno</span> 💛
              </p>

              {/* CTAs Principales */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Comenzar Ahora
                    <span className="group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-orange-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>

                <button className="px-8 py-4 bg-white text-orange-700 font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl border-2 border-orange-200 hover:border-orange-300 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                  <span>💬</span>
                  Probar Chatbot IA
                </button>
              </div>

              {/* badges informativos */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-6">
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-pink-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500 font-medium">
                      IA Integrada
                    </p>
                    <p className="text-sm font-bold text-gray-800">
                      100% Gratis
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500 font-medium">
                      Feedback
                    </p>
                    <p className="text-sm font-bold text-gray-800">
                      Instantáneo
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ilustración Derecha */}
            <div className="relative" data-aos="fade-left" data-aos-delay="200">
              <div className="relative z-10">
                {/* Círculo decorativo de fondo */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-200 via-pink-200 to-yellow-200 rounded-full blur-3xl opacity-40 animate-pulse"></div>

                {/* Contenedor de imagen placeholder */}
                <div className="relative bg-gradient-to-br from-orange-100 via-pink-50 to-yellow-100 rounded-3xl p-8 border-4 border-white shadow-2xl">
                  {/* Aquí irá tu ilustración del gato */}
                  <div className="aspect-square flex items-center justify-center text-9xl">
                    🐱
                  </div>

                  {/* Elementos decorativos flotantes */}
                  <div className="absolute -top-4 -right-4 bg-white rounded-full p-4 shadow-xl animate-bounce">
                    <span className="text-3xl">✨</span>
                  </div>
                  <div
                    className="absolute -bottom-4 -left-4 bg-white rounded-full p-4 shadow-xl animate-bounce"
                    style={{ animationDelay: "0.5s" }}
                  >
                    <span className="text-3xl">📚</span>
                  </div>
                  <div
                    className="absolute top-1/2 -right-6 bg-white rounded-full p-3 shadow-xl animate-bounce"
                    style={{ animationDelay: "1s" }}
                  >
                    <span className="text-2xl">🎯</span>
                  </div>
                </div>
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
