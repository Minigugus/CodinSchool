import Sequelize from 'sequelize'
import Exercice from './ExerciceModele'
import bdd from '../bdd'
import { ExerciceNonTrouveError } from './ExerciceErreurs'

export const recupererParID = async id => {
  const exercice = await Exercice.findByPk(id)
  if (!exercice) throw new ExerciceNonTrouveError(id)
  return exercice
}

export const creerExercice = (niveau, exercice) =>
  bdd.transaction(async transaction => {
    const dernierePosition = await Exercice.max('position', {
      where: { niveauId: niveau },
      transaction
    })
    exercice.position = dernierePosition + 1 || 0
    return Exercice.create({ niveauId: niveau, ...exercice }, { transaction })
  })

export const editerExercice = async (id, exercice) => {
  const affecte = await Exercice.update(exercice, { where: { id } })
  if (!affecte[0]) throw new ExerciceNonTrouveError(id)
  return await Exercice.findByPk(id)
}

export const reorganiserExercices = async (niveau, exercices) => {
  await bdd.transaction(async transaction =>
    Promise.all(
      exercices.map((id, position) => Exercice.update({ niveauId: niveau, position }, { where: { id }, transaction }))
    )
  )
  // await Exercice.update(exercices.map((id, position) => ({ id, position })), { where: { } });
  return await Exercice.findAll({
    where: {
      id: { [Sequelize.Op.in]: exercices }
    },
    order: [['position', 'ASC']]
  })
}

export const supprimerExercice = async id => {
  const affecte = await Exercice.destroy({ where: { id } })
  if (!affecte) throw new ExerciceNonTrouveError(id)
  return id
}

export const recupererTestsExercice = exercice => exercice.getTests({ order: [['position', 'ASC']] })
