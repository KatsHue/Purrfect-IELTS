import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnalyticsAPI } from "@/api/AnalyticsAPI";
import { Link } from "react-router-dom";
import {
  MicrophoneIcon,
  PencilSquareIcon,
  ChevronLeftIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/solid";

export default function HistoryView() {
  const [filter, setFilter] = useState<{
    type?: "speaking" | "writing";
    task?: string;
  }>({});
  const [page, setPage] = useState(0);
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["practiceHistory", filter, page],
    queryFn: () =>
      AnalyticsAPI.getPracticeHistory({
        ...filter,
        limit,
        skip: page * limit,
      }),
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilter((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
    }));
    setPage(0);
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#f4bc3c] mx-auto mb-4"></div>
          <p className="text-lg font-medium text-[#7f533b]">
            Cargando historial...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-[#f1d49a] to-white p-6 rounded-2xl border-2 border-[#f1d49a]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/history/analytics"
              className="p-2 hover:bg-[#f4bc3c]/20 rounded-lg transition"
            >
              <ChevronLeftIcon className="h-6 w-6 text-[#7f533b]" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#f4bc3c] rounded-full flex items-center justify-center">
                <ClipboardDocumentListIcon className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-[#442e14]">
                  Historial de Prácticas
                </h1>
                <p className="text-sm text-[#7f533b]">
                  Revisa todas tus prácticas completadas
                </p>
              </div>
            </div>
          </div>
          {data && (
            <div className="hidden sm:block text-right">
              <p className="text-2xl font-black text-[#442e14]">
                {data.total || 0}
              </p>
              <p className="text-xs text-[#7f533b] font-medium">Prácticas</p>
            </div>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-gradient-to-br from-[#f9f8f6] to-white p-6 rounded-2xl shadow-lg border-2 border-[#f1d49a]">
        <div className="flex flex-wrap gap-6">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-bold text-[#442e14] mb-2 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#f4bc3c] rounded-full flex items-center justify-center text-xs text-white font-black">
                1
              </span>
              Habilidad
            </label>
            <select
              value={filter.type || "all"}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className="w-full px-4 py-3 border-2 border-[#f1d49a] rounded-xl focus:ring-2 focus:ring-[#f4bc3c] focus:border-[#f4bc3c] bg-white text-[#442e14] font-semibold shadow-sm hover:border-[#f4bc3c] transition cursor-pointer"
            >
              <option value="all">Todas</option>
              <option value="speaking">Speaking</option>
              <option value="writing">Writing</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-bold text-[#442e14] mb-2 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#f4bc3c] rounded-full flex items-center justify-center text-xs text-white font-black">
                2
              </span>
              Task
            </label>
            <select
              value={filter.task || "all"}
              onChange={(e) => handleFilterChange("task", e.target.value)}
              className="w-full px-4 py-3 border-2 border-[#f1d49a] rounded-xl focus:ring-2 focus:ring-[#f4bc3c] focus:border-[#f4bc3c] bg-white text-[#442e14] font-semibold shadow-sm hover:border-[#f4bc3c] transition cursor-pointer"
            >
              <option value="all">Todas</option>
              <option value="task-one">Task 1</option>
              <option value="task-two">Task 2</option>
              <option value="task-three">Task 3</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resultados */}
      {data && data.practices.length > 0 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-[#7f533b] font-medium">
            Mostrando {page * limit + 1}-
            {Math.min((page + 1) * limit, data.total || 0)} de {data.total || 0}{" "}
            prácticas
          </p>
        </div>
      )}

      {/* Resultados */}
      {data && data.practices.length > 0 ? (
        <div className="space-y-4">
          {data.practices.map((practice) => (
            <Link
              key={practice._id}
              to={`/history/history-complete/${practice._id}`}
              className="block bg-white border-2 border-[#f1d49a] p-6 rounded-2xl shadow-md hover:shadow-xl hover:border-[#f4bc3c] transition-all hover:-translate-y-1"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  {/* Iconos */}
                  <div
                    className={`p-3 rounded-xl shadow-sm ${
                      practice.type === "speaking"
                        ? "bg-blue-100"
                        : "bg-green-100"
                    }`}
                  >
                    {practice.type === "speaking" ? (
                      <MicrophoneIcon className="h-6 w-6 text-blue-600" />
                    ) : (
                      <PencilSquareIcon className="h-6 w-6 text-green-600" />
                    )}
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          practice.type === "speaking"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {practice.type.toUpperCase()}
                      </span>
                      <span className="px-3 py-1 bg-[#f1d49a] text-[#442e14] rounded-full text-xs font-bold">
                        {practice.task.toUpperCase().replace("-", " ")}
                      </span>
                    </div>

                    <p className="text-[#442e14] font-semibold mb-2 line-clamp-2">
                      {practice.question}
                    </p>

                    <p className="text-sm text-[#7f533b]">
                      {new Date(practice.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>

                {/* Band Score */}
                {practice.estimatedBand && (
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm text-[#7f533b] mb-1 font-medium">
                      Band Score
                    </p>
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${
                        practice.estimatedBand >= 7
                          ? "bg-green-100"
                          : practice.estimatedBand >= 6
                          ? "bg-yellow-100"
                          : "bg-orange-100"
                      }`}
                    >
                      <p
                        className={`text-3xl font-black ${
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
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-gradient-to-br from-[#f9f8f6] to-white border-2 border-[#f1d49a] p-12 rounded-2xl shadow-md text-center">
          <div className="w-20 h-20 bg-[#f1d49a]/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-5xl">📭</span>
          </div>
          <h3 className="text-xl font-bold text-[#442e14] mb-2">
            No se encontraron prácticas
          </h3>
          <p className="text-[#7f533b] mb-6">
            Ninguna práctica coincide con tus filtros actuales. Intenta ajustar
            tu búsqueda o comienza una nueva práctica.
          </p>
          <Link
            to="/speaking/task-1"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#f4bc3c] text-[#442e14] rounded-full font-bold hover:bg-amber-500 hover:scale-105 transition shadow-md"
          >
            Inicia tu práctica →
          </Link>
        </div>
      )}

      {/* Paginacion */}
      {data && (data.hasMore || page > 0) && (
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-6 py-3 bg-[#f4bc3c] text-[#442e14] rounded-full font-bold hover:bg-amber-500 hover:scale-105 transition shadow-md disabled:bg-[#f1d49a] disabled:cursor-not-allowed disabled:hover:scale-100 disabled:opacity-60"
          >
            ← Anterior
          </button>
          <div className="px-4 py-2 bg-white border-2 border-[#f1d49a] rounded-full">
            <span className="text-[#442e14] font-bold">Página {page + 1}</span>
          </div>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!data.hasMore}
            className="px-6 py-3 bg-[#f4bc3c] text-[#442e14] rounded-full font-bold hover:bg-amber-500 hover:scale-105 transition shadow-md disabled:bg-[#f1d49a] disabled:cursor-not-allowed disabled:hover:scale-100 disabled:opacity-60"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}
