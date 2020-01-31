import crypto from 'crypto'
import { secret, algorithm } from 'config'

let instance
export class CryptoService {
  constructor() {
    if (instance) {
      return instance
    }
    instance = this
  }

  encrypt(data) {
    const cipher = crypto.createCipher(algorithm, secret)
    data = JSON.stringify(data)
    return cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
  }

  decrypt(data) {
    const decipher = crypto.createDecipher(algorithm, secret)
    const decryptedData = decipher.update(data, 'hex', 'utf8') + decipher.final('utf8')
    return JSON.parse(decryptedData)
  }
}