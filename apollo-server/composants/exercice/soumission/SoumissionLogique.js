import Soumission from './SoumissionModele'
import { SoumissionNonTrouveError } from './SoumissionErreurs'

import evaluer from '../../evaluation/Evaluer'
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

export async function* soumettre(nomAbonnement, moteur, utilisateurId, exerciceId, tests, code) {
  const debut = Date.now()
  for await (const etatSoumission of evaluer(
    moteur,
    code,
    tests
  )) {
    if (etatSoumission.etat === 'TERMINE') { // Sauver le résultat
      const nbTests = tests.length
      const nbPasses = etatSoumission.tests
        ? etatSoumission.tests.reduce((somme, test) => test.passe ? somme + 1 : somme, 0)
        : 0
      const soumission = await creerSoumission(
        exerciceId,
        utilisateurId,
        {
          duree: Date.now() - debut,
          passe: nbPasses === nbTests,
          nbTests,
          nbPasses,

          code,

          compilationReussie: etatSoumission.compilation.reussie,
          compilationDuree: etatSoumission.compilation.duree,
          compilationCode: etatSoumission.compilation.code,
          compilationStdout: etatSoumission.compilation.stdout,
          compilationStderr: etatSoumission.compilation.stderr
        }
      )
      if (etatSoumission.tests)
        await creerResultatTest(soumission, etatSoumission.tests)
      etatSoumission.id = soumission.id // Permet récupérer le résultat facilement depuis le front
    }
    yield {
      [nomAbonnement]: etatSoumission
    }
  }
}
