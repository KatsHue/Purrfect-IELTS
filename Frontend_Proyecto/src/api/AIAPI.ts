//AIAPI.ts
import type { IAForm } from "@/views/writing/SendIAView";
import { isAxiosError } from "axios";
import {
  generateQuestions,
  generateResponse,
  generateSpeakingFeedback,
  generateSpeakingTaskTwoFeedback,
  generateTaskThreeQuestions,
  generateSpeakingTaskThreeFeedback,
  generateWritingTaskTwoFeedback,
} from "./AIResponse";

export async function getResponseIA({ text }: IAForm, question?: string) {
  try {
    const data = await generateResponse(text, question);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function getQuestionIA(text: string) {
  try {
    const data = await generateQuestions(text);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function getSpeakingFeedback(text: string, question?: string) {
  try {
    const data = await generateSpeakingFeedback(text, question);
    return data ?? " ";
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function getSpeakingTaskTwoFeedback(
  text: string,
  question?: string
) {
  try {
    const data = await generateSpeakingTaskTwoFeedback(text, question);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function getTaskThreeQuestions(
  cueCard: string,
  studentResponse: string
) {
  try {
    const data = await generateTaskThreeQuestions(cueCard, studentResponse);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function getSpeakingTaskThreeFeedback(
  text: string,
  question: string,
  originalCueCard: string
) {
  try {
    const data = await generateSpeakingTaskThreeFeedback(
      text,
      question,
      originalCueCard
    );
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function getWritingTaskTwoFeedback(
  text: string,
  question?: string
) {
  try {
    const data = await generateWritingTaskTwoFeedback(text, question);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
