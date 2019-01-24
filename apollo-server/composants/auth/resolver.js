
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
};