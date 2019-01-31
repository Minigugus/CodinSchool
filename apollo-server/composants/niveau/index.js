import bdd from '../bdd'
import Niveau from './Niveau'
import { NiveauNonTrouveError, NiveauxNonTrouvesError, NiveauxManquantsError } from './erreurs'

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
    return Niveau.create(niveau, { transaction })
  })

export const editerNiveau = async (id, niveau) => {
  const affecte = await Niveau.update(niveau, { where: { id } })
  if (!affecte)
    throw new NiveauNonTrouveError(id)
  return Niveau.findByPk(id)
}

export const supprimerNiveau = async id => {
  const affecte = await Niveau.destroy({ where: { id } })
  if (!affecte)
    throw new NiveauNonTrouveError(id)
  return id
}

export const reorganiserNiveaux = ids =>
  bdd.transaction(async transaction => {
    const niveaux = new Set((await Niveau.findAll({ attributes: [ 'id' ] })).map(niveau => niveau.id))
    const nonTrouves = ids.filter(niveau => !niveaux.has(niveau))
    if (nonTrouves)
      throw new NiveauxNonTrouvesError(nonTrouves, niveaux)
    else if (ids.length < niveaux.size)
      throw new NiveauxManquantsError(niveaux)
    return Promise.all(
      ids.map((id, position) => Niveau.update({ position }, { where: { id }, transaction }))
    )
  })

export const recupererExercicesNiveau = niveau => niveau.getExercices({ order: [['position', 'ASC']] })
