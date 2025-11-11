import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { AnalyticsAPI } from "@/api/AnalyticsAPI";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p>Loading practice details...</p>
        </div>
      </div>
    );
  }

  if (!practice) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Practice not found.
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
        <ol className="list-decimal list-inside space-y-1">
          {lines.map((line, i) => (
            <li key={i}>{line.replace(/^\d+\.\s/, "")}</li>
          ))}
        </ol>
      ) : (
        <ul className="list-disc list-inside space-y-1">
          {lines.map((line, i) => (
            <li key={i}>{line.replace(/^(\-|\*)\s/, "")}</li>
          ))}
        </ul>
      );
    }

    return <p className="whitespace-pre-line">{content}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/history/analytics"
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Practice Details</h1>
      </div>

      {/* Info Card */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-start justify-between mb-4">
          <div>
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
            <p className="text-sm text-gray-500">
              {new Date(practice.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {/* Band Score */}
          {practice.estimatedBand && (
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Band Score</p>
              <p
                className={`text-4xl font-bold ${
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

        {/* Question */}
        <div className="mb-4">
          <h2 className="font-semibold text-gray-700 mb-2">Question:</h2>
          <p className="text-gray-600 whitespace-pre-line">
            {practice.question}
          </p>
        </div>

        {/* Metadata */}
        {practice.metadata && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            {practice.metadata.toneType && (
              <div>
                <p className="text-sm text-gray-500">Letter Type</p>
                <p className="font-medium text-gray-800 capitalize">
                  {practice.metadata.toneType}
                </p>
              </div>
            )}
            {practice.metadata.taskRelevance && (
              <div>
                <p className="text-sm text-gray-500">Task Relevance</p>
                <p
                  className={`font-medium capitalize ${
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
              <div>
                <p className="text-sm text-gray-500">Recording Duration</p>
                <p className="font-medium text-gray-800">
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

      {/* User Response */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Your Response
        </h2>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="whitespace-pre-line text-gray-700">
            {practice.userResponse}
          </p>
        </div>
      </div>

      {/* Bullet Points Coverage */}
      {practice.bulletPointsCovered &&
        practice.bulletPointsCovered.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Bullet Points Coverage
            </h2>
            <div className="space-y-2">
              {practice.bulletPointsCovered.map((bullet: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <span
                    className={`text-2xl ${
                      bullet.status === "covered"
                        ? "text-green-500"
                        : bullet.status === "partial"
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {bullet.status === "covered"
                      ? "✅"
                      : bullet.status === "partial"
                      ? "⚠️"
                      : "❌"}
                  </span>
                  <p className="text-gray-700">{bullet.point}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* AI Feedback */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">AI Feedback</h2>
        {sections.map((section, idx) => (
          <div key={idx} className="p-6 bg-gray-100 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-3 text-yellow-600">
              {section[0]}
            </h3>
            {renderContent(section.slice(1).join("\n"))}
          </div>
        ))}
      </div>

      {/* Identified Errors */}
      {practice.identifiedErrors && practice.identifiedErrors.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Key Areas for Improvement
          </h2>
          <ul className="space-y-2">
            {practice.identifiedErrors.map((error: string, idx: number) => (
              <li
                key={idx}
                className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200"
              >
                <span className="text-yellow-600 font-bold mt-0.5">
                  {idx + 1}.
                </span>
                <p className="text-gray-700">{error}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
