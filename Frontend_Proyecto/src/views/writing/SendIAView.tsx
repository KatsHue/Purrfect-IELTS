import { useForm } from "react-hook-form"
import ErrorMessage from "@/components/ErrorMessage"
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getResponseIA } from "@/api/AIAPI";
import { useEffect, useState } from "react";

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

    const [sections, setSections] = useState<string[][]>([]);

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

    useEffect(() => {
        if(ia.text){
            const formatted = formatResponse(ia.text);
            setSections(formatted);
        }
    }, [ia.text])

    const handleChangePassword = (formData : IAForm) => {
        setIA({...ia, loading: true})
        mutate(formData) 
    }

    const formatResponse = (text: string) => {
        const lines = text.split("\n");

        const sections: [string, string][] = [];
        let currentTitle = "";
        let currentContent: string[] = [];

        for (let line of lines) {
            // Si es fin de bloque ("|")
            if (line.trim() === "|") {
            if (currentTitle || currentContent.length > 0) {
                sections.push([currentTitle, currentContent.join("\n").trim()]);
            }
            currentTitle = "";
            currentContent = [];
            }
            // Si es un título tipo ***Title***
            else if (/^\*{3}(.+)\*{3}$/.test(line.trim())) {
            currentTitle = line.trim().replace(/^\*{3}(.+)\*{3}$/, "$1");
            }
            // Si no, acumular como contenido
            else {
            currentContent.push(line);
            }
        }

        // último bloque (por si no termina con "|")
        if (currentTitle || currentContent.length > 0) {
            sections.push([currentTitle, currentContent.join("\n").trim()]);
        }

        return sections;
    }

    function renderContent(content: string) {
        const lines = content.split("\n").filter(line => line.trim() !== "");

        // Listas con guion o número
        if (lines.every(l => /^(\d+\.\s|\-\s|\*\s)/.test(l.trim()))) {
            const isOrdered = lines.every(l => /^\d+\./.test(l.trim()));
            return isOrdered ? (
            <ol className="list-decimal list-inside space-y-1">
                {lines.map((line, i) => (
                <li key={i}>{line.replace(/^\d+\.\s/, "")}</li>
                ))}
            </ol>
            ) : (
            <ul className="list-disc list-inside space-y-1">
                {lines.map((line, i) => (
                <li key={i}>{line.replace(/^(\-|\*)\s/, "")}</li>
                ))}
            </ul>
            );
        }

        // Texto normal (con saltos de línea)
        return <p className="whitespace-pre-line">{content}</p>;
    }

    return (
        <>
            <div className="mx-auto max-w-3xl">
    
                <h1 className="text-5xl font-black ">Writing</h1>
                <p className="text-2xl font-light text-gray-500 mt-5">Ingresa tu texto para comenza a practicar. </p>
    
                <form
                onSubmit={handleSubmit(handleChangePassword)}
                className=" mt-14 space-y-5 bg-white shadow-lg p-10 rounded-lg mb-5"
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
                    className={`bg-sky-600 w-full p-3 text-white uppercase font-bold hover:bg-sky-700 cursor-pointer transition-colors rounded-md ${ia.loading ? " opacity-10 bg-sky-300" : ""}`}
                    disabled={ia.loading}
                />
                </form>

                {
                    ia.text && (
                        <>
                            <div className="space-y-6">
                                {sections.map((section, idx) => (
                                    <div key={idx} className="p-4 bg-gray-100 rounded-lg shadow">
                                    <h1 className="font-bold text-lg mb-2 text-yellow-600">{section[0]}</h1>
                                    {renderContent(section.slice(1).join("\n"))}
                                    </div>
                                ))}
                            </div>
                        </>
                    )
                }
            </div>

            
        </>
    )
}
