import bdd from './utils/bdd'
import auth from './utils/auth'

export default {
  Requete: {
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
    },

    permissions(_, args, { utilisateur }) {
      return [...utilisateur.permissions]
    }
  },
  Mutation: {
    inscription(_, { inscription }, req) {
      const utilisateur = bdd.creerUtilisateur(inscription)
      req.utilisateur = utilisateur
      return utilisateur
    },

    connexion(_, { email, motDePasse }, req) {
      const utilisateur = bdd.authentifier(email, motDePasse)
      req.utilisateur = utilisateur
      return utilisateur
    },

    ajouterRoles(_, { idUtilisateur, idRoles }) {
      idRoles.forEach(r => bdd.ajouterRole(idUtilisateur, r))
      return bdd.recupererUtilisateur(idUtilisateur)
    },

    ajouterUtilisateurs(_, { idRole, idUtilisateurs }) {
      idUtilisateurs.forEach(u => bdd.ajouterRole(u, idRole))
      return bdd.recupererRole(idRole)
    },

    creerRole(_, { role }) {
      return bdd.creerRole(role)
    },

    editerRole(_, { id, role }) {
      return bdd.editerRole(id, role)
    },

    supprimerRole(_, { id }) {
      return bdd.supprimerRole(id)
    }
  }
}
