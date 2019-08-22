import {
  recupererResultatTestsSoumission,
  recupererCompilationSoumission,
  soumettre,
  recupererParID,
  recupererTous,
  recupererExerciceSoumission
} from './SoumissionLogique'
import { recupererParID as recupererExerciceParID, recupererTestsExercice } from '../ExerciceLogique'
import * as moteursLangage from '../../evaluation/langages'

export default {
  Query: {
    soumission(_, { id }, { utilisateur }) {
      return recupererParID(id, utilisateur)
    },
    soumissions(_, __, { utilisateur }) {
      return recupererTous(utilisateur)
    }
  },
  Subscription: {
    soumettre: {
      async subscribe(_, { exercice: exerciceId, code }, { utilisateur }, { fieldName: nomChamp }) {
        const langage = 'JS' // FIXME : Demander à l'utilisateur ?
        const exercice = await recupererExerciceParID(exerciceId)
        const tests = await recupererTestsExercice(exercice)
        if (!(langage in moteursLangage))
          throw new Error() // TODO : Créer une classe pour cette exception
        return soumettre(
          nomChamp,
          moteursLangage[langage],
          utilisateur.id,
          exercice.id,
          tests,
          code
        )
      }
    }
  },
  Soumission: {
    exercice(soumission) {
      return recupererExerciceSoumission(soumission)
    },
    compilation(soumission) {
      return recupererCompilationSoumission(soumission)
    },
    resultats(soumission) {
      return soumission.compilationReussie
        ? recupererResultatTestsSoumission(soumission)
        : null
    }
  }
}
