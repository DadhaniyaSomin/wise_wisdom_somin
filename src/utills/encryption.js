import bcrypt from 'bcryptjs'

export const encryptPassword = async password => {
  const encryptedPassword = await bcrypt.hash(password, 8)
  return encryptedPassword
}

export const isPasswordMatch = async (password, userPassword) => {
  return bcrypt.compare(password, userPassword)
}
