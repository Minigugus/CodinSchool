<template>
  <div class="ui container segment stripe smallContainer">
    <h2 class="ui center aligned header">
      <div class="content">
        Connexion
      </div>
    </h2>

    <ApolloMutation
      :mutation="require('@/graphql/Connexion.gql')"
      :variables="{
        email: formulaire.email,
        motDePasse: formulaire.motDePasse
      }"
      class="form"
      @error="chargerErreur"
      @done="connexionOk"
    >
      <template slot-scope="{ mutate, loading }">
        <form @submit.prevent="verifierFormulaire() && mutate()" :class="{ loading }" class="ui form">
          <div class="field">
            <label for="email">Adresse email</label>
            <input type="text" id="email" v-model="formulaire.email" placeholder="Adresse email" />
          </div>
          <div class="field">
            <label for="motDePasse">Mot de passe</label>
            <input type="password" id="motDePasse" v-model="formulaire.motDePasse" placeholder="Mot de passe" autocomplete="current-password"/>
          </div>

          <router-link to="/mdpOublie" class="mdpOublie underlineHover">Mot de passe oublié ?</router-link>

          <button class="ui button" type="submit">Se connecter</button>
        </form>

        <Alerte ref="erreurs" typeAlerte="Erreur" />
      </template>
    </ApolloMutation>
  </div>
</template>

<script>
import { onLogin } from '@/vue-apollo'
import UTILISATEUR from '@/graphql/Utilisateur.gql'
import Alerte from '@/components/Alerte.vue'

export default {
  name: 'connexion',
  components: {
    Alerte
  },
  data() {
    return {
      formulaire: {
        email: 'nom.prenom@hotmail.fr',
        motDePasse:	'pseudo'
      }
    }
  },

  methods: {
    // Charger une erreur GraphQL envoyée par Apollo dans la liste des erreurs
    chargerErreur(errorObject) {
      let e = errorObject.message
      if (e.includes('GraphQL error: '))
        this.ajouterErreur(e.replace('GraphQL error: ', ''))
    },

    // Ajouter une erreur dans la liste des erreurs
    ajouterErreur(...str) {
      this.$refs.erreurs.ajouterAlerte(...str)
    },

    // Mettre un fond rouge sur un élément de formulaire
    setErreurInput(activerErreur, ...id) {
      id.forEach(input => activerErreur
        ? document.getElementById(input).parentElement.classList.add('error')
        : document.getElementById(input).parentElement.classList.remove('error'))
    },

    // Vérifier que tous les champs du formulaire sont remplis
    verifierTousChampsRemplis() {
      let allInputCompleted = true
      Object.keys(this.formulaire).forEach(input => {
        if (!this.formulaire[input]) {
          this.setErreurInput(true, input)
          allInputCompleted = false
        }
      })
      if (!allInputCompleted)
        this.ajouterErreur('Tous les champs sont obligatoires.')
      return allInputCompleted
    },

    // Vider les alertes d'erreurs et les couleurs des input
    resetErreurs() {
      this.setErreurInput(false, ...Object.keys(this.formulaire))
      this.$refs.erreurs.viderAlerte()
    },

    // Vérifier le formulaire avant envoi
    verifierFormulaire() {
      this.resetErreurs()
      let envoyerFormulaire = true
      if (!this.verifierTousChampsRemplis()) envoyerFormulaire = false
      return envoyerFormulaire
    },

    // Formulaire validé, injection des données et redirection vers l'application
    async connexionOk({ data }) {
      const apolloClient = this.$apollo.provider.defaultClient

      // Mettre le jeton à jour et recharger le cache
      const jeton = 'Bearer ' + data.connexion.jeton
      await onLogin(apolloClient, jeton)

      // Mise à jour du cache
      apolloClient.writeQuery({
        query: UTILISATEUR,
        data: {
          ...data.connexion
        }
      })

      // On redirige le client vers la page de profil
      // TODO: Choisir la page où rediriger
      this.$router.replace({ name: 'profil' })
    }
  }
}
</script>

<style scoped>
.mdpOublie {
  right: 0;
  position: absolute;
}
</style>
