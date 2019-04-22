import { creerTest, editerTest, supprimerTest } from './TestLogique'

export default {
  Mutation: {
    creerTest(_, { exercice, test }) {
      return creerTest(exercice, test)
    },
    editerTest(_, { id, modifications }) {
      return editerTest(id, modifications)
    },
    supprimerTest(_, { id }) {
      return supprimerTest(id)
    }
  },
  Test: {
    exercice(test) {
      return test.getExercice()
    }
  }
}
