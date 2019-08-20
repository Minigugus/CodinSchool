import bdd from '../../../bdd'
import ResultatTest from './ResultatTestModele'

export const creerResultatTest = (soumission, resultatTest, transactionParente) => Array.isArray(resultatTest)
  ? (transactionParente
    ? cb => cb(transactionParente)
    : bdd.transaction.bind(bdd)
  )(async transaction => ResultatTest.bulkCreate(resultatTest.map(test => {
    test.soumissionId = soumission.id
    return test
  }), { transaction }))
  : ResultatTest.create({ soumissionId: soumission, ...resultatTest })
