import { useMutation } from "@tanstack/react-query";
import { AnalyticsAPI } from "@/api/AnalyticsAPI";
import { PracticeResultData } from "@/api/AnalyticsAPI";
import { toast } from "react-toastify";

export function useSavePracticeResult() {
  return useMutation({
    mutationFn: (data: PracticeResultData) =>
      AnalyticsAPI.savePracticeResult(data),
    onSuccess: () => {
      console.log("✅ Practice result saved successfully");
    },
    onError: (error) => {
      console.error("❌ Error saving practice result:", error);
    },
  });
}
