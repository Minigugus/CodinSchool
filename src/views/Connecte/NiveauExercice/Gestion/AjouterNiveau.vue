<template>
  <div class="ui container">
    <!-- Fil d'ariane -->
    <FilAriane :items="[
      { txt: 'Liste des niveaux', to: '/NiveauExercice/niveau/liste' },
      `Ajouter un niveau`
    ]"
    />
    <!--/ Fil d'ariane -->

    <h2 class="text-center">Ajouter un niveau</h2>

    <div class="ui container segment stripe">
      <!-- Formulaire d'ajout de niveau -->
      <ApolloMutation
        :mutation="require('@/graphql/NiveauExercice/CreerNiveau.gql')"
        :variables="{
          niveau: {
            id: champs.id.v,
            titre: champs.titre.v,
            introduction: champs.introduction.v
          }
        }"

        @error="chargerErreur"
        @done="niveauCree"
      >
        <template v-slot="{ mutate, loading }">
          <form @submit.prevent="checkForm() && mutate()" :class="{ loading }" class="ui form" novalidate>
            <form-champs
              v-model="champs.id.v"
              nom="Identifiant"
              id="identifiant"
              :err="champs.id.err"
            />

            <form-champs
              v-model="champs.titre.v"
              nom="Titre"
              id="titre"
              :err="champs.titre.err"
              placeholder="Structures de données"
            />

            <form-champs
              tag="texteditor"
              v-model="champs.introduction.v"
              nom="Introduction"
              id="introduction"
              :err="champs.introduction.err"
            />

            <button class="ui button" type="submit">Ajouter le niveau</button>
          </form>

          <Alerte ref="erreurs" :type-alerte="typeAlerte" />
        </template>
      </ApolloMutation>
    <!--/ Formulaire d'ajout de niveau -->
    </div>
  </div>
</template>

<script>
import Utilisateur from '@/graphql/Utilisateur/Utilisateur.gql'
import { checkPermissions } from '@/functions'

import Alerte from '@/components/Alerte.vue'
import FormChamps from '@/components/FormChamps.vue'
import FilAriane from '@/components/FilAriane.vue'

import Niveaux from '@/graphql/NiveauExercice/Niveaux.gql'

export default {
  name: 'AjouterNiveau',
  components: {
    Alerte,
    FormChamps,
    FilAriane
  },
  data() {
    return {
      champs: {
        id: { v: '', err: [] },
        titre: { v: '', err: [] },
        introduction: { v: '', err: [] }
      },
      typeAlerte: 'Erreur'
    }
  },
  apollo: {
    moi: {
      query: Utilisateur,
      result: checkPermissions(['GESTION_NIVEAU', 'GESTION_EXERCICE'])
    },
    // Chargement des niveaux si pas déjà en cache
    // (Evite erreur si user recharge la page sans passer par la liste des niveaux)
    niveaux: Niveaux
  },
  methods: {
    checkForm() {
      this.$refs.erreurs.viderAlerte()
      this.typeAlerte = 'Erreur'
      let tousRemplis = true
      for (const el in this.champs) {
        this.champs[el].err = []
        if (this.champs[el].v === '') {
          this.champs[el].err.push('Champs vide.')
          tousRemplis = false
        }
      }
      if (!tousRemplis)
        this.$refs.erreurs.ajouterAlerte('Tous les champs sont obligatoires.')

      return tousRemplis
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

    niveauCree({ data: { creerNiveau: nouveauNiveau } }) {
      const apolloClient = this.$apollo.provider.defaultClient
      // Lire le cache pour récupérer le contenu actuel
      const data = apolloClient.readQuery({ query: Niveaux })
      data.niveaux.push(nouveauNiveau)

      // Appliquer la modification en cache
      apolloClient.writeQuery({ query: Niveaux, data })

      this.$refs.erreurs.viderAlerte()
      this.typeAlerte = 'Succès'
      this.$refs.erreurs.ajouterAlerte(`Le niveau "${nouveauNiveau.id}" a été créé.`)
    }
  }
}
</script>
