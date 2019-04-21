import {
  recupererParID,
  creerExercice,
  editerExercice,
  reorganiserExercices,
  supprimerExercice
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
        exercice: { niveau, ...exercice }
      }
    ) {
      return creerExercice(niveau, exercice)
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
      return exercice.getTests()
    }
  }
}
