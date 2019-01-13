<template>
  <div class="ui container segment stripe">
    <h2 class="ui center aligned header">
      <div class="content">
        Inscription
      </div>
    </h2>

    <ApolloMutation
      v-if="!inscriptionFin"
      :mutation="require('@/graphql/Inscription.gql')"
      :variables="{
        nouvelUtilisateur: {
          email: formulaire.email,
          // pseudo: formulaire.pseudo,
          motDePasse: formulaire.motDePasse,
          nom: formulaire.nom,
          prenom: formulaire.prenom,
          dateNaissance: formulaire.dateNaissance
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
          <!-- <div class="field">
            <label for="pseudo">Pseudo</label>
            <input type="text" id="pseudo" v-model="formulaire.pseudo" placeholder="Pseudo" />
          </div> -->
          <div class="field">
            <label for="email">Adresse email</label>
            <input type="text" id="email" v-model="formulaire.email" placeholder="Adresse email" />
          </div>
          <div class="field">
            <label for="motDePasse">Mot de passe</label>
            <input type="password" id="motDePasse" v-model="formulaire.motDePasse" placeholder="Mot de passe" autocomplete="new-password "/>
          </div>
          <div class="field">
            <label for="motDePasse2">Confirmation du mot de passe</label>
            <input type="password" id="motDePasse2" v-model="formulaire.motDePasse2" placeholder="Confirmation du mot de passe" autocomplete="new-password "/>
          </div>
          <div class="field">
            <label for="dateNaissance">Date de naissance</label>
            <input type="number" id="dateNaissance" v-model="formulaire.dateNaissance" placeholder="Date de naissance" />
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
  </div>
</template>

<script>
import Alerte from '@/components/Alerte.vue'

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
        // pseudo: 'pseudo',
        email: 'mail@example.com',
        motDePasse:	'pseudo',
        motDePasse2:	'pseudo',
        dateNaissance: 2018
      },
      inscriptionFin: false
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

    // Vérifier que l'adresse email entrée est valide
    verifierEmail() {
      const isEmailValid = email => /^([A-Za-z0-9_\-.+])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,})$/.test(email)

      if (!isEmailValid(this.formulaire.email)) {
        this.ajouterErreur('L\'adresse email renseignée est invalide.')
        this.setErreurInput(true, 'email')
        return false
      }
      return true
    },

    // Vérifier que la confirmation de mot de passe est identique
    verifierMotDePasse() {
      if (this.formulaire.motDePasse.length === 0)
        return
      if (this.formulaire.motDePasse.length < 4) {
        this.ajouterErreur('Le mot de passe doit avoir une taille de 4 caractères mininum.')
        this.setErreurInput(true, 'motDePasse')
        this.setErreurInput(false, 'motDePasse2')
        return false
      }
      else if (this.formulaire.motDePasse !== this.formulaire.motDePasse2) {
        this.ajouterErreur('Les mots de passe ne correspondent pas.')
        this.setErreurInput(true, 'motDePasse')
        this.setErreurInput(true, 'motDePasse2')
        return false
      }
      return true
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
      if (!this.verifierEmail()) envoyerFormulaire = false
      if (!this.verifierMotDePasse()) envoyerFormulaire = false
      return envoyerFormulaire
    },

    // Formulaire validé, affichage du message "Confirmez votre compte"
    validerEmail() {
      this.inscriptionFin = true
    }
  }
}
</script>
