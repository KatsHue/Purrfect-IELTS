import { useQuery } from "@tanstack/react-query";
import { AnalyticsAPI } from "@/api/AnalyticsAPI";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function DashboardMainView() {
  const { data: user, isLoading: authLoading } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["userStats"],
    queryFn: AnalyticsAPI.getUserStats,
  });

  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  const quickActions = [
    {
      emoji: "🎤",
      title: "Speaking",
      subtitle: "Practica conversación",
      bgColor: "bg-[#f1d49a]/40 hover:bg-[#f1d49a]/70",
      iconBg: "bg-[#f4bc3c]",
      link: "/speaking",
    },
    {
      emoji: "✍️",
      title: "Writing",
      subtitle: "Mejora tu escritura",
      bgColor: "bg-[#f1d49a]/40 hover:bg-[#f1d49a]/70",
      iconBg: "bg-[#f4bc3c]",
      link: "/writing/",
    },
    {
      emoji: "📊",
      title: "Analíticos",
      subtitle: "Revisa tu progreso",
      bgColor: "bg-[#f1d49a]/40 hover:bg-[#f1d49a]/70",
      iconBg: "bg-[#f4bc3c]",
      link: "/history/analytics",
    },
    {
      emoji: "📝",
      title: "Historial",
      subtitle: "Prácticas anteriores",
      bgColor: "bg-[#f1d49a]/40 hover:bg-[#f1d49a]/70",
      iconBg: "bg-[#f4bc3c]",
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#f4bc3c]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER */}
        <div className="mb-10" data-aos="fade-up">
          <h1 className="text-3xl sm:text-4xl font-black text-[#442e14] mb-2">
            Hola,{" "}
            <span className="text-orange">
              {authLoading ? "..." : user?.name || "estudiante"}
            </span>{" "}
            👋
          </h1>
          <p className="text-[#7f533b] text-lg">
            ¿Listo (a) para mejorar tu score en IELTS hoy?
          </p>
        </div>

        {/* Grid principal */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Columna izquierda */}
          <div className="lg:col-span-2 space-y-10">
            {/* HERO */}
            <div
              className="
                relative
                bg-[#f1d49a]
                rounded-3xl
                p-8
                lg:pr-[220px]
                shadow-md
                min-h-[260px]
                overflow-hidden
              "
              data-aos="fade-up"
            >
              {/* Fondo decorativo */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,#f4bc3c,transparent_60%)]" />

              {/* Contenido */}
              <div className="relative z-10 max-w-xl space-y-4">
                <span className="inline-flex items-center gap-2 bg-white/60 px-3 py-1 rounded-full text-xs font-semibold">
                  ✨ Preparación con IA
                </span>

                <h2 className="text-3xl sm:text-4xl font-black text-[#442e14] leading-tight">
                  Mejora tu inglés sin estrés
                </h2>

                <p className="text-[#7f533b]">
                  Práctica corta, clara y divertida todos los días
                </p>

                <button
                  onClick={handleContinuePractice}
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

              {/* Ilustración del hero */}
              <img
                src="/assets/images/hero-1.svg"
                alt="English learning illustration"
                className="
                  hidden lg:block
                  absolute
                  right-[-5px]
                  bottom-[-20px]
                  w-[300px]
                  max-w-none
                  pointer-events-none
                  select-none
                  drop-shadow-2xl
                  z-10
                "
              />
            </div>

            {/* Botones de secciones */}
            <div className="grid sm:grid-cols-2 gap-6" data-aos="fade-up">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleNavigation(action.link)}
                  className={`
                    ${action.bgColor}
                    rounded-2xl
                    p-5
                    border border-[#f1d49a]
                    transition
                    hover:-translate-y-1
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`
                        ${action.iconBg}
                        w-12 h-12
                        rounded-full
                        flex items-center justify-center
                        text-[#442e14]
                        text-xl
                      `}
                    >
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

          {/* Col derecha */}
          <div className="space-y-6" data-aos="fade-up">
            <div className="bg-[#f1d49a]/30 rounded-2xl p-6 border border-[#f1d49a]">
              <h3 className="text-lg font-bold text-[#442e14] mb-4">
                🎯 Tu progreso
              </h3>

              <div className="space-y-3">
                <StatCard
                  emoji="📈"
                  label="Band promedio"
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
