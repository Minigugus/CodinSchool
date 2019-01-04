import bdd from './utils/bdd'
import auth from './utils/auth'

export default {
  Query: {
    moi(_, args, { utilisateur }) {
      return bdd.recupererUtilisateur(utilisateur.id)
    },

    utilisateur(_, { id }) {
      return bdd.recupererUtilisateur(id)
    },

    utilisateurs(_, __) {
      return bdd.utilisateurs
    },

    role(_, { id }) {
      return bdd.recupererRole(id)
    },

    roles() {
      return bdd.roles
    }
  },

  Role: {
    nbMembre({ membres }) {
      return membres.length
    },

    membres(role) {
      return bdd.recupererUtilisateursRole(role)
    }
  },

  Utilisateur: {
    jeton(_, args, { utilisateur }) {
      return auth.creerJeton({ id: utilisateur.id })
    },

    profile(_utilisateur, args, { utilisateur }) {
      return utilisateur
    }
  },
  Mutation: {
    inscription(_, { inscription }, req) {
      const utilisateur = bdd.creerUtilisateur(inscription)
      utilisateur.permissions = bdd.recupererPermissions(utilisateur)
      req.utilisateur = utilisateur
      return utilisateur
    },

    connexion(_, { email, motDePasse }, req) {
      const utilisateur = bdd.authentifier(email, motDePasse)
      utilisateur.permissions = bdd.recupererPermissions(utilisateur)
      req.utilisateur = utilisateur
      return utilisateur
    }
  }
}
