
import type { IAForm } from "@/views/writing/SendIAView";
import { isAxiosError } from "axios";
import { generateQuestions, generateResponse } from "./AIResponse";

export async function getResponseIA({text} : IAForm) {
    try {
        const data = await generateResponse(text)
        
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function getQuestionIA(text : string) {
    try {
        const data = await generateQuestions(text)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}