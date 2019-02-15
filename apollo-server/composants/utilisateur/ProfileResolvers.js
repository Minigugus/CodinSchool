import { creerJeton } from '../auth'
import { recupererTous, recupererParID, inscrire, authentifier, activerCompte, demandeResetMdp, resetMdp } from './ProfileLogique'

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
    }
  },

  Profile: {
    async roles(profile) {
      if (!profile.roles)
        profile.role = await profile.getRole()
      return profile.roles
    },
    async permissions(profile) {
      if (!profile.roles)
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
