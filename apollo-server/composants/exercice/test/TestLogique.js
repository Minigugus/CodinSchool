import Sequelize from 'sequelize'
import bdd from '../../bdd'
import Test from './TestModele'
import { TestNonTrouveError } from './TestErreurs'

export const recupererParID = async id => {
  const test = await Test.findByPk(id)
  if (!test) throw new TestNonTrouveError(id)
  return test
}

export const creerTest = async (exercice, test) =>
  bdd.transaction(async transaction => {
    const dernierePosition = await Test.max('position', {
      where: { exerciceId: exercice },
      transaction
    })
    test.position = dernierePosition + 1 || 0
    return Test.create({ exerciceId: exercice, ...test }, { transaction })
  })

export const editerTest = async (id, test) => {
  const affecte = await Test.update(test, { where: { id }, returning: true })
  if (!affecte[0]) throw new TestNonTrouveError(id)
  return affecte[1][0]
}

export const reorganiserTests = async (exercice, tests) => {
  await bdd.transaction(async transaction =>
    Promise.all(
      tests.map((id, position) => Test.update({ exerciceId: exercice, position }, { where: { id }, transaction }))
    )
  )
  return await Test.findAll({
    where: {
      id: { [Sequelize.Op.in]: tests }
    },
    order: [['position', 'ASC']]
  })
}

export const supprimerTest = async id => {
  const affecte = await Test.destroy({ where: { id } })
  if (!affecte) throw new TestNonTrouveError(id)
  return id
}
