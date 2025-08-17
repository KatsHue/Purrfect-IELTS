import ProjectForm from "@/components/projects/ProjectForm"
import { useForm } from "react-hook-form"
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from "react-router-dom"
import type { ProjectFormData } from "@/types/index"
import { createProject } from "@/api/ProjectAPI"
import { toast } from "react-toastify"

export default function CreateProjectView() {

    const navigate = useNavigate()
    const initialValues : ProjectFormData = {
        projectName: "",
        clientName: "",
        description: ""
    }

    const {register, handleSubmit, formState: {errors}} = useForm({defaultValues: initialValues})
    const {mutate} = useMutation({
        mutationFn: createProject,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (response) => {
            toast.success(response)
            navigate('/')
        }
    })

    const handleForm = (data : ProjectFormData) => mutate(data)

    return (
        <>
            <div className="max-x-3xl mx-auto">
                <h1 className="text-5xl font-black">Crear Proyecto</h1>
                <p className="text-2xl font-light text-gray-500 mt-5">Llena el siguiente formulario para crear un nuevo Proyecto </p>

                <nav className="py-5">
                    <Link
                        className="bg-orange-400 hover:bg-amber-600 px-10 py-3 text-white text-xl font-bold cursors-pointer transition-colors"
                        to='/'
                    >
                        Volver a proyectos
                    </Link>
                </nav>

                <form 
                    className="mt-10 bg-white shadow-lg p-10 rounded-lg"
                    onSubmit={handleSubmit(handleForm)}
                    noValidate
                >
                    <ProjectForm 
                        register={register}
                        errors={errors}
                    />
                    <input 
                        type="submit" 
                        value='Crear Proyecto' 
                        className=" bg-amber-500 hover:bg-amber-600 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors"
                    />
                </form>
            </div>
        </>
    )
}
