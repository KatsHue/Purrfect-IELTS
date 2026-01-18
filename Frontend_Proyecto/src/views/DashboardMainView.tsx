import { useQuery } from "@tanstack/react-query";
import { AnalyticsAPI } from "@/api/AnalyticsAPI";

export default function DashboardMainView() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["userStats"],
    queryFn: AnalyticsAPI.getUserStats,
  });

  const quickActions = [
    {
      emoji: "🎤",
      title: "Speaking",
      subtitle: "Practica conversación",
      bgColor: "bg-pink-50",
      iconBg: "bg-pink-500",
      link: "/speaking",
    },
    {
      emoji: "✍️",
      title: "Writing",
      subtitle: "Mejora tu escritura",
      bgColor: "bg-amber-50",
      iconBg: "bg-amber-500",
      link: "/writing",
    },
    {
      emoji: "📊",
      title: "Analíticos",
      subtitle: "Revisa tu progreso",
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-500",
      link: "/history/analytics",
    },
    {
      emoji: "📝",
      title: "Historial",
      subtitle: "Prácticas anteriores",
      bgColor: "bg-orange-50",
      iconBg: "bg-orange-500",
      link: "/history/history-complete",
    },
  ];

  const handleNavigation = (link: string) => {
    window.location.href = link;
  };

  const handleContinuePractice = () => {
    window.location.href = "/speaking";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-600 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-700">
            Cargando tu dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-800 mb-2">
            Hola,{" "}
            <span className="bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
              estudiante
            </span>{" "}
            👋
          </h1>
          <p className="text-gray-600 text-lg">
            ¿Listo para mejorar tu score en IELTS hoy?
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* HERO CARD */}
            <div className="relative overflow-hidden bg-gradient-to-br from-pink-500 via-pink-600 to-orange-500 rounded-3xl p-8 text-white shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-400 opacity-20 rounded-full blur-2xl" />

              <div className="relative z-10 grid md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-semibold">
                    ✨ Preparación con IA
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-black leading-tight">
                    Alcanza tu mejor puntuación
                  </h2>

                  <p className="text-white text-opacity-90 text-sm sm:text-base">
                    Práctica personalizada con feedback instantáneo de IA
                    avanzada
                  </p>

                  <button
                    onClick={handleContinuePractice}
                    className="group inline-flex items-center gap-2 bg-white text-pink-600 font-bold px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Comenzar práctica
                    <span className="group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </button>
                </div>

                <div className="hidden md:flex items-center justify-center">
                  <div className="w-48 h-48 bg-white bg-opacity-10 rounded-3xl flex items-center justify-center transform rotate-6 hover:rotate-12 transition-transform duration-500">
                    <div className="text-center space-y-2">
                      <div className="text-6xl">😺</div>
                      <div className="flex gap-3 text-3xl justify-center">
                        <span>🎤</span>
                        <span>✍️</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="grid sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const isSecondary = index >= 2;

                return (
                  <button
                    key={index}
                    onClick={() => handleNavigation(action.link)}
                    className={`
                      group ${action.bgColor}
                      rounded-2xl
                      ${isSecondary ? "p-4" : "p-6"}
                      hover:shadow-lg
                      transition-all duration-300
                      hover:scale-105
                      border border-gray-100
                    `}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`
                          ${action.iconBg}
                          ${
                            isSecondary
                              ? "w-12 h-12 text-xl"
                              : "w-14 h-14 text-2xl"
                          }
                          rounded-xl
                          flex items-center justify-center
                          text-white
                          group-hover:scale-110
                          group-hover:rotate-6
                          transition-all duration-300
                          shadow-md
                        `}
                      >
                        {action.emoji}
                      </div>

                      <div className="flex-1 text-left">
                        <h4
                          className={`
                            font-black text-gray-800 mb-1
                            ${isSecondary ? "text-lg" : "text-xl"}
                          `}
                        >
                          {action.title}
                        </h4>
                        <p
                          className={`
                            text-gray-600
                            ${isSecondary ? "text-xs" : "text-sm"}
                          `}
                        >
                          {action.subtitle}
                        </p>
                      </div>

                      <span className="text-gray-400 group-hover:translate-x-1 transition-transform text-xl">
                        →
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                🎯 Tu progreso
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-pink-50 rounded-xl border border-pink-100">
                  <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center text-xl">
                    📈
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Banda promedio</p>
                    <p className="text-2xl font-black text-pink-600">
                      {stats?.averageBand
                        ? stats.averageBand.toFixed(1)
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-xl">
                    ⚡
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Racha actual</p>
                    <p className="text-2xl font-black text-purple-600">
                      {stats?.currentStreak || 0} días
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-xl">
                    🎓
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total prácticas</p>
                    <p className="text-2xl font-black text-blue-600">
                      {stats?.totalPractices || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
