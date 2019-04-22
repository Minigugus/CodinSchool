import Test from './TestModele'
import { TestNonTrouveError } from './TestErreurs'

export const recupererParID = async id => {
  const test = await Test.findByPk(id)
  if (!test) throw new TestNonTrouveError(id)
  return test
}

export const creerTest = async (exercice, test) => Test.create({ exerciceId: exercice, ...test })

export const editerTest = async (id, modifications) => {
  const affecte = await Test.update(modifications, { where: { id }, returning: true })
  if (!affecte[0]) throw new TestNonTrouveError(id)
  return affecte[1][0]
}

export const supprimerTest = async id => {
  const affecte = await Test.destroy({ where: { id } })
  if (!affecte) throw new TestNonTrouveError(id)
  return id
}
