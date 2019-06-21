import { creerTest, editerTest, supprimerTest, reorganiserTests } from './TestLogique'

export default {
  Mutation: {
    creerTest(_, { exercice, test }) {
      return creerTest(exercice, test)
    },
    editerTest(_, { id, modifications }) {
      return editerTest(id, modifications)
    },
    supprimerTest(_, { test }) {
      return supprimerTest(test)
    },
    reorganiserTests(_, { niveau, tests }) {
      return reorganiserTests(niveau, tests)
    }
  },
  Test: {
    exercice(test) {
      return test.getExercice()
    }
  }
}
