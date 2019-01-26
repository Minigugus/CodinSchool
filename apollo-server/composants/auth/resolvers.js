import { recupererParID } from '../utilisateur'
import {
  inscrire,
  authentifier,
  activerCompte,
  creerJeton,
  demandeResetMdp,
  resetMdp
} from './index.js'

export default {
  Query: {
    moi(_, __, { utilisateur }) {
      return utilisateur
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
