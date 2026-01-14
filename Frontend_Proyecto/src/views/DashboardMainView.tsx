import { useEffect } from "react";
import { BookOpen, Mic, PenTool, MessageCircle } from "lucide-react";
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
      icon: <Mic className="w-6 h-6" />,
      title: "Speaking",
      subtitle: "Practica conversación",
      color: "bg-amber-400 hover:bg-amber-500",
    },
    {
      icon: <PenTool className="w-6 h-6" />,
      title: "Writing",
      subtitle: "Mejora tu escritura",
      color: "bg-yellow-400 hover:bg-yellow-500",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Reading",
      subtitle: "Comprensión lectora",
      color: "bg-amber-300 hover:bg-amber-400",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Listening",
      subtitle: "Ejercicios de audio",
      color: "bg-yellow-300 hover:bg-yellow-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section con el logo */}
        <section className="text-center mb-12" data-aos="fade-down">
          <div className="inline-block mb-6 animate-bounce">
            <img
              src="/logo.png"
              alt="Purrfect IELTS Logo"
              className="w-32 h-32 mx-auto"
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

        {/* Main Actions */}
        <section className="mb-10" data-aos="fade-up" data-aos-delay="200">
          <h2 className="text-2xl font-bold text-amber-900 mb-6">
            Comienza a practicar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className={`${action.color} text-amber-900 rounded-xl p-6 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-left`}
              >
                <div className="mb-3">{action.icon}</div>
                <div className="font-bold text-lg mb-1">{action.title}</div>
                <div className="text-sm opacity-90">{action.subtitle}</div>
              </button>
            ))}
          </div>
        </section>

        {/* AI Chatbot Banner */}
        <section data-aos="fade-up" data-aos-delay="400">
          <div className="bg-gradient-to-r from-amber-600 to-yellow-500 rounded-2xl p-8 text-white shadow-lg">
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-3">
                💬 Chatbot con IA
              </h3>
              <p className="text-lg opacity-95">
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
