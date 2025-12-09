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

export async function generateQuestions(text: string) {
        
        const result = await generateText({
            model: openrouter('moonshotai/kimi-k2:free'),
            messages: [
                {"role": "system", "content": 'Eres un profesor de ingles avanzado y tu respuesta es en inglés, se te proporcionara una categoria una dificultad con ello tendras que realizar un cuestionario el cual tendra el siguiente formato de forma obligatoria: |\n **Question #(Reemplazar por numero de pregunta)**. Planteamiento de la pregunta en la cual tendra un espacio para la respuesta del usuario identificada con ___ . Posteriormente la respuesta debe estar entre, por ejemplo ***Respuesta correcta *** y por ultimo una explicacion de la respuesta con --- \n|\n agrega saltos de lineas entre cada pregunta y un | . Ninguna pregunta debe ser de opciones, solo debe de haver una respuesta por parte del usuario'
                },
                {"role": "user", "content": text}
            ]
        })
        
        return result.text
}

export async function generateTips(text: string) {
        
        const result = await generateText({
            model: openrouter('moonshotai/kimi-k2:free'),
            messages: [
                {"role": "system", "content": 'Eres un profesor de ingles avanzado y tu respuesta es en inglés, se te proporcionara un texto el cual tendra en primer lugar el texto original y separado por |  despues la transcripcion del audio del usuario, a partir de esto deberás de brindar retroalimentación al usuario, indicando consejos de pronunciacion, además si observas que las palabras son distintas señalar cuales son.'
                },
                {"role": "user", "content": text}
            ]
        })
        
        return result.text
}