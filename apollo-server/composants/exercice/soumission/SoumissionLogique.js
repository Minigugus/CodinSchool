import Soumission from './SoumissionModele'
import { SoumissionNonTrouveError } from './SoumissionErreurs'

import evaluer from '../../evaluation'
import { creerResultatTest } from './test/ResultatTestLogique'

export const recupererTous = utilisateur => Soumission.findAll({
  where: {
    utilisateurId: utilisateur.id
  },
  order: [['id', 'DESC']]
})
export const recupererParID = async (id, utilisateur) => {
  const soumission = await Soumission.findByPk(id)
  if (!soumission || soumission.utilisateurId !== utilisateur.id) // Cache les soumissions non soumisent par l'utilisateur connecté
    throw new SoumissionNonTrouveError(id)
  return soumission
}

export const creerSoumission = (exercice, profile, soumission, transaction) =>
  Soumission.create({ exerciceId: exercice, utilisateurId: profile, ...soumission }, transaction && { transaction })

export const supprimerSoumission = async id => {
  const affecte = await Soumission.destroy({ where: { id } })
  if (!affecte) throw new SoumissionNonTrouveError(id)
  return id
}

export const recupererCompilationSoumission = soumission => ({
  reussie: soumission.compilationReussie,
  duree: soumission.compilationDuree,
  code: soumission.compilationCode,
  stdout: soumission.compilationStdout,
  stderr: soumission.compilationStderr
})
export const recupererResultatTestsSoumission = soumission =>
  soumission.getResultat_tests({ order: [['id', 'ASC']] })
export const recupererExerciceSoumission = soumission =>
  soumission.getExercice()

export async function* soumettre(preparer, utilisateur, exerciceId, tests, code) {
  let debut, nbPasses = 0
  const resultatTests = Array(tests.length)
  for await (const etape of evaluer((id, params) => ({ ...params, etape: id }), code, tests.map(test => test.entree), utilisateur)) {
    switch (etape.etape) {
    case 'DEBUT_COMPILATION':
      debut = Date.now()
      break
    case 'DEBUT_EXECUTION_TEST':
      etape.test = tests[etape.id]
      break
    case 'FIN_EXECUTION_TEST':
      const test = tests[etape.id]
      const resultat = etape.test
      const passe = (resultat.stdout === test.sortie)
      if (passe)
        nbPasses++
      resultatTests[etape.id] = (etape.test = {
        // id,
        nom: test.nom, // FIXME : Rendre les tests immuables afin de ne pas avoir à copier certains propriétés ?
        code: resultat.code,
        duree: resultat.duree,
        passe, // FIXME : Ignorer les espaces en début et en fin de chaine de caractères ?
        entree: resultat.entree,
        attendu: test.sortie,
        stdout: resultat.stdout,
        stderr: resultat.stderr
      })
      break

    case 'FIN_EVALUATION':
      const nbTests = tests.length
      const soumission = await creerSoumission(
        exerciceId,
        utilisateur.id,
        {
          duree: Date.now() - debut,
          passe: nbTests === nbPasses,
          nbTests,
          nbPasses,

          code,

          compilationReussie: etape.compilation.reussie,
          compilationDuree: etape.compilation.duree,
          compilationCode: etape.compilation.code,
          compilationStdout: etape.compilation.stdout,
          compilationStderr: etape.compilation.stderr
        }
      )
      if (etape.compilation.reussie)
        await creerResultatTest(soumission, resultatTests)
      etape.tests = resultatTests
      etape.id = soumission.id // Permet récupérer le résultat facilement depuis le front
      break

    default:
      break
    }
    yield preparer(etape.etape, etape)
  }
}
