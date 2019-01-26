import Profile from './Profile'

export { Profile }

export const recupererParID = id => Profile.findByPk(id)
export const recupererParEmail = email =>
  Profile.findOne({ where: { emailPrimaire: { in: [email.toLowerCase()] } } })
export const recupererParValidation = validation =>
  Profile.findOne({ where: { validationInscription: { in: [validation] } } })
