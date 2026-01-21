import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { AnalyticsAPI } from "@/api/AnalyticsAPI";
import {
  ChevronLeftIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { formatResponse } from "@/utils/format";

export default function PracticeDetailView() {
  const { id } = useParams<{ id: string }>();

  const { data: practice, isLoading } = useQuery({
    queryKey: ["practiceDetail", id],
    queryFn: () => AnalyticsAPI.getPracticeDetail(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#f4bc3c] mx-auto mb-4"></div>
          <p className="text-lg font-medium text-[#7f533b]">
            Cargando práctica...
          </p>
        </div>
      </div>
    );
  }

  if (!practice) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-xl">
          <p className="font-bold">Práctica no encontrada.</p>
        </div>
      </div>
    );
  }

  const sections = formatResponse(practice.aiFeedback);

  function renderContent(content: string) {
    const lines = content.split("\n").filter((line) => line.trim() !== "");

    if (lines.every((l) => /^(\d+\.\s|\-\s|\*\s)/.test(l.trim()))) {
      const isOrdered = lines.every((l) => /^\d+\./.test(l.trim()));
      return isOrdered ? (
        <ol className="list-decimal list-inside space-y-2 text-[#442e14]">
          {lines.map((line, i) => (
            <li key={i} className="leading-relaxed">
              {line.replace(/^\d+\.\s/, "")}
            </li>
          ))}
        </ol>
      ) : (
        <ul className="list-disc list-inside space-y-2 text-[#442e14]">
          {lines.map((line, i) => (
            <li key={i} className="leading-relaxed">
              {line.replace(/^(\-|\*)\s/, "")}
            </li>
          ))}
        </ul>
      );
    }

    return (
      <p className="whitespace-pre-line text-[#442e14] leading-relaxed">
        {content}
      </p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#f1d49a]/40 to-white p-6 rounded-2xl border-2 border-[#f1d49a]">
        <div className="flex items-center gap-4">
          <Link
            to="/history/history-complete"
            className="p-2 hover:bg-[#f4bc3c]/20 rounded-lg transition"
          >
            <ChevronLeftIcon className="h-6 w-6 text-[#7f533b]" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-[#442e14]">
              Detalles de la práctica
            </h1>
            <p className="text-sm text-[#7f533b]">
              Análisis completo de tu sesión de práctica
            </p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-white border-2 border-[#f1d49a] p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                  practice.type === "speaking"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {practice.type.toUpperCase()}
              </span>
              <span className="px-4 py-1.5 bg-[#f1d49a] text-[#442e14] rounded-full text-xs font-bold">
                {practice.task.toUpperCase().replace("-", " ")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#7f533b]">
              <ClockIcon className="h-4 w-4" />
              <p>
                {new Date(practice.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* Hero */}
          {practice.estimatedBand && (
            <div className="flex-shrink-0">
              <div
                className={`inline-flex flex-col items-center justify-center p-6 rounded-2xl shadow-md ${
                  practice.estimatedBand >= 7
                    ? "bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-300"
                    : practice.estimatedBand >= 6
                    ? "bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-300"
                    : "bg-gradient-to-br from-orange-100 to-orange-200 border-2 border-orange-300"
                }`}
              >
                <p className="text-xs font-bold text-[#7f533b] mb-1">
                  BAND SCORE
                </p>
                <p
                  className={`text-4xl font-black ${
                    practice.estimatedBand >= 7
                      ? "text-green-600"
                      : practice.estimatedBand >= 6
                      ? "text-yellow-600"
                      : "text-orange-600"
                  }`}
                >
                  {practice.estimatedBand.toFixed(1)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Pregunta */}
        <div className="mb-6 p-4 bg-[#f9f8f6] rounded-xl border border-[#f1d49a]">
          <h2 className="font-bold text-[#442e14] mb-2 flex items-center gap-2">
            <span className="text-lg">📋</span> Question:
          </h2>
          <p className="text-[#442e14] whitespace-pre-line leading-relaxed">
            {practice.question}
          </p>
        </div>

        {/* Metadata */}
        {practice.metadata && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t-2 border-[#f1d49a]">
            {practice.metadata.toneType && (
              <div className="bg-[#f9f8f6] p-3 rounded-xl">
                <p className="text-xs text-[#7f533b] font-bold mb-1">
                  Letter Type
                </p>
                <p className="font-bold text-[#442e14] capitalize">
                  {practice.metadata.toneType}
                </p>
              </div>
            )}
            {practice.metadata.taskRelevance && (
              <div className="bg-[#f9f8f6] p-3 rounded-xl">
                <p className="text-xs text-[#7f533b] font-bold mb-1">
                  Task Relevance
                </p>
                <p
                  className={`font-bold capitalize ${
                    practice.metadata.taskRelevance === "adequate"
                      ? "text-green-600"
                      : practice.metadata.taskRelevance === "partial"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {practice.metadata.taskRelevance.replace("-", " ")}
                </p>
              </div>
            )}
            {practice.metadata.recordingDuration && (
              <div className="bg-[#f9f8f6] p-3 rounded-xl">
                <p className="text-xs text-[#7f533b] font-bold mb-1">
                  Recording Duration
                </p>
                <p className="font-bold text-[#442e14]">
                  {Math.floor(practice.metadata.recordingDuration / 60)}:
                  {String(practice.metadata.recordingDuration % 60).padStart(
                    2,
                    "0"
                  )}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Respuesta dell usuario */}
      <div className="bg-white border-2 border-[#f1d49a] p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-black text-[#442e14] mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-[#f4bc3c] rounded-full flex items-center justify-center text-white text-sm">
            ✍️
          </span>
          Your Response
        </h2>
        <div className="p-5 bg-[#f9f8f6] rounded-xl border-2 border-[#f1d49a]">
          <p className="whitespace-pre-line text-[#442e14] leading-relaxed">
            {practice.userResponse}
          </p>
        </div>
      </div>

      {/* Bullet Points */}
      {practice.bulletPointsCovered &&
        practice.bulletPointsCovered.length > 0 && (
          <div className="bg-white border-2 border-[#f1d49a] p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-black text-[#442e14] mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#f4bc3c] rounded-full flex items-center justify-center text-white text-sm">
                ✓
              </span>
              Bullet Points Coverage
            </h2>
            <div className="space-y-3">
              {practice.bulletPointsCovered.map((bullet: any, idx: number) => (
                <div
                  key={idx}
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 ${
                    bullet.status === "covered"
                      ? "bg-green-50 border-green-200"
                      : bullet.status === "partial"
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  {bullet.status === "covered" ? (
                    <CheckCircleIcon className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : bullet.status === "partial" ? (
                    <ExclamationCircleIcon className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircleIcon className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <p className="text-[#442e14] font-medium flex-1">
                    {bullet.point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* AI Feedback */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#f4bc3c] rounded-full flex items-center justify-center text-xl">
            🤖
          </div>
          <h2 className="text-2xl font-black text-[#442e14]">
            AI Feedback & Analysis
          </h2>
        </div>

        {sections.map((section, idx) => (
          <div
            key={idx}
            className="bg-white border-2 border-[#f1d49a] p-6 rounded-2xl shadow-lg"
          >
            <h3 className="font-black text-lg mb-4 text-[#f4bc3c] flex items-center gap-2">
              <span className="w-6 h-6 bg-[#f4bc3c] text-[#442e14] rounded-full flex items-center justify-center text-xs font-black">
                {idx + 1}
              </span>
              {section[0]}
            </h3>
            <div className="bg-[#f9f8f6] p-4 rounded-xl">
              {renderContent(section.slice(1).join("\n"))}
            </div>
          </div>
        ))}
      </div>

      {/* Errores */}
      {practice.identifiedErrors && practice.identifiedErrors.length > 0 && (
        <div className="bg-white border-2 border-[#f1d49a] p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-black text-[#442e14] mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm">
              ⚠️
            </span>
            Key Areas for Improvement
          </h2>
          <div className="space-y-3">
            {practice.identifiedErrors.map((error: string, idx: number) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 bg-amber-50 rounded-xl border-2 border-amber-200"
              >
                <span className="flex items-center justify-center w-7 h-7 bg-amber-500 text-white rounded-full font-black text-sm flex-shrink-0">
                  {idx + 1}
                </span>
                <p className="text-[#442e14] font-medium flex-1">{error}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottón */}
      <div className="pt-4">
        <Link
          to="/history/history-complete"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#f4bc3c] text-[#442e14] rounded-full font-bold hover:bg-amber-500 hover:scale-105 transition shadow-md"
        >
          <ChevronLeftIcon className="h-5 w-5" />
          Regresar
        </Link>
      </div>
    </div>
  );
}
