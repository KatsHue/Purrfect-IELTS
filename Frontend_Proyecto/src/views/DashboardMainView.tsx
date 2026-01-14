import { useEffect } from "react";
import { Mic, PenTool, BarChart3, History } from "lucide-react";
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
      icon: <Mic className="w-8 h-8" />,
      title: "Speaking",
      subtitle: "Practica conversación",
      color: "bg-amber-400 hover:bg-amber-500",
      link: "https://purrfect-ielts.onrender.com/speaking",
    },
    {
      icon: <PenTool className="w-8 h-8" />,
      title: "Writing",
      subtitle: "Mejora tu escritura",
      color: "bg-yellow-400 hover:bg-yellow-500",
      link: "https://purrfect-ielts.onrender.com/writing",
    },
  ];

  const historyActions = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analíticos",
      subtitle: "Revisa tu progreso",
      color: "bg-orange-400 hover:bg-orange-500",
      link: "https://purrfect-ielts.onrender.com/history/analytics",
    },
    {
      icon: <History className="w-8 h-8" />,
      title: "Historial",
      subtitle: "Tus prácticas anteriores",
      color: "bg-amber-500 hover:bg-amber-600",
      link: "https://purrfect-ielts.onrender.com/history/history-complete",
    },
  ];

  const handleNavigation = (link: string) => {
    window.location.href = link;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Welcome Section con el logo */}
        <section className="text-center mb-16" data-aos="fade-down">
          <div className="inline-block mb-6 animate-bounce">
            <img
              src="/assets/images/logoCabeza.svg"
              alt="Purrfect IELTS Logo"
              className="w-40 h-40 mx-auto object-contain drop-shadow-lg"
            />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-amber-900">
            ¡Bienvenido a Purrfect IELTS!
          </h1>
          <p className="text-lg md:text-xl text-amber-800 max-w-2xl mx-auto">
            Prepárate para el IELTS con práctica interactiva y retroalimentación
            instantánea
          </p>
        </section>

        {/* Main Actions - Centrado y más grande */}
        <section className="mb-16" data-aos="fade-up" data-aos-delay="200">
          <h2 className="text-3xl font-bold text-amber-900 mb-8 text-center">
            Comienza a practicar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(action.link)}
                className={`${action.color} text-amber-900 rounded-2xl p-10 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300`}
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                    {action.icon}
                  </div>
                  <div>
                    <div className="font-bold text-2xl mb-2">
                      {action.title}
                    </div>
                    <div className="text-base opacity-90">
                      {action.subtitle}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* History & Analytics Section */}
        <section className="mb-16" data-aos="fade-up" data-aos-delay="300">
          <h2 className="text-3xl font-bold text-amber-900 mb-8 text-center">
            Tu progreso
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {historyActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(action.link)}
                className={`${action.color} text-amber-900 rounded-2xl p-10 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300`}
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                    {action.icon}
                  </div>
                  <div>
                    <div className="font-bold text-2xl mb-2">
                      {action.title}
                    </div>
                    <div className="text-base opacity-90">
                      {action.subtitle}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* AI Chatbot Banner */}
        <section data-aos="fade-up" data-aos-delay="400">
          <div className="bg-gradient-to-r from-amber-600 to-yellow-500 rounded-3xl p-10 text-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="text-center">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Chatbot con IA
              </h3>
              <p className="text-lg md:text-xl opacity-95 max-w-2xl mx-auto">
                Obtén estrategias personalizadas y resuelve tus dudas sobre el
                examen IELTS en tiempo real
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
