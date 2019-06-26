<template>
  <div class="ui text vertical segment container">
    <!-- Contenu de la page -->

    <!-- Fil d'ariane -->
    <FilAriane :items="[
      { txt: 'Liste des utilisateurs', to: '/Administration/gererUtilisateurs' },
      `Création d'utilisateur`
    ]"
    />
    <!--/ Fil d'ariane -->

    <h1 class="ui center aligned header">Création d'utilisateur</h1>

    <!-- Formulaire d'édition de l'exercice -->
    <div class="ui container segment stripe">
      <ApolloMutation
        :mutation="require('@/graphql/Administration/CreerUtilisateur.gql')"
        :variables="{
          utilisateur: {
            nom: champs.utilisateur.nom.v,
            prenom: champs.utilisateur.prenom.v,
            motDePasse: champs.utilisateur.motDePasse.v,
            dateNaissance: champs.utilisateur.dateNaissance.v,
            email: champs.utilisateur.email.v
          }
        }"
        @error="chargerErreur"
        @done="utilisateurCree"
      >
        <template slot-scope="{ mutate, loading }">
          <form @submit.prevent="checkForm() && mutate()" :class="{ loading }" class="ui form" novalidate>
            <form-champs
              v-model="champs.utilisateur.nom.v"
              nom="Nom"
              id="nom"
              :err="champs.utilisateur.nom.err"
            />

            <form-champs
              v-model="champs.utilisateur.prenom.v"
              nom="Prénom"
              id="prenom"
              :err="champs.utilisateur.prenom.err"
            />

            <form-champs
              v-model="champs.utilisateur.email.v"
              nom="Email"
              id="email"
              :err="champs.utilisateur.email.err"
            />

            <form-champs
              v-model="champs.utilisateur.motDePasse.v"
              nom="Mot de passe"
              id="motDePasse"
              :err="champs.utilisateur.motDePasse.err"
            />

            <form-champs
              v-model.number="champs.utilisateur.dateNaissance.v"
              nom="Date de naissance"
              id="dateNaissance"
              type="number"
              :err="champs.utilisateur.dateNaissance.err"
            />

            <button
              class="ui button"
              type="submit"
            >
              Créer l'utilisateur
            </button>
          </form>

          <Alerte ref="erreurs" :type-alerte="typeAlerte" />
        </template>
      </ApolloMutation>
    </div>
    <!--/ Formulaire d'édition de l'exercice -->
  </div>
</template>

<script>
import Utilisateur from '@/graphql/Utilisateur/Utilisateur.gql'
import { checkPermissions, isEmail } from '@/functions'

import Alerte from '@/components/Alerte.vue'
import FormChamps from '@/components/FormChamps.vue'
import FilAriane from '@/components/FilAriane.vue'

export default {
  name: 'CreerUtilisateur',
  components: {
    Alerte,
    FormChamps,
    FilAriane
  },
  data() {
    return {
      champs: {
        utilisateur: {
          nom: { v: '', err: [] },
          prenom: { v: '', err: [] },
          motDePasse: { v: '', err: [] },
          email: { v: '', err: [] },
          dateNaissance: { v: '', err: [] }
        }
      },
      typeAlerte: 'Erreur'
    }
  },
  apollo: {
    moi: {
      query: Utilisateur,
      result: checkPermissions(['GESTION_UTILISATEUR'])
    }
  },

  methods: {
    checkForm() {
      this.$refs.erreurs.viderAlerte()
      this.typeAlerte = 'Erreur'
      let tousRemplis = true
      let tousValides = true

      // On vérifie que les champs obligatoires sont remplis
      for (const el in this.champs.utilisateur) {
        // Réinitialisation des erreurs
        this.champs.utilisateur[el].err = []
        if (this.champs.utilisateur[el].v === '') {
          this.champs.utilisateur[el].err.push('Champs vide.')
          tousRemplis = false
        }
      }
      if (this.champs.utilisateur.email.v && !isEmail(this.champs.utilisateur.email.v)) {
        this.champs.utilisateur.email.err.push('Adresse email invalide.')
        tousValides = false
      }

      if (!tousRemplis) this.$refs.erreurs.ajouterAlerte('Tous les champs sont obligatoires.')
      if (!tousValides) this.$refs.erreurs.ajouterAlerte('Certains champs sont invalides.')
      return tousRemplis && tousValides
    },

    // Charger une erreur GraphQL envoyée par Apollo dans la liste des erreurs
    chargerErreur(errorObject) {
      const { gqlError } = errorObject
      if (!gqlError) return console.error(errorObject)

      // TODO: Code VALIDATION_ECHOUEE côté serveur à ajouter
      // // Un ou plusieurs champs sont invalides
      // if (gqlError.extensions.code === 'VALIDATION_ECHOUEE')
      //   gqlError.extensions.exception.props.champs.forEach(x =>
      //     (this.form[x.nom] && this.form[x.nom].err.push(x.message)))

      // Affichage de l'erreur dans l'alerte
      this.$refs.erreurs.viderAlerte()
      this.typeAlerte = 'Erreur'
      this.$refs.erreurs.ajouterAlerte(gqlError.message)
    },

    utilisateurCree({ data: { creerUtilisateur } }) {
      // Reset des champs de formulaire
      for (const el in this.champs.utilisateur) {
        this.champs.utilisateur[el].v = ''
        this.champs.utilisateur[el].err = []
      }

      this.$refs.erreurs.viderAlerte()
      this.typeAlerte = 'Succès'
      this.$refs.erreurs.ajouterAlerte(`L'utilisateur "${creerUtilisateur.prenom} ${creerUtilisateur.nom}" a été créé.`)
    }
  }
}
</script>
