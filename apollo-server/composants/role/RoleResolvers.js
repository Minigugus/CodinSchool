import { creerRole, editerRole, supprimerRole, ajouterMembre, supprimerMembre, recupererTous, recupererParID } from './RoleLogique'

export default {
  Query: {
    roles() {
      return recupererTous()
    },
    role(_, { id }) {
      return recupererParID(id)
    }
  },
  Mutation: {
    creerRole(_, { role }) {
      return creerRole(role)
    },
    editerRole(_, { id, role }) {
      return editerRole(id, role)
    },
    supprimerRole(_, { id }) {
      return supprimerRole(id)
    },
    ajouterRole(_, { role, membre }) {
      return ajouterMembre(role, membre)
    },
    retirerRole(_, { role, membre }) {
      return supprimerMembre(role, membre)
    }
  },
  DefinitionRole: {
    membres(role) {
      return role.getMembre()
    }
  }
}
