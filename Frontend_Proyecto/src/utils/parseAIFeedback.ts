export interface ParsedFeedback {
  estimatedBand: number | null;
  identifiedErrors: string[];
  bulletPointsCovered?: {
    point: string;
    status: "covered" | "partial" | "not-covered";
  }[];
  metadata?: {
    toneType?: "formal" | "informal" | "semi-formal";
    taskRelevance?: "adequate" | "partial" | "not-relevant";
  };
}

export function parseAIFeedback(feedback: string): ParsedFeedback {
  const result: ParsedFeedback = {
    estimatedBand: null,
    identifiedErrors: [],
    bulletPointsCovered: [],
    metadata: {},
  };

  // Extraer banda estimada
  const bandMatch = feedback.match(/Band\s*(\d+\.?\d*)/i);
  if (bandMatch) {
    result.estimatedBand = parseFloat(bandMatch[1]);
  }

  // Extraer errores identificados
  const errorsSection = feedback.match(
    /\*\*\*Identified Errors\*\*\*([\s\S]*?)(?=\*\*\*|$)/i
  );
  if (errorsSection) {
    const errorLines = errorsSection[1]
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && /^[\d\-\*]/.test(line))
      .map((line) => line.replace(/^[\d\-\*\.]+\s*/, "").trim());
    result.identifiedErrors = errorLines;
  }

  // Extraer cobertura de bullet points (para Speaking Task 2/3 y Writing)
  const bulletSection = feedback.match(
    /\*\*\*Bullet Point Coverage\*\*\*([\s\S]*?)(?=\*\*\*|$)/i
  );
  if (bulletSection) {
    const bulletLines = bulletSection[1].split("\n");
    bulletLines.forEach((line) => {
      if (line.includes("→")) {
        const parts = line.split("→");
        const point = parts[0].replace(/^\d+\.\s*/, "").trim();
        const statusSymbol = parts[1]?.trim();

        let status: "covered" | "partial" | "not-covered" = "not-covered";
        if (statusSymbol?.includes("✅")) status = "covered";
        else if (statusSymbol?.includes("⚠️")) status = "partial";

        result.bulletPointsCovered?.push({ point, status });
      }
    });
  }

  // Extraer tipo de carta (Writing Task 1)
  const letterTypeMatch = feedback.match(
    /\*\*\*Letter Type\*\*\*[\s\S]*?(Formal|Informal|Semi-formal)/i
  );
  if (letterTypeMatch) {
    result.metadata!.toneType = letterTypeMatch[1].toLowerCase() as
      | "formal"
      | "informal"
      | "semi-formal";
  }

  // Extraer relevancia de la tarea
  const relevanceSection = feedback.match(
    /\*\*\*(Task Response|Answer Relevance)\*\*\*([\s\S]*?)(?=\*\*\*|$)/i
  );
  if (relevanceSection) {
    const content = relevanceSection[2];
    if (content.includes("✅")) result.metadata!.taskRelevance = "adequate";
    else if (content.includes("⚠️")) result.metadata!.taskRelevance = "partial";
    else if (content.includes("❌"))
      result.metadata!.taskRelevance = "not-relevant";
  }

  console.log("📊 Parsed Feedback Result:", {
    estimatedBand: result.estimatedBand,
    errorsCount: result.identifiedErrors.length,
    errors: result.identifiedErrors,
    bulletPointsCount: result.bulletPointsCovered?.length || 0,
    metadata: result.metadata,
  });

  return result;
}
