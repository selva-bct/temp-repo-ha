import ProgramController from '../controller/program-controller'
import { validateToken } from '../service/authentication-service'
import express from 'express'

const programRouter = express.Router()
const programController = new ProgramController()

programRouter
  .post('/', validateToken, programController.createProgram.bind(programController))

module.exports = programRouter
