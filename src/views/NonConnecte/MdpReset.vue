<template>
  <div class="ui container segment stripe smallContainer">
    <h2 class="ui center aligned header">
      <div class="content">
        Réinitialisation de mot de passe
      </div>
    </h2>

    <ApolloMutation
      :mutation="require('@/graphql/Utilisateur/ResetMdp.gql')"
      :variables="{
        email,
        code,
        motDePasse: nouveauMdp,
      }"
      class="form"
      @error="chargerErreur"
      @done="formOk"
    >
      <template v-if="typeAlerte !== 'Succès'" slot-scope="{ mutate, loading }">
        <form @submit.prevent="verifierFormulaire() && mutate()" :class="{ loading }" class="ui form">
          <p>
            Définissez votre nouveau mot de passe.
          </p>

          <div class="field disabled">
            <label for="email">Adresse email</label>
            <input type="email" id="email" v-model="email" placeholder="Adresse email" />
          </div>

          <div class="field disabled">
            <label for="code">Code de réinitialisation de mot de passe</label>
            <input type="text" id="code" v-model="code" placeholder="Code de réinitialisation" />
          </div>

          <div class="field">
            <label for="nouveauMdp">Nouveau mot de passe</label>
            <input type="password" id="nouveauMdp" v-model="nouveauMdp" placeholder="Nouveau mot de passe" />
          </div>

          <div class="field">
            <label for="nouveauMdp2">Confirmation du nouveau mot de passe</label>
            <input type="password" id="nouveauMdp2" v-model="nouveauMdp2" placeholder="Confirmation du mot de passe" />
          </div>

          <button class="ui button" type="submit">Modifier mon mot de passe</button>
        </form>
      </template>

      <Alerte ref="notifs" :type-alerte="typeAlerte" :fermable="typeAlerte !== 'Succès'" />
    </ApolloMutation>
  </div>
</template>

<script>
import { setErreurInput } from '@/functions'
import Alerte from '@/components/Alerte.vue'

export default {
  name: 'Mdpoublie',
  components: {
    Alerte
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
      nouveauMdp: '',
      nouveauMdp2: '',
      typeAlerte: 'Erreur'
    }
  },
  methods: {
    // Afficher une alerte
    ajouterNotif(...str) {
      this.$refs.notifs.ajouterAlerte(...str)
    },

    // Réinitialiser les erreurs du formulaire
    viderNotif() {
      this.$refs.notifs.viderAlerte()
      setErreurInput(false, 'nouveauMdp', 'nouveauMdp2')
    },

    // Vérifier que le formulaire est bien rempli
    verifierFormulaire() {
      let formulaireOk = true
      this.viderNotif()

      if (this.nouveauMdp.length < 4) {
        formulaireOk = false
        setErreurInput(true, 'nouveauMdp')
        this.ajouterNotif('Le nouveau mot de passe doit être de 4 caractères minimum.')
      }
      if (this.nouveauMdp !== this.nouveauMdp2) {
        formulaireOk = false
        setErreurInput(true, 'nouveauMdp', 'nouveauMdp2')
        this.ajouterNotif('Les mots de passe ne correspondent pas.')
      }
      if (!formulaireOk) this.typeAlerte = 'Erreur'

      return formulaireOk
    },

    // La demande de réinitialisation de mot de passe s'est bien passée
    formOk() {
      this.viderNotif()
      this.typeAlerte = 'Succès'
      this.ajouterNotif('Votre mot de passe a été réinitialisé. Vous pouvez vous connecter.')
    },

    // Charger une erreur GraphQL envoyée par Apollo dans la liste des erreurs
    chargerErreur(errorObject) {
      let e = errorObject.message
      if (e.includes('GraphQL error: ')) {
        this.ajouterNotif(e.replace('GraphQL error: ', ''))
        this.typeAlerte = 'Erreur'
      }
    }
  }
}
</script>
