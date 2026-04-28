import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { ChartBarIcon, CpuChipIcon, DocumentTextIcon, EyeIcon, FireIcon, HeartIcon, LightBulbIcon, SparklesIcon, StarIcon, TrophyIcon } from "@heroicons/react/20/solid";
import { ChartLineIcon } from "lucide-react";
import LoadingDots from "@/components/history/LoadingDots.";

export default function MiActividadView() {
  const { isLoading } = useAuth();

  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  const handleNavigation = (link: string) => {
    window.location.href = link;
  };

  if (isLoading) {
    return (
      <LoadingDots />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10" data-aos="fade-up">
          <div className="text-[#442e14] items-center flex mb-3">
            <h1 className="text-4xl font-bold text-[#442e14] mr-3">
                Mi actividad
            </h1>
            <StarIcon className="w-8 h-8 text-yellow-500 mr-3" />
          </div>
          <p className="text-[#7f533b] text-lg">
            Revisa tu progreso, analíticos e historial de práctica
          </p>
        </div>

        <div
          className="bg-[#f1d49a]/40 rounded-2xl p-6 border border-[#f1d49a] mb-10"
          data-aos="fade-up"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-black text-[#442e14] mb-3">
                Seguimiento completo de tu preparación IELTS
              </h2>
              <p className="text-sm text-[#7f533b] mb-4">
                Accede a tus estadísticas detalladas, progreso por habilidad y
                registro completo de prácticas
              </p>

              <div className="flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full border border-[#f4bc3c]/30">
                  <span className="w-6 h-6 bg-[#f4bc3c] text-[#442e14] rounded-full flex items-center justify-center text-xs font-black">
                    <ChartBarIcon className="w-3.5 h-3.5"></ChartBarIcon>
                  </span>
                  <span className="text-sm font-semibold text-[#442e14]">
                    Analíticos
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full border border-[#f4bc3c]/30">
                  <span className="w-6 h-6 bg-[#f4bc3c] text-[#442e14] rounded-full flex items-center justify-center text-xs font-black">
                    <DocumentTextIcon className="w-3.5 h-3.5"></DocumentTextIcon>
                  </span>
                  <span className="text-sm font-semibold text-[#442e14]">
                    Historial
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/80 rounded-xl p-4 border border-[#f1d49a] lg:min-w-[180px]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f4bc3c] rounded-full flex items-center justify-center text-xl">
                  <EyeIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[#7f533b]">Tu progreso</p>
                  <p className="text-lg font-black text-[#442e14]">
                    En tiempo real
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8" data-aos="fade-up">
          <div
            className="bg-[#f1d49a]/40 hover:bg-[#f1d49a]/70 rounded-3xl p-8 border border-[#f1d49a] transition hover:-translate-y-1 cursor-pointer"
            onClick={() => handleNavigation("/history/analytics")}
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 bg-[#f4bc3c] rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                <ChartBarIcon className="w-6 h-6 text-[#442e14]" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#442e14] mb-2">
                  Analíticos
                </h3>
                <p className="text-sm text-[#7f533b] font-semibold">
                  Estadísticas y progreso detallado
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-[#7f533b]">
                Visualiza tu rendimiento con gráficas y bands estimadas por
                habilidad.
              </p>

              <div className="bg-white/60 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-[#442e14] text-sm items-center flex">
                  <SparklesIcon className="w-5 h-5 inline mr-2 text-yellow-500" />
                  Qué encontrarás:
                </h4>
                <ul className="text-sm text-[#7f533b] space-y-1">
                  <li>• Gráficas de progreso por habilidad</li>
                  <li>• Bands estimadas actualizadas</li>
                  <li>• Resumen de tiempo de práctica</li>
                </ul>
              </div>
            </div>

            <button className="w-full bg-[#f4bc3c] text-[#442e14] font-black px-6 py-3 rounded-full shadow hover:scale-105 transition">
              Ver Analíticos →
            </button>
          </div>

          <div
            className="bg-[#f1d49a]/40 hover:bg-[#f1d49a]/70 rounded-3xl p-8 border border-[#f1d49a] transition hover:-translate-y-1 cursor-pointer"
            onClick={() => handleNavigation("/history/history-complete")}
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 bg-[#f4bc3c] rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                <DocumentTextIcon className="w-6 h-6 text-[#442e14]" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#442e14] mb-2">
                  Historial
                </h3>
                <p className="text-sm text-[#7f533b] font-semibold">
                  Registro completo de prácticas
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-[#7f533b]">
                Accede al registro detallado de todas tus prácticas.
              </p>

              <div className="bg-white/60 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-[#442e14] text-sm items-center flex">
                  <SparklesIcon className="w-5 h-5 inline mr-2 text-yellow-500" />
                  Qué encontrarás:
                </h4>
                <ul className="text-sm text-[#7f533b] space-y-1">
                  <li>• Todas tus prácticas organizadas</li>
                  <li>• Feedback detallado de cada tarea</li>
                  <li>• Filtros por habilidad</li>
                </ul>
              </div>
            </div>

            <button className="w-full bg-[#f4bc3c] text-[#442e14] font-black px-6 py-3 rounded-full shadow hover:scale-105 transition">
              Ver Historial →
            </button>
          </div>
        </div>

        <div
          className="mt-10 bg-[#f9f8f6] rounded-2xl p-8 border border-[#f1d49a]"
          data-aos="fade-up"
        >
          <h3 className="text-xl font-black text-[#442e14] mb-6 flex items-center gap-2">
            <LightBulbIcon className="w-5 h-5 inline mr-2 text-yellow-500" />
            Aprovecha al máximo tu actividad
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <TipCard
              title="Revisa tus analíticos"
              description="Identifica patrones y áreas que necesitan más práctica"
            />
            <TipCard
              title="Repasa tu historial"
              description="Vuelve a leer el feedback de prácticas anteriores"
            />
            <TipCard
              title="Establece metas"
              description="Usa tus datos para crear objetivos de mejora específicos"
            />
            <TipCard
              title="Mide tu progreso"
              description="Compara tus bands actuales con las de semanas anteriores"
            />
            <TipCard
              title="Mantén la constancia"
              description="La práctica regular es clave para mejorar tu puntuación"
            />
            <TipCard
              title="Confía en la IA"
              description="El feedback automático mejora con cada práctica que realizas"
            />
          </div>
        </div>

        <div
          className="mt-8 bg-[#f1d49a]/40 border-2 border-[#f4bc3c] rounded-2xl p-6"
          data-aos="fade-up"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#f4bc3c] rounded-full flex items-center justify-center text-2xl flex-shrink-0">
              <FireIcon className="w-6 h-6 text-[#442e14]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#442e14] mb-2">
                ¡Mantén tu racha de práctica!
              </h3>
              <p className="text-[#7f533b] text-sm">
                Estudios muestran que practicar de forma consistente, aunque sea
                solo 15 minutos al día, es más efectivo que sesiones largas
                esporádicas. Tu historial y analíticos te ayudan a mantener el
                ritmo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TipCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="w-10 h-10 bg-[#f4bc3c] text-[#442e14] rounded-full flex items-center justify-center text-xl flex-shrink-0">
        {title === "Revisa tus analíticos" && <ChartBarIcon className="w-5 h-5 text-[#442e14]" />}
        {title === "Repasa tu historial" && <DocumentTextIcon className="w-5 h-5 text-[#442e14]" />}
        {title === "Establece metas" && <TrophyIcon className="w-5 h-5 text-[#442e14]" />}
        {title === "Mide tu progreso" && <ChartLineIcon className="w-5 h-5 text-[#442e14]" />}
        {title === "Mantén la constancia" && <HeartIcon className="w-5 h-5 text-[#442e14]" />}
        {title === "Confía en la IA" && <CpuChipIcon className="w-5 h-5 text-[#442e14]" />}
      </div>
      <div>
        <h4 className="font-bold text-[#442e14] mb-1">{title}</h4>
        <p className="text-sm text-[#7f533b]">{description}</p>
      </div>
    </div>
  );
}
