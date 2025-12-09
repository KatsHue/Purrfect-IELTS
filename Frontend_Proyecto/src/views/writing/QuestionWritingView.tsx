import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getQuestionIA } from "@/api/AIAPI";
import { useEffect, useState } from "react";
import { categoryTranslations, difficultyTranslations} from "@/locales/es";
import AiQuiz from "./AiQuiz";

export type QuestionForm = {
    prompt: string
}

export default function QuestionWritingView() {

    const [configuration, setConfiguration] = useState({
        difficulty: '',
        category: '', 
        reset: false
    })
    
    const [ia, setIA] = useState({
        text: '',
        response: false,
        loading: false, 
    })

    useEffect(() => {
        if(ia.text){
            setIA({
                ...ia,
                loading: false
            })
        }
    }, [ia.text])

    const {mutate} = useMutation({
        mutationFn: getQuestionIA,
        onError: (error) => toast.error(error.message),
        onSuccess: (data) => {
            setIA({
                ...ia, 
                text: data!,
                response: true, 
                loading: false})
        }
    })

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setConfiguration({
            ...configuration,
            [e.target.name]: e.target.value
        })
        
        if(e.target.name === 'difficulty'){
            const prompt = 'Difficulty: ' + e.target.value + ', category: ' + configuration.category
            mutate(prompt)
            setConfiguration({
                ...configuration,
                reset: false
            })
            setIA({
                ...ia,
                loading: true
            })
            console.log(ia.text)
        }
    }

    const handleReset = () => {
        setIA({
            ...ia,
            text: ''
        })

        setConfiguration({
            ...configuration,
            difficulty: '',
            category: '', 
            reset: true
        })

        console.log('Reseteando...')
    }

    return (
        <>
            <div className="mx-auto max-w-3xl">
                <h1 className="text-5xl font-black text-center">¡Question!</h1>
                <p className="text-2xl font-light text-gray-500 mt-5">Realiza tu cuestionario a tu gusto</p>
    
                {
                    !configuration.category && (<p className="text-2xl font-light text-gray-500 mt-5">Selecciona una categoria</p>)
                }

                {
                    configuration.category && !configuration.difficulty && !ia.text && (<p className="text-2xl font-light text-gray-500 mt-5">Selecciona una dificultad</p>)
                }

                {
                    !ia.loading && !ia.text ? (
                        <div
                            className=" mt-6 space-y-5 bg-white shadow-lg p-10 rounded-lg mb-5"
                        >

                            <div className='my-5 space-y-3'>
                                <label className='font-bold'>Category:</label>

                                <select
                                    className='w-full p-3 bg-white border border-gray-300'
                                    defaultValue='Default'
                                    name="category"
                                    onChange={handleChange}
                                >
                                    {Object.entries(categoryTranslations).map(([key, value]) => (
                                        <option key={key} value={key}>{value}</option>
                                    ))}
                                </select>
                            </div>

                            {
                                configuration.category && (
                                    <div className='my-5 space-y-3'>
                                        <label className='font-bold'>Difficulty:</label>

                                        <select
                                            className='w-full p-3 bg-white border border-gray-300'
                                            defaultValue='Default'
                                            name="difficulty"
                                            onChange={handleChange}
                                        >
                                            {Object.entries(difficultyTranslations).map(([key, value]) => (
                                                <option key={key} value={key}>{value}</option>
                                            ))}
                                        </select>
                                    </div>
                                )
                            }
                            
                        </div>
                    ) : ia.loading && (
                        // Estados de carga y error(
                        <div className="max-w-3xl mx-auto p-6">
                            <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500 mx-auto mb-4"></div>
                            <p>Loading questions...</p>
                            </div>
                        </div>
                    )
                }
                
            </div>

            <AiQuiz response={ia.text} reset={configuration.reset} handleReset={handleReset} />
        </>
    )
}
