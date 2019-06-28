<template>
  <div class="ui container">
    <h2 class="text-center">Réinitialisation de mot de passe</h2>

    <ApolloMutation
      v-if="!validated"
      :mutation="require('@/graphql/Utilisateur/ResetMdp.gql')"
      :variables="{
        email,
        code,
        motDePasse: form.mdp.v,
      }"
      class="ui container segment"
      @error="(typeAlerte = 'Erreur') && $refs.notifs.ajouterAlerte($event.gqlError.message)"
      @done="formOk"
    >
      <template v-slot="{ mutate, loading }">
        <form @submit.prevent="verifierFormulaire() && mutate()" :class="{ loading }" class="ui form">
          <p>Définissez votre nouveau mot de passe.</p>

          <form-champs
            :value="email"
            nom="Adresse email"
            id="email"
            disabled
          />

          <form-champs
            :value="code"
            nom="Code de réinitialisation de mot de passe"
            id="code"
            disabled
          />

          <form-champs
            v-model="form.mdp.v"
            nom="Nouveau mot de passe"
            id="mdp"
            type="password"
            :err="form.mdp.err"
          />

          <form-champs
            v-model="form.mdp2.v"
            nom="Confirmation du mot de passe"
            id="mdp2"
            type="password"
            :err="form.mdp2.err"
          />

          <button class="ui button" type="submit">Modifier mon mot de passe</button>
        </form>
        <Alerte ref="notifs" :type-alerte="typeAlerte" />
      </template>
    </ApolloMutation>

    <Alerte v-else :liste-msg="['Votre mot de passe a été réinitialisé. Vous pouvez vous connecter.']" type-alerte="Succès" :fermable="false" />
  </div>
</template>

<script>
import Alerte from '@/components/Alerte.vue'
import FormChamps from '@/components/FormChamps.vue'

export default {
  name: 'MdpReset',
  components: {
    Alerte,
    FormChamps
  },
  props: {
    email: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      form: {
        mdp: { v: '', err: [] },
        mdp2: { v: '', err: [] }
      },
      typeAlerte: 'Erreur',
      validated: false
    }
  },
  methods: {
    // Vérifier que le formulaire est bien rempli
    verifierFormulaire() {
      let formulaireOk = true

      this.$refs.notifs.viderAlerte()
      this.form.mdp.err = []
      this.form.mdp2.err = []

      if (this.form.mdp.v.length < 4) {
        this.form.mdp.err.push('Le nouveau mot de passe doit être de 4 caractères minimum.')
        formulaireOk = false
      }
      if (this.form.mdp.v !== this.form.mdp2.v) {
        this.form.mdp2.err.push('Les mots de passe ne correspondent pas.')
        formulaireOk = false
      }
      if (!formulaireOk) {
        this.$refs.notifs.ajouterAlerte('Le formulaire contient des erreurs.')
        this.typeAlerte = 'Erreur'
      }

      return formulaireOk
    },

    // La demande de réinitialisation de mot de passe a été validée
    formOk() {
      this.viderNotif()
      this.typeAlerte = 'Succès'
      this.ajouterNotif('Votre mot de passe a été réinitialisé. Vous pouvez vous connecter.')
    },

    chargerErreur() {

    }
  }
}
</script>
