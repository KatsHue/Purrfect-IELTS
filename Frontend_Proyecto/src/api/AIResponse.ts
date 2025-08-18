import { openrouter } from '@/lib/ai'
import { generateText } from 'ai'

export async function generateResponse(text: string) {
        
        const result = await generateText({
            model: openrouter('openai/gpt-oss-20b:free'),
            messages: [
                {"role": "system", "content": 'Eres un profesor de Ingles avanzado, el texto que    recibas solo lo revisaras y le haras las correciones pertinentes, es obligatorio que tu respuesta contenga encabezados (#), listas de errores y separaciones para que sea mas entendible' + 
                    "Siempre responde en formato Markdown. Usa títulos (#), listas con viñetas, numeraciones, bloques de código con \
                    y separa las secciones con líneas horizontales (---). \
                    Si explicas errores, ponlos en una lista con viñetas" +
                    'Debes de brindar retroalimentacion al usuario por medio de explicacion de los errores' +
                    'Al final debes de dar un ejemplo de texto corregido en inglés'
                },
                {"role": "user", "content": text}
            ]
        })
        
        return result.text
}
