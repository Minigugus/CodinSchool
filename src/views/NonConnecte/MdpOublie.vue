<template>
  <div class="ui container smallContainer">
    <h2 class="text-center">Mot de passe oublié</h2>

    <ApolloMutation
      v-if="!validated"
      :mutation="require('@/graphql/Utilisateur/MdpOublie.gql')"
      :variables="{ email: form.email.v }"
      class="ui container segment"
      @error="$refs.notifs.ajouterAlerte($event.gqlError.message)"
      @done="validated = true"
    >
      <template v-slot="{ mutate, loading }">
        <form @submit.prevent="verifierFormulaire() && mutate()" :class="{ loading }" class="ui form">
          <p>Entrez votre adresse email afin de recevoir un lien de reinitialisation de mot de passe.</p>

          <form-champs
            v-model="form.email.v"
            nom="Adresse email"
            id="email"
            type="email"
            :err="form.email.err"
          />

          <router-link to="/connexion" class="retour underlineHover">Retour à la connexion</router-link>

          <button class="ui button" type="submit">Envoyer</button>
        </form>
      </template>

      <Alerte ref="notifs" type-alerte="Erreur" />
    </ApolloMutation>

    <Alerte
      v-else
      :liste-msg="[
        'Votre demande de réinitialisation de mot de passe a été validée.',
        'Si un compte est enregistré avec cette adresse, vous recevrez un email de confirmation contenant un lien permettant de définir votre nouveau mot de passe.'
      ]"
      type-alerte="Succès"
      :fermable="false"
    />
  </div>
</template>

<script>
import Alerte from '@/components/Alerte.vue'
import FormChamps from '@/components/FormChamps.vue'

export default {
  name: 'MdpOublie',
  components: {
    Alerte,
    FormChamps
  },
  data() {
    return {
      form: {
        email: { v: '', err: [] }
      },
      validated: false
    }
  },
  methods: {
    // Vérifier que le formulaire est bien rempli
    verifierFormulaire() {
      this.$refs.notifs.viderAlerte()
      this.form.email.err = []

      if (this.form.email.v.length === 0) {
        this.form.email.err.push('Veuillez renseigner votre adresse email')
        this.$refs.notifs.ajouterAlerte('Tous les champs sont obligatoires.')
        return false
      }
      return true
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
