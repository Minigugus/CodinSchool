<template>
  <div class="ui container segment stripe smallContainer">
    <h2 class="ui center aligned header">
      <div class="content">
        Inscription
      </div>
    </h2>

    <transition name="fade-slow" mode="out-in">
      <ApolloMutation
        v-if="!inscriptionFin"
        :mutation="require('@/graphql/Inscription.gql')"
        :variables="{
          nouvelUtilisateur: {
            email: form.email.v,
            motDePasse: form.mdp.v,
            nom: form.nom.v,
            prenom: form.prenom.v,
            dateNaissance: form.dateNaissance.v
          }
        }"
        class="form"
        @error="chargerErreur"
        @done="validerEmail"
      >
        <template slot-scope="{ mutate, loading }">
          <form @submit.prevent="verifierFormulaire() && mutate()" :class="{ loading }" class="ui form">
            <div class="field">
              <div class="two fields">
                <div class="field" :class="{ error: form.nom.err.length > 0 }">
                  <label for="nom">Nom</label>
                  <input type="text" id="nom" v-model="form.nom.v" placeholder="Nom">
                  <div v-for="(err, index) in form.nom.err" :key="'nom-'+index" class="ui basic red pointing prompt label transition">{{ err }}</div>
                </div>
                <div class="field" :class="{ error: form.prenom.err.length > 0 }">
                  <label for="prenom">Prénom</label>
                  <input type="text" id="prenom" v-model="form.prenom.v" placeholder="Prénom">
                  <div v-for="(err, index) in form.prenom.err" :key="'prenom-'+index" class="ui basic red pointing prompt label transition">{{ err }}</div>
                </div>
              </div>
            </div>
            <div class="field" :class="{ error: form.email.err.length > 0 }">
              <label for="email">Adresse email</label>
              <input type="text" id="email" v-model="form.email.v" placeholder="Adresse email" />
              <div v-for="(err, index) in form.email.err" :key="'email-'+index" class="ui basic red pointing prompt label transition">{{ err }}</div>
            </div>
            <div class="field" :class="{ error: form.mdp.err.length > 0 }">
              <label for="mdp">Mot de passe</label>
              <input type="password" id="mdp" v-model="form.mdp.v" placeholder="Mot de passe" autocomplete="new-password "/>
              <div v-for="(err, index) in form.mdp.err" :key="'mdp-'+index" class="ui basic red pointing prompt label transition">{{ err }}</div>
            </div>
            <div class="field" :class="{ error: form.mdp2.err.length > 0 }">
              <label for="mdp2">Confirmation du mot de passe</label>
              <input type="password" id="mdp2" v-model="form.mdp2.v" placeholder="Confirmation du mot de passe" autocomplete="new-password "/>
              <div v-for="(err, index) in form.mdp2.err" :key="'mdp2-'+index" class="ui basic red pointing prompt label transition">{{ err }}</div>
            </div>
            <div class="field" :class="{ error: form.dateNaissance.err.length > 0 }">
              <label for="dateNaissance">Année de naissance</label>
              <input type="number" id="dateNaissance" v-model.number="form.dateNaissance.v" placeholder="Année de naissance" />
              <div v-for="(err, index) in form.dateNaissance.err" :key="'dateNaissance-'+index" class="ui basic red pointing prompt label transition">{{ err }}</div>
            </div>
            <button class="ui button" type="submit">S'inscrire</button>
          </form>

          <Alerte ref="erreurs" typeAlerte="Erreur" />
        </template>
      </ApolloMutation>

      <div v-else>
        <h2 class="ui center aligned icon header">
          <i class="circular envelope icon"></i>
          Inscription enregistrée !
        </h2>
        <h3 class="ui center aligned icon header">
          Vous avez reçu un email contenant un lien d'activation de votre compte.
        </h3>
      </div>
    </transition>
  </div>
</template>

<script>
import { isEmail } from '@/functions'
import Alerte from '@/components/Alerte.vue'

export default {
  name: 'inscription',
  components: {
    Alerte
  },
  data() {
    return {
      form: {
        nom: { v: '', err: []},
        prenom: { v: '', err: []},
        email: { v: '', err: []},
        mdp: { v: '', err: []},
        mdp2: { v: '', err: []},
        dateNaissance: { v: '', err: []}
      },

      inscriptionFin: false
    }
  },

  methods: {
    // Charger une erreur GraphQL envoyée par Apollo dans la liste des erreurs
    chargerErreur(errorObject) {
      const { gqlError } = errorObject
      if (!gqlError) return console.error(errorObject)

      // Un ou plusieurs champs sont invalides
      if (gqlError.extensions.code === 'VALIDATION_ECHOUEE')
        gqlError.extensions.exception.props.champs.forEach(x =>
          (this.form[x.nom] && this.form[x.nom].err.push(x.message)))

      // Affichage de l'erreur dans l'alerte
      this.ajouterErreur(gqlError.message)
    },

    // Ajouter une erreur dans la liste des erreurs
    ajouterErreur(...str) {
      this.$refs.erreurs.ajouterAlerte(...str)
    },

    // Vérifier que tous les champs du formulaire sont remplis
    verifierTousChampsRemplis() {
      let allInputCompleted = true
      Object.keys(this.form).forEach(input => {
        if (this.form[input].v === '') {
          this.form[input].err = ['Le champs est vide.']
          allInputCompleted = false
        }
      })
      if (!allInputCompleted) this.ajouterErreur('Tous les champs sont obligatoires.')
      return allInputCompleted
    },

    // Vérifier que l'adresse email entrée est valide
    verifierEmail() {
      if (!isEmail(this.form.email.v)) {
        this.ajouterErreur('L\'adresse email renseignée est invalide.')
        this.form.email.err = ['Adresse email invalide.']
        return false
      }
      return true
    },

    // Vérifier que la confirmation de mot de passe est identique
    verifierMdp() {
      if (this.form.mdp.v.length === 0)
        return
      if (this.form.mdp.v.length > 0 && this.form.mdp.v.length < 4) {
        this.ajouterErreur('Le mot de passe doit avoir une taille de 4 caractères mininum.')
        this.form.mdp.err = ['Mot de passe trop court.']
        this.form.mdp2.err = []
        return false
      }
      else if (this.form.mdp.v !== this.form.mdp2.v) {
        this.ajouterErreur('Les mots de passe ne correspondent pas.')
        this.form.mdp2.err = ['Confirmation de mot de passe incorrecte.']
        return false
      }
      return true
    },

    // Vider les alertes d'erreurs et les couleurs des input
    resetErreurs() {
      Object.keys(this.form).forEach(input => this.form[input].err = [])
      this.$refs.erreurs.viderAlerte()
    },

    // Vérifier le formulaire avant envoi
    verifierFormulaire() {
      this.resetErreurs()
      let envoyerFormulaire = true
      if (!this.verifierTousChampsRemplis()) envoyerFormulaire = false
      if (!this.verifierEmail()) envoyerFormulaire = false
      if (!this.verifierMdp()) envoyerFormulaire = false
      return envoyerFormulaire
    },

    // Formulaire validé, affichage du message "Confirmez votre compte"
    validerEmail() {
      this.inscriptionFin = true
    }
  }
}
</script>
