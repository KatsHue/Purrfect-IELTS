import { useForm } from "react-hook-form"
import ErrorMessage from "@/components/ErrorMessage"
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getResponseIA } from "@/api/AIAPI";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export type IAForm = {
    text: string
}

export default function SendIAView() {
    const initialValues : IAForm = {
        text: '',
    }

    const [ia, setIA] = useState({
        text: '',
        response: false,
        loading: false
    })

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

    const {mutate} = useMutation({
        mutationFn: getResponseIA,
        onError: (error) => toast.error(error.message),
        onSuccess: (data) => {
            setIA({
                ...ia, 
                text: data!,
                response: true, 
                loading: false})

            console.log(data)
        }

    })
    const handleChangePassword = (formData : IAForm) => {
        setIA({...ia, loading: true})
        mutate(formData) 
    }

    return (
        <>
            <div className="mx-auto max-w-3xl">
    
                <h1 className="text-5xl font-black ">Writing</h1>
                <p className="text-2xl font-light text-gray-500 mt-5">Ingresa tu texto para comenza a practicar. </p>
    
                <form
                onSubmit={handleSubmit(handleChangePassword)}
                className=" mt-14 space-y-5 bg-white shadow-lg p-10 rounded-lg"
                noValidate
                >
                <div className="mb-5 space-y-3">
                    <label
                    className="text-sm uppercase font-bold"
                    htmlFor="current_password"
                    >Texto: </label>
                    <input
                    id="text"
                    type="text"
                    placeholder="Escribe algo..."
                    className="w-full p-3  border border-gray-200"
                    {...register("text", {
                        required: "El texto es obligatorio",
                    })}
                    />
                    {errors.text && (
                    <ErrorMessage>{errors.text.message}</ErrorMessage>
                    )}
                </div>
    
                <input
                    type="submit"
                    value='Consultar con IA'
                    className={`bg-blue-600 w-full p-3 text-white uppercase font-bold hover:bg-blue-700 cursor-pointer transition-colors ${ia.loading ? " opacity-10 bg-blue-300" : ""}`}
                    disabled={ia.loading}
                />
                </form>

                {
                    ia.text && (
                        <>
                            <h1 className="text-xl font-black ">Respuesta: </h1>
                            <div className="prose prose-slate max-w-full p-5 bg-gray-50 rounded-lg shadow-sm">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {ia.text}
                                </ReactMarkdown>
                            </div>
                        </>
                    )
                }
            </div>

            
        </>
    )
}
