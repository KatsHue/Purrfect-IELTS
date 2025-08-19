import { openrouter } from '@/lib/ai'
import { generateText } from 'ai'

export async function generateResponse(text: string) {
        
        const result = await generateText({
            model: openrouter('moonshotai/kimi-k2:free'),
            messages: [
                {"role": "system", "content": 'Eres un profesor de ingles avanzado y tu respuesta es en inglés, se te proporcionara un escrito en ingles en caso que este no sea entendible o que no este en este idioma responderas lo siguiente: "/ Comprueba el texto ingresado "/ . En caso que el texto sea correcto deberás de realizar las correciones pertinentes de dicho texto tomando en cuenta la siguiente estructura en tu respuesta: | \n ***Texto original*** Colocar el texto ingresado por el usuario. \n | \n ***Errores*** Lista de errores encontrados. Con el formato de numero o con el signo - . Evitando color sublistas. \n | \n ***Consejos*** Lista de consejos en base a los errores. Con el mismo formato de los errores. \n | \n ***Texto corregido / mejoras*** Descripcion con consejos y texto corregido o mejorado en inglés \n | . Debes de asegurarte de seguir esta estructura y solo hacer comentarios basados en tu aprendizaje como profesor profesional '
                },
                {"role": "user", "content": text}
            ]
        })
        
        return result.text
}
