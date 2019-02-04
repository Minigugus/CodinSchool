import bdd from '../bdd'
import Niveau from './NiveauModele'
import { NiveauNonTrouveError, NiveauxNonTrouvesError, NiveauxManquantsError, NiveauExistantError } from './NiveauErreurs'

export const recupererTous = () => Niveau.findAll({ order: [['position', 'ASC']] })
export const recupererParID = async id => {
  const niveau = await Niveau.findByPk(id)
  if (!niveau)
    throw new NiveauNonTrouveError(id)
  return niveau
}

export const creerNiveau = niveau =>
  bdd.transaction(async transaction => {
    const dernierNiveau = await Niveau.max('position', { transaction })
    niveau.position = dernierNiveau + 1 || 0
    try {
      return await Niveau.create(niveau, { transaction })
    }
    catch (err) {
      if (
        err.name === 'SequelizeUniqueConstraintError' &&
        err.errors.length === 1 &&
        err.errors[0].type === 'unique violation' &&
        err.errors[0].path === 'id'
      )
        throw new NiveauExistantError(niveau.id)
      throw err
    }
  })

export const editerNiveau = async (id, niveau) => {
  const affecte = await Niveau.update(niveau, { where: { id } })
  if (!affecte[0])
    throw new NiveauNonTrouveError(id)
  return Niveau.findByPk(niveau.id || id)
}

export const supprimerNiveau = async id => {
  const affecte = await Niveau.destroy({ where: { id } })
  if (!affecte)
    throw new NiveauNonTrouveError(id)
  return id
}

export const reorganiserNiveaux = ids =>
  bdd.transaction(async transaction => {
    const niveaux = (await Niveau.findAll({ attributes: ['id'], transaction })).map(niveau => niveau.id)
    const niveauxSet = new Set(niveaux)
    const nonTrouves = ids.filter(niveau => !niveauxSet.has(niveau))
    if (nonTrouves.length)
      throw new NiveauxNonTrouvesError(nonTrouves, niveaux)
    else if (ids.length < niveauxSet.size)
      throw new NiveauxManquantsError(niveaux)
    return Promise.all(
      ids.map((id, position) => Niveau.update({ position }, { where: { id }, transaction }))
    )
  })

export const recupererExercicesNiveau = niveau => niveau.getExercices({ order: [['position', 'ASC']] })
