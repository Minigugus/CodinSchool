import {
  recupererParID,
  creerExercice,
  editerExercice,
  reorganiserExercices,
  supprimerExercice,
  recupererTestsExercice
} from './ExerciceLogique'

export default {
  Query: {
    exercice(_, { id }) {
      // TODO : Cacher les exercices aux étudiants qui n'ont pas débloqué le niveau précédent.
      return recupererParID(id)
    }
  },
  Mutation: {
    creerExercice(
      _,
      {
        exercice: { niveauId, ...exercice }
      }
    ) {
      return creerExercice(niveauId, exercice)
    },
    editerExercice(_, { id, exercice }) {
      return editerExercice(id, exercice)
    },
    reorganiserExercices(_, { niveau, exercices }) {
      return reorganiserExercices(niveau, exercices)
    },
    supprimerExercice(_, { id }) {
      return supprimerExercice(id)
    }
  },

  Exercice: {
    niveau(exercice) {
      return exercice.getNiveau()
    },
    tests(exercice) {
      return recupererTestsExercice(exercice)
    }
  }
}
