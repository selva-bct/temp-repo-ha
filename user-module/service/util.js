
export function setCreatedByUser(object, user) {
  const { raw: { userId } } = user
    return {
      ...object,
      createdBy: userId,
      updatedBy: userId
    }
  }
  
  export function setUpdatedByUser(object, user) {
      const { raw: { userId } } = user
    return {
      ...object,
      updatedBy: userId
    }
  }