import { logger } from '../config/logger'
import { ResponseService } from '../service'
import { defaultMessage } from '../constant/constant'
import { Program } from '../models/program'
import { UserProgram } from '../models/user-program'

class ProgramController {
  constructor () {
    this.responseService = new ResponseService()
  }

  async createProgram (req, res) {
    try {
      logger.info('Creating new program')
      const program = req.body
      if (!program) {
        return this.responseService.validationError(res,
          new Error(defaultMessage.MANDATORY_FIELDS_MISSING))
      }
      // Need to set created by and updated by
      const data = await Program.create(program)
      // TODO : need insert data in user program table and also set created by and updated by
      const userProgram = program
      await UserProgram.create(userProgram)
      logger.info('Created program successfully')
      this.responseService.onSuccess(res, 'Created program successfully', data)
    } catch (error) {
      logger.error(error, 'Error while creating program')
      this.responseService.onError(res, error)
    }
  }

  async updateProgram (req, res) {
    try {
      logger.info('Updating program status')
      const program = req.body

      if (!program) {
        return this.responseService.validationError(res,
          new Error(defaultMessage.MANDATORY_FIELDS_MISSING))
      }
      const programInfo = await Program.findOne({ where: { programId: program.programId } })
      if (!programInfo) {
        return this.responseService.onError(res, defaultMessage.NOT_FOUND)
      }
      // Need set created by and updated by
      await Program.update(Program, { where: { programId: program.programId } })
      logger.info('Program updated successfully')
      this.responseService.onSuccess(res, 'Program updated successfully')
    } catch (error) {
      logger.error(error, 'Error while updating Program')
      this.responseService.onError(res, error)
    }
  }
}

module.exports = ProgramController
