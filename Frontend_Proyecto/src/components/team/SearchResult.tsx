import { addUserToProject } from "@/api/TeamAPI"
import type { TeamMember } from "@/types/index"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"

type SearchResultProps = {
    user: TeamMember
    reset: () => void
}

export default function SearchResult({user, reset} : SearchResultProps) {

    const params = useParams()
    const projectId = params.projectId!
    const queryClient = useQueryClient()

    const {mutate} = useMutation({
        mutationFn: addUserToProject,
        onError: (error) => {
            console.log(error)
            console.log(error.message)
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            reset()
            queryClient.invalidateQueries({queryKey: ['projectTeam', projectId]})
        }
    })

    const handleAdduserToProject = () => {
        const data = {
            projectId,
            _id: user._id
        }
        mutate(data)
    }

    return (
        <>
        
            <p className="mt-10 text-center font-bold">Resultado:</p>
            <div className="flex justify-between items-center">
                <p>{user.name}</p>
                <button className="text-orange-600 px-10 py-3 font-bold cursor-pointer hover:bg-orange-300 hover:text-white transition-colors"
                    onClick={handleAdduserToProject}
                >
                    Agregar al proyecto
                </button>
            </div>
        </>
    )
}
