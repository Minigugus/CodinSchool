import {
  recupererResultatTestsSoumission,
  recupererCompilationSoumission,
  soumettre,
  recupererParID,
  recupererTous,
  recupererExerciceSoumission
} from './SoumissionLogique'
import { recupererParID as recupererExerciceParID, recupererTestsExercice } from '../ExerciceLogique'

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
        const exercice = await recupererExerciceParID(exerciceId)
        const tests = await recupererTestsExercice(exercice)
        return soumettre(
          (etape, parametres = {}) => ({ [nomChamp]: { ...parametres, etape } }),
          utilisateur,
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
