import { creerJeton, inscrire, authentifier } from './composants/auth';
import { recupererParID } from './composants/utilisateur';

export default {
  Query: {
    moi(_, __, { utilisateur }) {
      return utilisateur;
    },

    utilisateur(_, { id }) {
      return recupererParID(id);
    },

    // utilisateurs(_, __) {
    //   return bdd.utilisateurs
    // }
  },

  Mutation: {
    inscription(_, { inscription }) {
      return inscrire(inscription);
    },

    connexion(_, { email, motDePasse }) {
      return authentifier(email, motDePasse);
    }
  },

  Authentifie: {
    jeton(utilisateur) {
      return creerJeton(utilisateur);
    },

    moi(utilisateur) {
      return utilisateur;
    }
  },

  Inscrit: {
    email(utilisateur) {
      return utilisateur.emailPrimaire;
    }
  }
}
