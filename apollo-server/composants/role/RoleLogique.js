import { Role, RoleNonTrouveError } from '.'

export const recupererTous = () => Role.findAll({ order: [['id', 'ASC']] })
export const recupererParID = id => {
  const role = Role.findByPk(id)
  if (!role)
    throw new RoleNonTrouveError(id)
  return role
}

export const creerRole = async role => {
  try {
    return await Role.create(role)
  }
  catch (err) {
    // TODO
    throw err
  }
}

export const editerRole = async (id, role) => {
  const affecte = await Role.update(role, { where: { id } })
  if (!affecte[0])
    throw new RoleNonTrouveError(id)
  return Role.findByPk(role.id || id)
}

export const supprimerRole = async id => {
  const affecte = await Role.destroy({ where: { id } })
  if (!affecte)
    throw new RoleNonTrouveError(id)
  return id
}

export const ajouterMembre = async (roleId, membreId) => {
  const role = await recupererParID(roleId)
  await role.addMembre(membreId)
  return role
}

export const supprimerMembre = async (roleId, membreId) => {
  const role = await recupererParID(roleId)
  await role.removeMembre(membreId)
  return role
}
