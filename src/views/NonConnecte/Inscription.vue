<template>
  <div class="ui container smallContainer">
    <h2 class="text-center">Inscription</h2>

    <transition name="fade-slow" mode="out-in">
      <ApolloMutation
        v-if="!validated"
        :mutation="require('@/graphql/Utilisateur/Inscription.gql')"
        :variables="{
          nouvelUtilisateur: {
            email: form.email.v,
            motDePasse: form.mdp.v,
            nom: form.nom.v,
            prenom: form.prenom.v,
            dateNaissance: form.dateNaissance.v
          }
        }"
        class="ui container segment"
        @error="chargerErreur"
        @done="validated = true"
      >
        <template slot-scope="{ mutate, loading }">
          <form @submit.prevent="verifierFormulaire() && mutate()" :class="{ loading }" class="ui form" novalidate>
            <div class="two fields">
              <form-champs v-model="form.nom.v" nom="Nom" id="nom" :err="form.nom.err" />
              <form-champs v-model="form.prenom.v" nom="Prénom" id="prenom" :err="form.prenom.err" />
            </div>
            <form-champs
              v-model="form.email.v"
              nom="Adresse email"
              type="email"
              id="email"
              :err="form.email.err"
            />
            <form-champs
              v-model="form.mdp.v"
              nom="Mot de passe"
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
            <form-champs
              v-model.number="form.dateNaissance.v"
              type="number"
              nom="Année de naissance"
              id="dateNaissance"
              :err="form.dateNaissance.err"
            />

            <button class="ui button" type="submit">S'inscrire</button>
          </form>

          <Alerte ref="erreurs" type-alerte="Erreur" />
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
import FormChamps from '@/components/FormChamps.vue'

export default {
  name: 'Inscription',
  components: {
    Alerte,
    FormChamps
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

      validated: false
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
      this.$refs.erreurs.ajouterAlerte(gqlError.message)
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
      if (!allInputCompleted) this.$refs.erreurs.ajouterAlerte('Tous les champs sont obligatoires.')
      return allInputCompleted
    },

    // Vérifier que l'adresse email entrée est valide
    verifierEmail() {
      if (!this.form.email.v) return
      if (!isEmail(this.form.email.v)) {
        this.$refs.erreurs.ajouterAlerte('L\'adresse email renseignée est invalide.')
        this.form.email.err = ['Adresse email invalide.']
        return false
      }
      return true
    },

    // Vérifier que la confirmation de mot de passe est identique
    verifierMdp() {
      if (!this.form.mdp.v) return
      if (this.form.mdp.v.length > 0 && this.form.mdp.v.length < 4) {
        this.$refs.erreurs.ajouterAlerte('Le mot de passe doit avoir une taille de 4 caractères mininum.')
        this.form.mdp.err = ['Mot de passe trop court.']
        this.form.mdp2.err = []
        return false
      }
      else if (this.form.mdp.v !== this.form.mdp2.v) {
        this.$refs.erreurs.ajouterAlerte('Les mots de passe ne correspondent pas.')
        this.form.mdp2.err = ['Confirmation de mot de passe incorrecte.']
        return false
      }
      return true
    },

    // Vérifier que la date de naissance entrée est valide
    verifierDateNaissance() {
      if (!this.form.dateNaissance.v) return
      if (!parseInt(this.form.dateNaissance.v, 10)) {
        this.$refs.erreurs.ajouterAlerte('L\'année de naissance renseignée est invalide.')
        this.form.dateNaissance.err = ['Année de naissance incorrecte.']
        return false
      }
      this.form.dateNaissance.v = parseInt(this.form.dateNaissance.v, 10)
      return true
    },

    // Vérifier le formulaire avant envoi
    verifierFormulaire() {
      // Vider les erreurs de formulaire
      Object.keys(this.form).forEach(input => this.form[input].err = [])
      this.$refs.erreurs.viderAlerte()
      let envoyerFormulaire = true

      if (!this.verifierTousChampsRemplis()) envoyerFormulaire = false
      if (!this.verifierEmail()) envoyerFormulaire = false
      if (!this.verifierMdp()) envoyerFormulaire = false
      if (!this.verifierDateNaissance()) envoyerFormulaire = false

      return envoyerFormulaire
    }
  }
}
</script>
