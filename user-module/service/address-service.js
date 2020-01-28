import { pick } from 'lodash'

import connection from '../config/db-conection'
import { logger } from '../config/logger'
import { Address } from '../models/address'

export class AddressService {
    constructor() { }
    getAllAddressForUserId(userId) {
        return new Promise(async (resolve, reject) => {
            try {
                logger.info('Into fetching all address of a particular user')
                let address
                // hit the redis layer
                //  if not found 
                // check the postgres db
                if (!address) {
                    address = await Address.findAll({
                        where: {
                            userId: userId
                        }
                    })
                }
                resolve(address)
                logger.info('Successfully fetched all the address for a particular user')
            } catch (error) {
                logger.error('Error while fetching the address for a particular user', error)
                reject(error)
            }
        })
    }

    getAddressById(addressId) {
        return new Promise(async (resolve, reject) => {
            try {
                logger.info('Into fetching address by Id ')
                let address
                // hit the redis layer
                //  if not found 
                // check the postgres db
                if (!address) {
                    address = await Address.findById(addressId)
                }
                if (!address) {
                    throw new Error('ADDRESS_NOT_FOUND')
                }
                resolve(address)
                logger.info('Successfully fetched address from db')
            } catch (error) {
                logger.error('Error while fetching the address', error)
                reject(error)
            }
        })
    }

    createAddress(address) {
        return new Promise(async (resolve, reject) => {
            try {
                logger.info('Into creating address')
                // validate the incoming address field
                const addressData = collectNeededAddressInfo(address)
                const newAddress = await Address.create(addressData)
                resolve(newAddress)
                logger.info('Successfully created address')
            } catch (error) {
                logger.error('Error while creating address', error)
                reject(error)
            }
        })        
    }

    updateAddress(address) {
        return new Promise(async (resolve, reject) => {
            try {
                logger.info('Into updating address')
                const reqObjAddress = collectNeededAddressInfo(address)
                const updatedAddress = await Address.update(
                    reqObjAddress,
                    {
                        id: address.id
                    })
                resolve({
                    updatedAddress
                })
                logger.info('Successfully updated address')
            } catch (error) {
                logger.error('Error while updating address', error)
                reject(error)
            }
        })        
    }

    deleteAddress(addressId) {
        return new Promise(async (resolve, reject) => {
            try {
                logger.info('Into deleting address')
                const address = await Address.findById(addressId)
                if (!address) {
                    throw new Error('ADDRESS_NOT_FOUND')
                }
                await Address.destroy({
                    where: {
                        id: addressId
                    }
                })
                logger.info('Successfully deleted address')
                resolve()
            } catch (error) {
                logger.error('Error while deleting address', error)
                reject(error)
            }
        })
    } 
}

function collectNeededAddressInfo(address) {
    const addressFields = [
        'addressLine1',
        'addressLine2',
        'addressLine3',
        'city',
        'state',
        'zipCode',
        'country'
      ];
    const reqObjAddress = pick(address, addressFields)
    for (const key in reqObjAddress) {
        if (reqObjAddress.hasOwnProperty(key)) {
            const element = reqObjAddress[key];
            if (!element) {
                delete reqObjAddress[key]
            }
        }
    }
    if (!reqObjAddress.addressNickname) {
        reqObjAddress.address_nickname = 'home'
    }
    return reqObjAddress
}
