import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function SpeakingView() {
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#f4bc3c]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10" data-aos="fade-up">
          <h1 className="text-3xl sm:text-4xl font-black text-[#442e14] mb-2">
            Speaking Practice 🎤
          </h1>
          <p className="text-[#7f533b] text-lg">
            Mejora tu fluidez y confianza con práctica guiada por IA
          </p>
        </div>

        <div
          className="bg-[#f1d49a]/40 rounded-2xl p-6 border border-[#f1d49a] mb-10"
          data-aos="fade-up"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-black text-[#442e14] mb-3">
                Estructura de práctica de Speaking
              </h2>
              <p className="text-sm text-[#7f533b] mb-4">
                Completa cada parte para obtener tu banda estimada con
                retroalimentación de IA
              </p>

              <div className="flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full border border-[#f4bc3c]/30">
                  <span className="w-6 h-6 bg-[#f4bc3c] text-[#442e14] rounded-full flex items-center justify-center text-xs font-black">
                    1
                  </span>
                  <span className="text-sm font-semibold text-[#442e14]">
                    Interview
                  </span>
                  <span className="text-xs text-[#7f533b]">4-5 min</span>
                </div>

                <div className="inline-flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full border border-[#f4bc3c]/30">
                  <span className="w-6 h-6 bg-[#f4bc3c] text-[#442e14] rounded-full flex items-center justify-center text-xs font-black">
                    2
                  </span>
                  <span className="text-sm font-semibold text-[#442e14]">
                    Individual Talk
                  </span>
                  <span className="text-xs text-[#7f533b]">3-4 min</span>
                </div>

                <div className="inline-flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full border border-[#f4bc3c]/30">
                  <span className="w-6 h-6 bg-[#f4bc3c] text-[#442e14] rounded-full flex items-center justify-center text-xs font-black">
                    3
                  </span>
                  <span className="text-sm font-semibold text-[#442e14]">
                    Discussion
                  </span>
                  <span className="text-xs text-[#7f533b]">4-5 min</span>
                </div>
              </div>
            </div>

            <div className="bg-white/80 rounded-xl p-4 border border-[#f1d49a] lg:min-w-[180px]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f4bc3c] rounded-full flex items-center justify-center text-xl">
                  ⏱️
                </div>
                <div>
                  <p className="text-xs text-[#7f533b]">Duración total</p>
                  <p className="text-lg font-black text-[#442e14]">11-14 min</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8" data-aos="fade-up">
          <div
            className="bg-[#f1d49a]/40 hover:bg-[#f1d49a]/70 rounded-3xl p-8 border border-[#f1d49a] transition hover:-translate-y-1 cursor-pointer"
            onClick={() => handleNavigation("/speaking/task-1")}
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 bg-[#f4bc3c] rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                👋
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#442e14] mb-2">
                  Speaking Part 1
                </h3>
                <p className="text-sm text-[#7f533b] font-semibold">
                  Entrevista Personal (4-5 minutos)
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-[#7f533b]">
                En esta sección responderás preguntas generales sobre ti, tu
                familia, trabajo, estudios, hobbies e intereses.
              </p>

              <div className="bg-white/60 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-[#442e14] text-sm">
                  ✨ Qué practicarás:
                </h4>
                <ul className="text-sm text-[#7f533b] space-y-1">
                  <li>• Respuestas cortas y naturales</li>
                  <li>• Vocabulario cotidiano</li>
                  <li>• Fluidez en temas familiares</li>
                  <li>• Pronunciación clara</li>
                </ul>
              </div>
            </div>

            <button className="w-full bg-[#f4bc3c] text-[#442e14] font-black px-6 py-3 rounded-full shadow hover:scale-105 transition">
              Comenzar Part 1 →
            </button>
          </div>

          <div
            className="bg-[#f1d49a]/40 hover:bg-[#f1d49a]/70 rounded-3xl p-8 border border-[#f1d49a] transition hover:-translate-y-1 cursor-pointer"
            onClick={() => handleNavigation("/speaking/task-2")}
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 bg-[#f4bc3c] rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                💬
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#442e14] mb-2">
                  Speaking Parts 2 & 3
                </h3>
                <p className="text-sm text-[#7f533b] font-semibold">
                  Discurso Individual + Discusión (6-7 minutos)
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-[#7f533b]">
                <strong className="text-[#442e14]">Part 2:</strong> Hablarás
                sobre un tema específico durante 1-2 minutos.
                <br />
                <strong className="text-[#442e14]">Part 3:</strong> Discutirás
                temas más abstractos relacionados con Part 2.
              </p>

              <div className="bg-white/60 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-[#442e14] text-sm">
                  ✨ Qué practicarás:
                </h4>
                <ul className="text-sm text-[#7f533b] space-y-1">
                  <li>• Monólogos estructurados</li>
                  <li>• Organización de ideas</li>
                  <li>• Argumentación avanzada</li>
                  <li>• Vocabulario académico</li>
                </ul>
              </div>
            </div>

            <button className="w-full bg-[#f4bc3c] text-[#442e14] font-black px-6 py-3 rounded-full shadow hover:scale-105 transition">
              Comenzar Parts 2 & 3 →
            </button>
          </div>
        </div>

        <div
          className="mt-10 bg-[#f9f8f6] rounded-2xl p-8 border border-[#f1d49a]"
          data-aos="fade-up"
        >
          <h3 className="text-xl font-black text-[#442e14] mb-6 flex items-center gap-2">
            💡 Consejos para tu práctica
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <TipCard
              emoji="🎯"
              title="Sé natural"
              description="Habla como en una conversación real, no memorices respuestas"
            />
            <TipCard
              emoji="⏱️"
              title="Practica el timing"
              description="Familiarízate con el tiempo de cada sección del examen"
            />
            <TipCard
              emoji="📝"
              title="Revisa feedback"
              description="La IA te dará retroalimentación detallada sobre tu desempeño"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function TipCard({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="w-10 h-10 bg-[#f4bc3c] text-[#442e14] rounded-full flex items-center justify-center text-xl flex-shrink-0">
        {emoji}
      </div>
      <div>
        <h4 className="font-bold text-[#442e14] mb-1">{title}</h4>
        <p className="text-sm text-[#7f533b]">{description}</p>
      </div>
    </div>
  );
}
