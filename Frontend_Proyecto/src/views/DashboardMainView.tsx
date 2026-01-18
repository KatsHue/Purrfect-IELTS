import { useQuery } from "@tanstack/react-query";
import { AnalyticsAPI } from "@/api/AnalyticsAPI";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardMainView() {
  const { data: user, isLoading: authLoading } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["userStats"],
    queryFn: AnalyticsAPI.getUserStats,
  });

  const quickActions = [
    {
      emoji: "🎤",
      title: "Speaking",
      subtitle: "Practica conversación",
      link: "/speaking",
    },
    {
      emoji: "✍️",
      title: "Writing",
      subtitle: "Mejora tu escritura",
      link: "/writing",
    },
    {
      emoji: "📊",
      title: "Analíticos",
      subtitle: "Revisa tu progreso",
      link: "/history/analytics",
    },
    {
      emoji: "📝",
      title: "Historial",
      subtitle: "Prácticas anteriores",
      link: "/history/history-complete",
    },
  ];

  const handleNavigation = (link: string) => {
    window.location.href = link;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f8f6]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-[#f4bc3c] mx-auto mb-4" />
          <p className="text-sm font-medium text-[#7f533b]">
            Preparando tu práctica ✨
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-[#442e14] mb-2">
            Hola,{" "}
            <span className="text-[#7f533b]">
              {authLoading ? "..." : user?.name || "estudiante"}
            </span>{" "}
            👋
          </h1>
          <p className="text-[#7f533b] text-lg">
            ¿Listo para mejorar tu score en IELTS hoy?
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* IZQUIERDA */}
          <div className="lg:col-span-2 space-y-10">
            {/* HERO */}
            <div className="relative bg-[#f1d49a] rounded-3xl p-8 shadow-md overflow-visible">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,#f4bc3c,transparent_60%)]" />

              <div className="relative grid md:grid-cols-2 items-center gap-6">
                {/* TEXTO */}
                <div className="space-y-4">
                  <span className="inline-flex items-center gap-2 bg-white/60 px-3 py-1 rounded-full text-xs font-semibold">
                    ✨ Preparación con IA
                  </span>

                  <h2 className="text-3xl sm:text-4xl font-black text-[#442e14] leading-tight">
                    Aprende inglés sin estrés
                  </h2>

                  <p className="text-[#7f533b] text-sm sm:text-base">
                    Práctica corta, clara y divertida todos los días
                  </p>

                  <button
                    onClick={() => handleNavigation("/speaking")}
                    className="
                      inline-flex items-center gap-2
                      bg-[#f4bc3c]
                      text-[#442e14]
                      font-black
                      px-6 py-3
                      rounded-full
                      shadow
                      hover:scale-105
                      transition
                    "
                  >
                    Comenzar práctica →
                  </button>
                </div>

                {/* IMAGEN DECORATIVA */}
                <div className="relative hidden md:flex justify-center">
                  <img
                    src="/assets/images/hero-1.svg"
                    alt="English learning illustration"
                    className="
                      w-[320px]
                      max-w-none
                      drop-shadow-xl
                      -rotate-2
                      translate-y-6
                      translate-x-6
                      select-none
                      pointer-events-none
                      animate-float
                    "
                  />
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigation(action.link)}
                  className="
                    bg-[#f1d49a]/40
                    hover:bg-[#f1d49a]/70
                    rounded-2xl
                    p-5
                    border border-[#f1d49a]
                    transition-all
                    hover:-translate-y-1
                  "
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#f4bc3c] rounded-full flex items-center justify-center text-xl">
                      {action.emoji}
                    </div>

                    <div className="flex-1 text-left">
                      <h4 className="font-black text-[#442e14]">
                        {action.title}
                      </h4>
                      <p className="text-sm text-[#7f533b]">
                        {action.subtitle}
                      </p>
                    </div>

                    <span className="text-[#bcb4ac] text-lg">→</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* DERECHA */}
          <div className="space-y-6">
            <div className="bg-[#f1d49a]/30 rounded-2xl p-6 border border-[#f1d49a]">
              <h3 className="text-lg font-bold text-[#442e14] mb-4 flex items-center gap-2">
                🎯 Tu progreso
              </h3>

              <div className="space-y-3">
                <StatCard
                  emoji="📈"
                  label="Banda promedio"
                  value={
                    stats?.averageBand ? stats.averageBand.toFixed(1) : "N/A"
                  }
                />
                <StatCard
                  emoji="⚡"
                  label="Racha actual"
                  value={`${stats?.currentStreak || 0} días`}
                />
                <StatCard
                  emoji="🎓"
                  label="Total prácticas"
                  value={stats?.totalPractices || 0}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================= */
/* ====== STAT CARD ======== */
/* ========================= */

function StatCard({
  emoji,
  label,
  value,
}: {
  emoji: string;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl border border-[#f1d49a] bg-[#f9f8f6]">
      <div className="w-10 h-10 bg-[#f4bc3c] text-[#442e14] rounded-full flex items-center justify-center text-xl">
        {emoji}
      </div>
      <div>
        <p className="text-sm text-[#7f533b]">{label}</p>
        <p className="text-2xl font-black text-[#442e14]">{value}</p>
      </div>
    </div>
  );
}
