<template>
  <div class="ui container">
    <!-- Chargement -->
    <sui-loader v-if="$apollo.queries.niveau.loading" active centered inline />

    <!-- Erreur -->
    <div v-else-if="erreurLoadingNiveau || niveauSupprime">
      <GoBack to="/NiveauExercice/niveau/liste" text="Retour à la liste des niveaux" />
      <Alerte :liste-msg="[erreurLoadingNiveau || `Le niveau : ${niveau.id} et les exercices lui étant associés ont été supprimés`]" type-alerte="Erreur" :fermable="false" />
    </div>

    <div v-else class="ui container">
      <!-- Modal de confirmation de suppression de niveau -->
      <Modale
        header="Supprimer le lniveau"
        action="Valider la suppression"
        @validate="supprimerNiveau(exercice)"
        ref="modaleDeleteNiveau"
      >
        <sui-header>Êtes-vous sûr de vouloir supprimer ce niveau ?</sui-header>
        <p>Cette action est irréversible.</p>
      </Modale>
      <!--/ Modal de confirmation de suppression de niveau -->

      <!-- Fil d'ariane -->
      <FilAriane :items="[
        { txt: 'Liste des niveaux', to: '/NiveauExercice/niveau/liste' },
        `Niveau : ${niveau.id }`
      ]"
      />
      <!--/ Fil d'ariane -->

      <h1 class="ui center aligned header">
        Edition de niveau
        <h3>"{{ niveau.titre }}"</h3>
      </h1>

      <!-- Formulaire d'édition du niveau -->
      <div class="ui container segment stripe">
        <p v-if="exercice.sontDraggable" class="text-center">
          Le niveau n'est pas éditable lorsque les exercices sont en cours de réorganisation.
        </p>

        <ApolloMutation
          :mutation="require('@/graphql/NiveauExercice/EditerNiveau.gql')"
          :variables="{
            id: idNiveau,
            niveau: {
              id: niveau.id,
              titre: niveau.titre,
              introduction: niveau.introduction
            }
          }"
          @error="chargerErreur"
          @done="rechargerNiveau"
        >
          <template v-slot="{ mutate, loading }">
            <form @submit.prevent="!exercice.sontDraggable && mutate()" :class="{ loading }" class="ui form" novalidate>
              <form-champs
                v-model="niveau.id"
                nom="Identifiant"
                id="id"
                :err="champs.niveau.id.err"
                disabled
              />
              <!-- :disabled="exercice.sontDraggable" https://github.com/Minigugus/CodinSchool/issues/20 -->

              <form-champs
                v-model="niveau.titre"
                nom="Titre"
                id="titre"
                :err="champs.niveau.titre.err"
                :disabled="exercice.sontDraggable"
              />

              <form-champs
                tag="texteditor"
                v-model="niveau.introduction"
                nom="Introduction"
                id="introduction"
                :err="champs.niveau.introduction.err"
                :disabled="exercice.sontDraggable"
              />

              <button
                class="ui button"
                type="submit"
                :class="{ disabled: exercice.sontDraggable }"
              >
                Modifier le niveau
              </button>
            </form>

            <Alerte ref="erreurs" :type-alerte="typeAlerte" />
          </template>
        </ApolloMutation>
      </div>
      <!--/ Formulaire d'édition du niveau -->

      <template v-if="niveau.exercices.length === 0">
        <div class="ui container segment stripe text-center">
          Ce niveau ne contient aucun exercice.<br>
          <router-link :to="`/NiveauExercice/ajouterExercice/${idNiveau}`" class="underlineHover">
            Ajouter un exercice au niveau
          </router-link>
        </div>
      </template>
      <template v-else>
        <h2 class="ui center aligned header">Exercices du niveau</h2>

        <ApolloMutation
          :mutation="require('@/graphql/NiveauExercice/ReorganiserExercices.gql')"
          :variables="{
            niveau: niveau.id,
            exercices: niveau.exercices.map(x => x.id)
          }"
          :update="reorgUpdateCache"
        >
          <template v-slot="{ mutate, loading, gqlError }">
            <!-- Bouton de réorganisation des exercices -->
            <div class="text-center">
              <transition name="fade" mode="out-in">
                <button v-if="!exercice.sontDraggable" key="reorganiser" @click="exercice.sontDraggable = true" class="ui button primary right labeled icon">
                  <i class="right bars icon"></i>
                  Réorganiser les exercices
                </button>
                <button
                  v-else
                  key="valider"
                  @click="mutate()"
                  class="ui button positive right labeled icon"
                  :disabled="loading"
                >
                  <i class="right check icon"></i>
                  Valider la réorganisation
                </button>
              </transition>
            </div>
            <!--/ Bouton de réorganisation des exercices -->

            <sui-loader v-if="loading" active centered inline class="mt-3">Réorganisation ...</sui-loader>

            <!-- Liste des exercices du niveau -->
            <sui-table v-else celled>
              <sui-table-header>
                <sui-table-row text-align="center">
                  <sui-table-header-cell v-if="exercice.sontDraggable">#</sui-table-header-cell>
                  <sui-table-header-cell>Id</sui-table-header-cell>
                  <sui-table-header-cell>Titre</sui-table-header-cell>
                  <sui-table-header-cell v-if="!exercice.sontDraggable">Editer</sui-table-header-cell>
                </sui-table-row>
              </sui-table-header>
              <draggable
                :list="niveau.exercices"
                :animation="200"
                group="exercice"
                :disabled="!exercice.sontDraggable"
                ghost-class="ghost"
                tag="sui-table-body"
              >
                <sui-table-row v-for="anExercice in niveau.exercices" :key="anExercice.id" text-align="center">
                  <sui-table-cell v-if="exercice.sontDraggable"><i class="bars icon cursor-move" /></sui-table-cell>
                  <sui-table-cell v-text="anExercice.id" text-align="center" />
                  <sui-table-cell v-text="anExercice.titre" />
                  <sui-table-cell v-if="!exercice.sontDraggable">
                    <router-link :to="`/NiveauExercice/exercice/${anExercice.id}`" class="ui primary right labeled icon button mini">
                      <i class="edit icon"></i>
                      Editer
                    </router-link>
                  </sui-table-cell>
                </sui-table-row>
              </draggable>
            </sui-table>

            <Alerte v-if="gqlError" :liste-msg="[gqlError.message]" type-alerte="Erreur" />
            <!--/ Liste des exercices du niveau -->
          </template>
        </ApolloMutation>

        <!-- Bouton d'ajout d'exercice -->
        <div v-if="!exercice.sontDraggable" class="text-center mt-4">
          <router-link :to="`/NiveauExercice/ajouterExercice/${idNiveau}`" class="ui button right labeled icon text-center" tag="button">
            <i class="plus icon"></i>
            Ajouter un exercice
          </router-link>
        </div>
        <!--/ Bouton d'ajout d'exercice -->
      </template>

      <!-- Bouton de suppression du niveau -->
      <div v-if="!exercice.sontDraggable" class="text-center mt-2">
        <button @click="$refs.modaleDeleteNiveau.show()" class="ui button negative right labeled icon text-center">
          <i class="trash alternate icon"></i>
          Supprimer le niveau
        </button>
      </div>
    <!--/ Bouton de suppression du niveau -->
    </div>
  </div>
