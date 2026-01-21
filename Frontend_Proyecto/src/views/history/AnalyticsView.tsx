import { useQuery } from "@tanstack/react-query";
import { AnalyticsAPI } from "@/api/AnalyticsAPI";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ChartBarIcon,
  ChartBarSquareIcon,
  FireIcon,
  TrophyIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import {
  DocumentTextIcon,
  PresentationChartLineIcon,
  RocketLaunchIcon,
} from "@heroicons/react/20/solid";

export default function AnalyticsView() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["userStats"],
    queryFn: AnalyticsAPI.getUserStats,
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f4bc3c] mx-auto mb-4"></div>
          <p className="text-lg font-medium text-[#7f533b]">
            Loading your statistics...
          </p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-amber-100 border border-amber-400 text-amber-800 px-4 py-3 rounded">
          No statistics available yet. Start practicing!
        </div>
      </div>
    );
  }

  // Preparar datos para gráficos
  const taskData = stats.byTypeAndTask.map((item) => ({
    name: `${item._id.type} ${item._id.task}`,
    band: parseFloat(item.avgBand.toFixed(1)),
    practices: item.count,
  }));

  const progressData = stats.recentProgress.map((item) => ({
    date: new Date(item._id).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    band: parseFloat(item.avgBand.toFixed(1)),
    count: item.count,
  }));

  const COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#ec4899", "#8b5cf6"];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="text-[#442e14] flex justify-between items-center">
          <ChartBarSquareIcon className="w-12 h-12 mr-1.5"></ChartBarSquareIcon>
          <h1 className="text-3xl font-bold text-[#442e14]">
            Tu Progreso IELTS
          </h1>
        </div>
        <Link
          to="/history/history-complete"
          className="px-4 py-2 bg-[#f4bc3c] text-[#442e14] rounded-lg hover:bg-amber-500 transition font-bold"
        >
          Ver Historial
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Practices */}
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl shadow-lg p-6 text-white hover:scale-105 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium">
                Total de Prácticas
              </p>
              <p className="text-3xl font-bold mt-2">{stats.totalPractices}</p>
            </div>
            <ChartBarIcon className="h-12 w-12 text-amber-200" />
          </div>
        </div>

        {/* Average Band */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white hover:scale-105 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">
                Band Promedio
              </p>
              <p className="text-3xl font-bold mt-2">
                {stats.averageBand ? stats.averageBand.toFixed(1) : "N/A"}
              </p>
            </div>
            <TrophyIcon className="h-12 w-12 text-emerald-200" />
          </div>
        </div>

        {/* Current Streak */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white hover:scale-105 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Racha</p>
              <p className="text-3xl font-bold mt-2">
                {stats.currentStreak} días
              </p>
            </div>
            <FireIcon className="h-12 w-12 text-orange-200" />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white hover:scale-105 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">
                Últimos 30 Días
              </p>
              <p className="text-3xl font-bold mt-2">
                {stats.recentProgress.reduce((sum, day) => sum + day.count, 0)}{" "}
                minutos
              </p>
            </div>
            <ClockIcon className="h-12 w-12 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Over Time */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-[#f1d49a]">
          <div className="text-[#442e14] flex items-center justify-center mb-3">
            <PresentationChartLineIcon className="w-6 h-6 mr-1.5"></PresentationChartLineIcon>
            <h2 className="text-xl font-bold text-[#442e14]">
              Progreso (Últimos 30 Días)
            </h2>
          </div>
          {progressData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 9]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="band"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Promedio de Band"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-[#7f533b] text-center py-12">
              No hay datos de los últimos 30 días. ¡Sigue practicando!
            </p>
          )}
        </div>

        {/* Performance by Task */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-[#f1d49a]">
          <div className="text-[#442e14] flex items-center justify-center mb-3">
            <RocketLaunchIcon className="w-6 h-6 mr-1.5"></RocketLaunchIcon>
            <h2 className="text-xl font-bold text-[#442e14]">
              Desempeño por tarea
            </h2>
          </div>

          {taskData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taskData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 9]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="band" fill="#10b981" name="Promedio de Band" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-[#7f533b] text-center py-12">
              Aún no hay datos de tareas. ¡Comienza a practicar!
            </p>
          )}
        </div>
      </div>

      {/* Practice Distribution */}
      {taskData.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-[#f1d49a]">
          <div className="text-[#442e14] flex items-center justify-center mb-3">
            <DocumentTextIcon className="w-6 h-6 mr-1.5"></DocumentTextIcon>
            <h2 className="text-xl font-bold text-[#442e14]">
              Resumen de práctica
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={taskData}
                dataKey="practices"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {taskData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Motivational Card */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-2 text-center">
          ¡Tú puedes, sigue así! 💪
        </h2>
        <p className="text-amber-50 mb-4">
          Has completado {stats.totalPractices} práctica
          {stats.totalPractices !== 1 ? "s" : ""}.
          {stats.averageBand && stats.averageBand < 7
            ? " ¡Estás progresando  hacia mejores niveles!"
            : stats.averageBand && stats.averageBand >= 7
            ? " ¡Tu desempeño es de alto nivel!"
            : " ¡Sigue practicando para ver tu mejora!"}
        </p>
        {stats.currentStreak > 0 && (
          <p className="text-amber-50 flex items-center">
            <FireIcon className="w-5 h-5 mr-1.5"></FireIcon>
            ¡Llevas una racha de {stats.currentStreak} días! ¡No te detengas!
          </p>
        )}
      </div>
    </div>
  );
}
