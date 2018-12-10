<template>
  <div class="ui raised very padded text container segment">
    <h2 class="ui center aligned header">
      <i class="settings icon" style="display: inline;position: absolute;margin-left: -44px;margin-top: 7px;"></i>
      <div class="content" style="display: inline-block;">
        Codinschool
        <div class="sub header">Inscription</div>
      </div>
    </h2>

    <ApolloMutation
      :mutation="require('../graphql/Inscription.gql')"
      :variables="{
        nouvelUtilisateur: {
          email: formulaire.email,
          pseudo: formulaire.pseudo,
          motDePasse: formulaire.motDePasse,
          nom: formulaire.nom,
          prenom: formulaire.prenom,
          dateNaissance: formulaire.dateNaissance
        }
      }"
      class="form"
      @error="chargerErreur"
      @done="rediriger"
    >
      <template slot-scope="{ mutate, loading }">
        <form v-on:submit.prevent="verifierFormulaire() && mutate()" :class="{ loading: loading }" class="ui form">
          <div class="field">
            <div class="two fields">
              <div class="field">
                <label for="nom">Nom</label>
                <input type="text" id="nom" v-model="formulaire.nom" placeholder="Nom">
              </div>
              <div class="field">
                <label for="prenom">Prénom</label>
                <input type="text" id="prenom" v-model="formulaire.prenom" placeholder="Prénom">
              </div>
            </div>
          </div>
          <div class="field">
            <label for="pseudo">Pseudo</label>
            <input type="text" id="pseudo" v-model="formulaire.pseudo" placeholder="Pseudo" />
          </div>
          <div class="field">
            <label for="email">Adresse email</label>
            <input type="text" id="email" v-model="formulaire.email" placeholder="Adresse email" />
          </div>
          <div class="field">
            <label for="motDePasse">Mot de passe</label>
            <input type="password" id="motDePasse" v-model="formulaire.motDePasse" placeholder="Mot de passe" />
          </div>
          <div class="field">
            <label for="motDePasse2">Confirmation du mot de passe</label>
            <input type="password" id="motDePasse2" v-model="formulaire.motDePasse2" placeholder="Confirmation du mot de passe" />
          </div>
          <button class="ui button" type="submit">S'inscrire</button>
        </form>

        <Alerte v-if="erreurFormulaire && erreurFormulaire.length > 0"
          typeAlerte="Erreur"
          :synchro="true"
          v-bind:messages="erreurFormulaire"
          v-on:vider="erreurFormulaire = []"
        />
      </template>
    </ApolloMutation>
  </div>
</template>

<script>
import Alerte from '../components/Alerte.vue'

export default {
  name: 'inscription',
  components: {
    Alerte
  },
  data() {
    return {
      formulaire: {
        nom: 'Sauvage',
        prenom: 'Prenom',
        pseudo: 'pseudo',
        email: 'mail@example.com',
        motDePasse:	'pseudo',
        motDePasse2:	'pseudo',
        dateNaissance: 2018
      },
      erreurFormulaire: []
    }
  },

  methods: {
    // Charger une erreur GraphQL envoyée par Apollo dans la liste des erreurs
    chargerErreur(errorObject) {
      let e = errorObject.message
      if (e.includes('GraphQL error: '))
        this.erreurFormulaire.push(e.replace('GraphQL error: ', ''))
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
        this.erreurFormulaire.push('Tous les champs sont obligatoires.')
      return allInputCompleted
    },

    // Vérifier que l'adresse email entrée est valide
    verifierEmail() {
      const isEmailValid = email => /^([A-Za-z0-9_\-.+])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,})$/.test(email)

      if (!isEmailValid(this.formulaire.email)) {
        this.erreurFormulaire.push('L\'adresse email renseignée est invalide.')
        this.setErreurInput(true, 'email')
        return false
      }
      return true
    },

    // Vérifier que la confirmation de mot de passe est identique
    verifierConfirmationMotDePasse() {
      if (this.formulaire.motDePasse !== this.formulaire.motDePasse2) {
        this.erreurFormulaire.push('Les mots de passe ne correspondent pas.')
        this.setErreurInput(true, 'motDePasse')
        this.setErreurInput(true, 'motDePasse2')
        return false
      }
      return true
    },

    // Vérifier le formulaire avant envoi
    verifierFormulaire(aa, bb, cc) {
      this.erreurFormulaire = []
      let envoyerFormulaire = true
      if (!this.verifierTousChampsRemplis()) envoyerFormulaire = false
      if (!this.verifierEmail()) envoyerFormulaire = false
      if (!this.verifierConfirmationMotDePasse()) envoyerFormulaire = false
      return envoyerFormulaire
    },

    // Formulaire validé, redirection de la page
    rediriger() {
      console.log('form validé, demande de redirection')
    }
  }
}
</script>
