import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { BookMarkedIcon, Clock, NotebookPenIcon } from "lucide-react";
import { BellAlertIcon, BoltIcon, BookmarkSquareIcon, ChartBarIcon, CpuChipIcon, EnvelopeIcon, LightBulbIcon, PencilSquareIcon, RectangleGroupIcon, SparklesIcon } from "@heroicons/react/20/solid";
import LoadingDots from "@/components/history/LoadingDots.";

export default function WritingView() {
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
          <h1 className="text-3xl sm:text-4xl font-black text-[#442e14] mb-2">
            Writing Practice <NotebookPenIcon className="inline-block w-8 h-8 text-[#f4bc3c]" />
          </h1>
          <p className="text-[#7f533b] text-lg">
            Mejora tu escritura académica con retroalimentación detallada por IA
          </p>
        </div>

        <div
          className="bg-[#f1d49a]/40 rounded-2xl p-6 border border-[#f1d49a] mb-10"
          data-aos="fade-up"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-black text-[#442e14] mb-3">
                Estructura de práctica de Writing
              </h2>
              <p className="text-sm text-[#7f533b] mb-4">
                Completa ambas tareas para obtener tu banda estimada con
                retroalimentación de IA
              </p>

              <div className="flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full border border-[#f4bc3c]/30">
                  <span className="w-6 h-6 bg-[#f4bc3c] text-[#442e14] rounded-full flex items-center justify-center text-xs font-black">
                    1
                  </span>
                  <span className="text-sm font-semibold text-[#442e14]">
                    Letter
                  </span>
                  <span className="text-xs text-[#7f533b]">20 min</span>
                </div>

                <div className="inline-flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full border border-[#f4bc3c]/30">
                  <span className="w-6 h-6 bg-[#f4bc3c] text-[#442e14] rounded-full flex items-center justify-center text-xs font-black">
                    2
                  </span>
                  <span className="text-sm font-semibold text-[#442e14]">
                    Essay
                  </span>
                  <span className="text-xs text-[#7f533b]">40 min</span>
                </div>
              </div>
            </div>

            <div className="bg-white/80 rounded-xl p-4 border border-[#f1d49a] lg:min-w-[180px]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f4bc3c] rounded-full flex items-center justify-center text-xl">
                  <Clock className="text-[#442e14]" />
                </div>
                <div>
                  <p className="text-xs text-[#7f533b]">Duración total</p>
                  <p className="text-lg font-black text-[#442e14]">60 min</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8" data-aos="fade-up">
          <div
            className="bg-[#f1d49a]/40 hover:bg-[#f1d49a]/70 rounded-3xl p-8 border border-[#f1d49a] transition hover:-translate-y-1 cursor-pointer"
            onClick={() => handleNavigation("/writing/task-1")}
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 bg-[#f4bc3c] rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                <EnvelopeIcon className="w-8 h-8 text-[#442e14]" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#442e14] mb-2">
                  Writing Task 1
                </h3>
                <p className="text-sm text-[#7f533b] font-semibold">
                  Carta Formal, Semi-formal o Informal (20 minutos)
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-[#7f533b]">
                Escribe una carta de al menos 150 palabras respondiendo a una
                situación dada. Puede ser formal (queja, solicitud), semi-formal
                (a un compañero de trabajo) o informal (a un amigo).
              </p>

              <div className="bg-white/60 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-[#442e14] text-sm flex items-center gap-1">
                  <SparklesIcon className="inline-block w-4 h-4 mr-1 text-yellow-500" />
                  Qué practicarás:
                </h4>
                <ul className="text-sm text-[#7f533b] space-y-1">
                  <li>• Estructura de carta apropiada</li>
                  <li>• Tono y registro adecuados</li>
                  <li>• Organización de ideas claras</li>
                  <li>• Gramática y vocabulario variado</li>
                </ul>
              </div>

              <div className="bg-[#f4bc3c]/20 border border-[#f4bc3c]/40 rounded-xl p-3">
                <p className="text-xs text-[#442e14] font-semibold flex items-center gap-1">
                  <ChartBarIcon className="inline-block w-4 h-4 mr-1" />
                  Criterios de evaluación:
                </p>
                <p className="text-xs text-[#7f533b] mt-1">
                  Task Achievement • Coherence & Cohesion • Lexical Resource •
                  Grammatical Range
                </p>
              </div>
            </div>

            <button className="w-full bg-[#f4bc3c] text-[#442e14] font-black px-6 py-3 rounded-full shadow hover:scale-105 transition">
              Comenzar Task 1 →
            </button>
          </div>

          <div
            className="bg-[#f1d49a]/40 hover:bg-[#f1d49a]/70 rounded-3xl p-8 border border-[#f1d49a] transition hover:-translate-y-1 cursor-pointer"
            onClick={() => handleNavigation("/writing/task-2")}
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 bg-[#f4bc3c] rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                <PencilSquareIcon className="w-8 h-8 text-[#442e14]" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#442e14] mb-2">
                  Writing Task 2
                </h3>
                <p className="text-sm text-[#7f533b] font-semibold">
                  Ensayo Académico (40 minutos)
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-[#7f533b]">
                Escribe un ensayo de al menos 250 palabras sobre un tema
                académico. Deberás presentar tu opinión, comparar puntos de
                vista, o discutir problemas y soluciones.
              </p>

              <div className="bg-white/60 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-[#442e14] text-sm">
                  ✨ Qué practicarás:
                </h4>
                <ul className="text-sm text-[#7f533b] space-y-1">
                  <li>• Introducción con tesis clara</li>
                  <li>• Argumentos bien desarrollados</li>
                  <li>• Ejemplos y evidencia relevantes</li>
                  <li>• Conclusión efectiva</li>
                </ul>
              </div>

              <div className="bg-[#f4bc3c]/20 border border-[#f4bc3c]/40 rounded-xl p-3">
                <p className="text-xs text-[#442e14] font-semibold flex items-center gap-1">
                  <BookmarkSquareIcon className="inline-block w-4 h-4 mr-1" />
                  Tipos de ensayo:
                </p>
                <p className="text-xs text-[#7f533b] mt-1">
                  Opinion • Discussion • Problem-Solution •
                  Advantages-Disadvantages
                </p>
              </div>
            </div>

            <button className="w-full bg-[#f4bc3c] text-[#442e14] font-black px-6 py-3 rounded-full shadow hover:scale-105 transition">
              Comenzar Task 2 →
            </button>
          </div>
        </div>

        <div
          className="mt-10 bg-[#f9f8f6] rounded-2xl p-8 border border-[#f1d49a]"
          data-aos="fade-up"
        >
          <h3 className="text-xl font-black text-[#442e14] mb-6 flex items-center gap-2">
            <LightBulbIcon className="inline-block w-5 h-5 text-yellow-500" />
            Consejos para tu práctica
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <TipCard
              title="Planifica primero"
              description="Dedica 5 minutos a organizar tus ideas antes de escribir"
            />
            <TipCard
              title="Cuenta palabras"
              description="Task 1: mínimo 150 palabras. Task 2: mínimo 250 palabras"
            />
            <TipCard
              title="Revisa tu trabajo"
              description="Reserva tiempo al final para corregir errores gramaticales"
            />
            <TipCard
              title="Responde la pregunta"
              description="Asegúrate de abordar todos los puntos que se te piden"
            />
            <TipCard
              title="Varía tu vocabulario"
              description="Usa sinónimos y evita repetir las mismas palabras"
            />
            <TipCard
              title="Usa el feedback IA"
              description="Analiza la retroalimentación detallada para mejorar"
            />
          </div>
        </div>

        <div
          className="mt-8 bg-[#f1d49a]/40 border-2 border-[#f4bc3c] rounded-2xl p-6"
          data-aos="fade-up"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#f4bc3c] rounded-full flex items-center justify-center text-2xl flex-shrink-0">
             <BoltIcon className="w-6 h-6 text-[#442e14]" /> 
            </div>
            <div>
              <h3 className="text-lg font-black text-[#442e14] mb-2">
                ¿Sabías que Task 2 vale más?
              </h3>
              <p className="text-[#7f533b] text-sm">
                La Task 2 (ensayo) representa el 66% de tu calificación final en
                Writing, mientras que la Task 1 (carta) es el 34%. Sin embargo,
                ambas son importantes para lograr una buena banda.
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
        {title === "Planifica primero" && <Clock className="w-5 h-5" />}
        {title === "Cuenta palabras" && <BookMarkedIcon className="w-5 h-5" />}
        {title === "Revisa tu trabajo" && <PencilSquareIcon className="w-5 h-5" />}
        {title === "Responde la pregunta" && <BellAlertIcon className="w-5 h-5" />}
        {title === "Varía tu vocabulario" && <RectangleGroupIcon className="w-5 h-5" />}
        {title === "Usa el feedback IA" && <CpuChipIcon className="w-5 h-5" />}
      </div>
      <div>
        <h4 className="font-bold text-[#442e14] mb-1">{title}</h4>
        <p className="text-sm text-[#7f533b]">{description}</p>
      </div>
    </div>
  );
}
