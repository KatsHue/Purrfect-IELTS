import type {Request} from 'express'
import User from '../models/User'
import Project from '../models/Project'

export class TeamMemberController {
    static findMemberByEmail = async (req : Request, res) => {
        const {email} = req.body
        // Find user
        const user = await User.findOne({email}).select('name email')

        if(!user){
            const error = new Error('Usuario no encontrado')
            return res.status(404).json({error: error.message})
        }

        res.json(user)
    }

    static getProjectTeam = async (req : Request, res) => {
        const project = await Project.findById(req.project.id).populate({
            path: 'team',
            select: 'id email name'
        })

        res.json(project.team)
    }

    static addMemberByEmail = async (req : Request, res) => {
        const {_id} = req.body
        // Find user
        const user = await User.findById({_id}).select('id')
        if(!user){
            const error = new Error('Usuario no encontrado')
            return res.status(404).json({error: error.message})
        }

        if(req.project.team.some(team => team.toString() === user.id.toString())){
            const error = new Error('El usuario ya existe en el proyecto')
            return res.status(409).json({error: error.message})
        }

        req.project.team.push(user.id)
        await req.project.save()

        res.send('Usuario agregado correctamente')
    }

    static removeMemberByEmail = async (req : Request, res) => {
        const { userId } = req.params

        if(!req.project.team.some(team => team.toString() === userId)){
            const error = new Error('El usuario no existe en el proyecto')
            return res.status(409).json({error: error.message})
        }

        req.project.team = req.project.team.filter(teamMember => teamMember.toString() !== userId)
        await req.project.save()
        res.send('Usuario eliminado correctamente')
    }
}