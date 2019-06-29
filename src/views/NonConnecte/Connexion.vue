<template>
  <div class="ui container smallContainer">
    <h2 class="text-center">Connexion</h2>

    <ApolloMutation
      :mutation="require('@/graphql/Utilisateur/Connexion.gql')"
      :variables="{
        email: form.email.v,
        motDePasse: form.mdp.v
      }"
      class="ui container segment"
      @error="$refs.notifs.ajouterAlerte($event.gqlError.message)"
      @done="connexionOk"
    >
      <template v-slot="{ mutate, loading }">
        <form @submit.prevent="verifierFormulaire() && mutate()" :class="{ loading }" class="ui form">
          <form-champs
            v-model="form.email.v"
            nom="Adresse email"
            id="email"
            type="email"
            :err="form.email.err"
          />

          <form-champs
            v-model="form.mdp.v"
            nom="Mot de passe"
            id="mdp"
            type="password"
            :err="form.mdp.err"
          />

          <router-link to="/mdpOublie" class="mdpOublie underlineHover">Mot de passe oublié ?</router-link>

          <button class="ui button" type="submit">Se connecter</button>
        </form>

        <Alerte ref="notifs" type-alerte="Erreur" />
      </template>
    </ApolloMutation>
  </div>
</template>

<script>
import Alerte from '@/components/Alerte.vue'
import FormChamps from '@/components/FormChamps.vue'
import Utilisateur from '@/graphql/Utilisateur/Utilisateur.gql'
import { onLogin } from '@/vue-apollo'

export default {
  name: 'Connexion',
  components: {
    Alerte,
    FormChamps
  },
  data() {
    return {
      form: {
        email: { v: '', err: [] },
        mdp:	{ v: '', err: [] }
      }
    }
  },

  methods: {
    // Vérifier que le formulaire est bien rempli
    verifierFormulaire() {
      let formulaireOk = true

      this.$refs.notifs.viderAlerte()
      this.form.email.err = []
      this.form.mdp.err = []

      if (this.form.email.v.length === 0) {
        this.form.email.err.push('Veuillez renseigner votre adresse email')
        formulaireOk = false
      }
      if (this.form.mdp.v.length === 0) {
        this.form.mdp.err.push('Veuillez renseigner votre mot de passe')
        formulaireOk = false
      }
      if (!formulaireOk) {
        this.$refs.notifs.ajouterAlerte('Tous les champs sont obligatoires.')
        this.typeAlerte = 'Erreur'
      }

      return formulaireOk
    },

    // Formulaire validé, injection des données et redirection vers l'application
    async connexionOk({ data: { connexion } }) {
      const apolloClient = this.$apollo.provider.defaultClient

      // Mettre le jeton à jour et recharger le cache
      await onLogin(apolloClient, `Bearer ${connexion.jeton}`)

      // Mise à jour du cache
      apolloClient.writeQuery({
        query: Utilisateur,
        data: { ...connexion }
      })

      // On redirige le client vers la page de profil
      // TODO: Choisir la page où rediriger
      this.$router.replace({ name: 'Profil' })
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
