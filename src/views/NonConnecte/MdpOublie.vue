<template>
  <div class="ui container segment stripe smallContainer">
    <h2 class="ui center aligned header">
      <div class="content">
        Mot de passe oublié
      </div>
    </h2>

    <ApolloMutation
      :mutation="require('@/graphql/MdpOublie.gql')"
      :variables="{ email }"
      class="form"
      @error="chargerErreur"
      @done="formOk"
    >
      <template v-if="typeAlerte !== 'Succès'" slot-scope="{ mutate, loading }">
        <form @submit.prevent="verifierFormulaire() && mutate()" :class="{ loading }" class="ui form">
          <p>
            Entrez votre adresse email afin de recevoir un lien de reinitialisation de mot de passe.
          </p>
          <div class="field">
            <label for="email">Adresse email</label>
            <input type="email" id="email" v-model="email" placeholder="Adresse email" />
          </div>

          <router-link to="/connexion" class="retour underlineHover">Retour à la connexion</router-link>

          <button class="ui button" type="submit">Envoyer</button>
        </form>
      </template>

      <Alerte ref="notifs" :typeAlerte="typeAlerte" :fermable="typeAlerte !== 'Succès'" />
    </ApolloMutation>
  </div>
</template>

<script>
import { setErreurInput } from '@/functions'
import Alerte from '@/components/Alerte.vue'

export default {
  name: 'mdpoublie',
  components: {
    Alerte
  },
  data() {
    return {
      email: '',
      typeAlerte: 'Erreur'
    }
  },
  methods: {
    // Afficher une alerte
    setNotif(...str) {
      this.$refs.notifs.setAlerte(...str)
    },

    // Réinitialiser les erreurs du formulaire
    viderNotif() {
      this.$refs.notifs.viderAlerte()
      setErreurInput(false, 'email')
    },

    // Vérifier que le formulaire est bien rempli
    verifierFormulaire() {
      this.viderNotif()
      if (this.email === '') {
        this.typeAlerte = 'Erreur'
        this.setNotif('Le champs est vide.')
        setErreurInput(true, 'email')
        return false
      }
      return true
    },

    // La demande de réinitialisation de mot de passe s'est bien passée
    formOk() {
      this.typeAlerte = 'Succès'
      this.setNotif('Votre demande de réinitialisation de mot de passe a été validée.',
        'Vous avez reçu un email de confirmation contenant un lien permettant de définir votre nouveau mot de passe.')
    },

    // Charger une erreur GraphQL envoyée par Apollo dans la liste des erreurs
    chargerErreur(errorObject) {
      let e = errorObject.message
      if (e.includes('GraphQL error: ')) {
        this.typeAlerte = 'Erreur'
        this.setNotif(e.replace('GraphQL error: ', ''))
      }
    }
  }
}
</script>

<style scoped>
.retour {
  right: 0;
  position: absolute;
}
</style>
