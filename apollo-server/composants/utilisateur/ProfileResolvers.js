import { creerJeton } from '../auth'
import { recupererTous, recupererParID, inscrire, authentifier, activerCompte, demandeResetMdp, resetMdp, editerProfile, creerProfile, supprimerProfile } from './ProfileLogique'

export default {
  Query: {
    moi(_, __, { utilisateur }) {
      return utilisateur
    },

    utilisateurs() {
      return recupererTous()
    },

    utilisateur(_, { id }) {
      return recupererParID(id)
    }
  },

  Mutation: {
    inscription(_, { inscription }) {
      return inscrire(inscription)
    },

    connexion(_, { email, motDePasse }) {
      return authentifier(email, motDePasse)
    },

    activer(_, { code }) {
      return activerCompte(code)
    },

    motDePasseOublie(_, { email }) {
      return demandeResetMdp(email)
    },
    reinitialisationMotDePasse(_, { email, code, motDePasse }) {
      return resetMdp(email, code, motDePasse)
    },

    editer(_, { modifications }, { utilisateur }) {
      return editerProfile(utilisateur.id, modifications)
    },

    creerUtilisateur(_, { utilisateur }) {
      return creerProfile(utilisateur)
    },
    editerUtilisateur(_, { id, modifications }) {
      return editerProfile(id, modifications)
    },
    supprimerUtilisateur(_, { id }, { utilisateur }) {
      return supprimerProfile(utilisateur.id, id)
    }
  },

  Profile: {
    async roles(profile) {
      if (!profile.role)
        profile.role = await profile.getRole()
      return profile.role
    },
    async permissions(profile) {
      if (!profile.role)
        profile.role = await profile.getRole()
      return [...profile.permissions]
    }
  },

  Authentifie: {
    jeton(utilisateur) {
      return creerJeton(utilisateur)
    },

    moi(utilisateur) {
      return utilisateur
    }
  },

  Inscrit: {
    email(utilisateur) {
      return utilisateur.emailPrimaire
    }
  }
}
