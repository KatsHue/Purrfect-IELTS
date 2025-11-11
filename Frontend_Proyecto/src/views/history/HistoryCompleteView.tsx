import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnalyticsAPI } from "@/api/AnalyticsAPI";
import { Link } from "react-router-dom";
import {
  MicrophoneIcon,
  PencilSquareIcon,
  ChevronLeftIcon,
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p>Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/history/analytics"
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Practice History</h1>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-md flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={filter.type || "all"}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            <option value="all">All</option>
            <option value="speaking">Speaking</option>
            <option value="writing">Writing</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task
          </label>
          <select
            value={filter.task || "all"}
            onChange={(e) => handleFilterChange("task", e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            <option value="all">All Tasks</option>
            <option value="task-one">Task 1</option>
            <option value="task-two">Task 2</option>
            <option value="task-three">Task 3</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {data && data.practices.length > 0 ? (
        <div className="space-y-4">
          {data.practices.map((practice) => (
            <Link
              key={practice._id}
              to={`/history/history-complete/${practice._id}`}
              className="block bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* Icon */}
                  <div
                    className={`p-3 rounded-lg ${
                      practice.type === "speaking"
                        ? "bg-blue-100"
                        : "bg-green-100"
                    }`}
                  >
                    {practice.type === "speaking" ? (
                      <MicrophoneIcon
                        className={`h-6 w-6 ${
                          practice.type === "speaking"
                            ? "text-blue-600"
                            : "text-green-600"
                        }`}
                      />
                    ) : (
                      <PencilSquareIcon className="h-6 w-6 text-green-600" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          practice.type === "speaking"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {practice.type.toUpperCase()}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                        {practice.task.toUpperCase().replace("-", " ")}
                      </span>
                    </div>

                    <p className="text-gray-700 font-medium mb-2 line-clamp-2">
                      {practice.question}
                    </p>

                    <p className="text-sm text-gray-500">
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
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Band Score</p>
                    <p
                      className={`text-3xl font-bold ${
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
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-xl shadow-md text-center">
          <p className="text-gray-500">
            No practices found with these filters.
          </p>
        </div>
      )}

      {/* Pagination */}
      {data && (data.hasMore || page > 0) && (
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700">Page {page + 1}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!data.hasMore}
            className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