</template>

<script>
import Utilisateur from '@/graphql/Utilisateur/Utilisateur.gql'
import { checkPermissions } from '@/functions'

import draggable from 'vuedraggable'
import Alerte from '@/components/Alerte.vue'
import FormChamps from '@/components/FormChamps.vue'
import FilAriane from '@/components/FilAriane.vue'
import Modale from '@/components/Modale.vue'
import GoBack from '@/components/GoBack.vue'

import Niveau from '@/graphql/NiveauExercice/Niveau.gql'
import Niveaux from '@/graphql/NiveauExercice/Niveaux.gql'
import SupprimerNiveau from '@/graphql/NiveauExercice/SupprimerNiveau.gql'

export default {
  name: 'EditerNiveau',
  components: {
    draggable,
    Alerte,
    FormChamps,
    FilAriane,
    Modale,
    GoBack
  },
  props: {
    idNiveau: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      erreurLoadingNiveau: false,

      champs: {
        niveau: {
          id: { err: [] },
          titre: { err: [] },
          introduction: { err: [] }
        }
      },
      exercice: {
        sontDraggable: false
      },

      typeAlerte: 'Erreur',
      modalConfirmationSuppression: false,
      niveauSupprime: false
    }
  },

  apollo: {
    moi: {
      query: Utilisateur,
      result: checkPermissions(['GESTION_NIVEAU', 'GESTION_EXERCICE'])
    },
    niveaux: Niveaux,
    niveau() {
      return {
        query: Niveau,
        variables: {
          id: this.idNiveau
        },
        error: errorObject => {
          const { gqlError } = errorObject
          if (!gqlError) return console.error(errorObject)
          this.erreurLoadingNiveau = gqlError.message
        }
      }
    }
  },

  methods: {
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

    // Formulaire validé, injection des données et mise à jour de l'url
    async rechargerNiveau({ data }) {
      this.$refs.erreurs.viderAlerte()
      const apolloClient = this.$apollo.provider.defaultClient

      // Mise à jour du cache du niveau
      apolloClient.writeQuery({
        query: Niveau,
        variables: {
          id: this.idNiveau
        },
        data: {
          niveau: {
            ...data.editerNiveau
          }
        }
      })

      // Mise à jour du cache de la liste des niveaux
      let listeData = apolloClient.readQuery({ query: Niveaux })
      const niveauModifie = listeData.niveaux.findIndex(x => x.id === this.idNiveau)
      if (niveauModifie !== -1) {
        listeData.niveaux[niveauModifie] = data.editerNiveau
        apolloClient.writeQuery({ query: Niveaux, data: listeData })
      }

      // Affichage d'une alerte de succès
      this.$refs.erreurs.ajouterAlerte('Le niveau a été modifié.')
      this.typeAlerte = 'Succès'

      // On modifie le props de l'idNiveau dans l'url
      this.$router.replace({ name: 'EditerNiveau', params: { idNiveau: data.editerNiveau.id } })
    },

    reorgUpdateCache(store, { data: { reorganiserExercices: nouvelleOrganisation } }) {
      this.exercice.sontDraggable = false

      // Lire le cache pour récupérer le contenu actuel
      const data = store.readQuery({ query: Niveau, variables: { id: this.niveau.id } })

      // Modifier le contenu actuel récupéré
      data.niveau.exercices = nouvelleOrganisation

      // Appliquer la modification en cache
      store.writeQuery({ query: Niveau, variables: { id: this.niveau.id }, data })
    },

    async supprimerNiveau() {
      await this.$apollo.provider.defaultClient.mutate({
        mutation: SupprimerNiveau,
        variables: { id: this.niveau.id },
        update: store => {
          // Lire le cache pour récupérer le contenu actuel
          const data = store.readQuery({ query: Niveaux })
          const index = data.niveaux.findIndex(x => x.id === this.niveau.id)
          if (index !== -1) {
            data.niveaux.splice(index, 1)
            // Appliquer la modification en cache
            store.writeQuery({ query: Niveaux, data })
            this.niveauSupprime = true
            return
          }
          console.error('Impossible de supprimer le niveau.')
        }})
    }
  }
}
</script>
