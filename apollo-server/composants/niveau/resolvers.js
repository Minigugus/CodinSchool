import { recupererTous, recupererParID, creerNiveau, editerNiveau, reorganiserNiveaux, supprimerNiveau, recupererExercicesNiveau } from '.'

export default {
  Query: {
    niveaux() {
      return recupererTous()
    },
    niveau(_, { id }) {
      return recupererParID(id)
    }
  },
  Mutation: {
    creerNiveau(_, { niveau }) {
      return creerNiveau(niveau)
    },
    editerNiveau(_, { id, niveau }) {
      return editerNiveau(id, niveau)
    },
    reorganiserNiveaux(_, { niveaux }) {
      return reorganiserNiveaux(niveaux).then(() => recupererTous())
    },
    supprimerNiveau(_, { id }) {
      return supprimerNiveau(id)
    }
  },

  Niveau: {
    exercices(niveau) {
      // TODO : Cacher les exercices aux étudiants qui n'ont pas débloqué le niveau précédent.
      return recupererExercicesNiveau(niveau)
    }
  }
}
