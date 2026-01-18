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
      link: "/writing/",
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-600 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-700">
            Loading your dashboard...
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">
            {/* HERO */}
            <div className="relative overflow-hidden bg-gradient-to-br from-pink-500 via-pink-600 to-orange-500 rounded-3xl p-8 text-white shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-400/20 rounded-full blur-2xl" />

              <div className="relative z-10 grid md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  <span className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                    ✨ Preparación con IA
                  </span>

                  <h2 className="text-3xl sm:text-4xl font-black leading-tight">
                    Alcanza tu mejor puntuación
                  </h2>

                  <p className="text-white/90 text-sm sm:text-base">
                    Práctica personalizada con feedback instantáneo de IA
                    avanzada
                  </p>

                  <button
                    onClick={handleContinuePractice}
                    className="inline-flex items-center gap-2 bg-white text-pink-600 font-bold px-6 py-3 rounded-xl shadow-lg transition-all hover:scale-105"
                  >
                    Comenzar práctica →
                  </button>
                </div>

                <div className="hidden md:flex justify-center">
                  <div className="w-48 h-48 bg-white/10 rounded-3xl flex items-center justify-center rotate-6">
                    <div className="text-center">
                      <div className="text-6xl mb-2">😺</div>
                      <div className="flex justify-center gap-3 text-3xl">
                        🎤 ✍️
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* quick-actions */}
            <div className="flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
                {quickActions.map((action, index) => {
                  const isSecondary = index >= 2;

                  return (
                    <button
                      key={index}
                      onClick={() => handleNavigation(action.link)}
                      className={`
                        ${action.bgColor}
                        rounded-2xl
                        ${isSecondary ? "p-4" : "p-5"}
                        border border-gray-100
                        transition-all duration-300
                        hover:shadow-lg
                        hover:-translate-y-1
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`
                            ${action.iconBg}
                            ${
                              isSecondary
                                ? "w-11 h-11 text-lg"
                                : "w-12 h-12 text-xl"
                            }
                            rounded-xl
                            flex items-center justify-center
                            text-white
                            shadow-md
                          `}
                        >
                          {action.emoji}
                        </div>

                        <div className="flex-1 text-left">
                          <h4 className="font-black text-gray-800">
                            {action.title}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {action.subtitle}
                          </p>
                        </div>

                        <span className="text-gray-300 text-lg">→</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* derecha */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                🎯 Tu progreso
              </h3>

              <div className="space-y-4">
                <StatCard
                  emoji="📈"
                  label="Banda promedio"
                  value={
                    stats?.averageBand ? stats.averageBand.toFixed(1) : "N/A"
                  }
                  color="pink"
                />
                <StatCard
                  emoji="⚡"
                  label="Racha actual"
                  value={`${stats?.currentStreak || 0} días`}
                  color="purple"
                />
                <StatCard
                  emoji="🎓"
                  label="Total prácticas"
                  value={stats?.totalPractices || 0}
                  color="blue"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  emoji,
  label,
  value,
  color,
}: {
  emoji: string;
  label: string;
  value: string | number;
  color: "pink" | "purple" | "blue";
}) {
  const colors = {
    pink: "bg-pink-50 border-pink-100 text-pink-600",
    purple: "bg-purple-50 border-purple-100 text-purple-600",
    blue: "bg-blue-50 border-blue-100 text-blue-600",
  };

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-xl border ${colors[color]}`}
    >
      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl shadow">
        {emoji}
      </div>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className={`text-2xl font-black ${colors[color].split(" ")[2]}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
