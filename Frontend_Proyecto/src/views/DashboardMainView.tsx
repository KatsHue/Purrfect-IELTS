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

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9]">
        <p className="text-sm text-[#78716C]">Cargando dashboard…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* HEADER */}
        <header className="mb-10">
          <h1 className="text-3xl font-semibold text-[#292524]">
            Hola,{" "}
            <span className="font-bold">{user?.name || "estudiante"}</span>
          </h1>
          <p className="text-[#78716C] mt-1">
            Practica un poco cada día y mejora tu score en IELTS
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* IZQUIERDA */}
          <section className="lg:col-span-2 space-y-10">
            {/* CTA */}
            <div className="bg-white border border-[#E7E5E4] rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-[#292524] mb-2">
                Continúa practicando
              </h2>
              <p className="text-[#78716C] mb-6 max-w-lg">
                La práctica constante es la forma más efectiva de subir tu
                puntuación en el IELTS.
              </p>

              <button
                onClick={() => handleNavigation("/speaking")}
                className="
                  bg-[#F4BC3C]
                  text-[#292524]
                  font-medium
                  px-6 py-3
                  rounded-xl
                  hover:bg-[#EAB308]
                  transition
                "
              >
                Comenzar práctica
              </button>
            </div>

            {/* QUICK ACTIONS */}
            <div className="grid sm:grid-cols-2 gap-6">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigation(action.link)}
                  className="
                    bg-white
                    border border-[#E7E5E4]
                    rounded-2xl
                    p-5
                    text-left
                    hover:border-[#D6D3D1]
                    hover:shadow-sm
                    transition
                  "
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="
                      w-11 h-11
                      rounded-xl
                      bg-[#FEF3C7]
                      flex items-center justify-center
                      text-xl
                    "
                    >
                      {action.emoji}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-[#292524]">
                        {action.title}
                      </h3>
                      <p className="text-sm text-[#78716C]">
                        {action.subtitle}
                      </p>
                    </div>

                    <span className="text-[#A8A29E]">→</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* DERECHA */}
          <aside className="space-y-6">
            <div className="bg-white border border-[#E7E5E4] rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-[#292524] mb-4">
                Tu progreso
              </h3>

              <div className="space-y-4">
                <StatCard
                  label="Banda promedio"
                  value={
                    stats?.averageBand ? stats.averageBand.toFixed(1) : "N/A"
                  }
                />
                <StatCard
                  label="Racha actual"
                  value={`${stats?.currentStreak || 0} días`}
                />
                <StatCard
                  label="Total prácticas"
                  value={stats?.totalPractices || 0}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ========================= */
/* ====== STAT CARD ======== */
/* ========================= */

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-[#78716C]">{label}</p>
      <p className="text-lg font-semibold text-[#292524]">{value}</p>
    </div>
  );
}
