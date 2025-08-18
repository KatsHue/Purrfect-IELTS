
import type { IAForm } from "@/views/profile/SendIAView";
import { isAxiosError } from "axios";
import { generateResponse } from "./AIResponse";


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