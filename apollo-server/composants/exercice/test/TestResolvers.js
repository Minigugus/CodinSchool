import { creerTest, editerTest, supprimerTest } from './TestLogique'

export default {
  Mutation: {
    creerTest(_, { exercice, test }) {
      return creerTest(exercice, test)
    },
    editerTest(_, { test, modifications }) {
      return editerTest(test, modifications)
    },
    supprimerTest(_, { test }) {
      return supprimerTest(test)
    }
  },
  Test: {
    exercice(test) {
      return test.getExercice()
    }
  }
}
