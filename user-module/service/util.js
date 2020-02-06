
export function setCreatedBy (object, user) {
  const { raw: { userId } } = user
  return {
    ...object,
    createdBy: userId,
    updatedBy: userId
  }
}

export function setUpdatedBy (object, user) {
  const { raw: { userId } } = user
  return {
    ...object,
    updatedBy: userId
  }
}
