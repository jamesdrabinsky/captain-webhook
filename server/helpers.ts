import { v4 as uuidv4 } from 'uuid'

function createNewBinId(): String {
  const uuidTest = uuidv4()
  return uuidTest.split('-').join('').slice(0, 13)
}

export default createNewBinId
