import _Profile from './Profile'

export const Profile = _Profile

export const recupererParID = id => Profile.findByPk(id)
export const recupererParEmail = email =>
  Profile.findOne({ where: { emailPrimaire: { in: [email] } } })
export const recupererParValidation = validation =>
  Profile.findOne({ where: { validationInscription: { in: [validation] } } })
