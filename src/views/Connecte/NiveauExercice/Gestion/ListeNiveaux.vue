<template>
  <div class="ui text vertical segment container">
    <h2 class="text-center">Liste des niveaux</h2>

    <ApolloQuery :query="require('@/graphql/NiveauExercice/Niveaux.gql')">
      <template v-slot="{ result: { error, data }, isLoading }">
        <!-- Chargement -->
        <sui-loader v-if="isLoading" active centered inline />

        <!-- Erreur -->
        <div v-else-if="error">
          <Alerte :liste-msg="[error.message]" type-alerte="Erreur" :fermable="false" />
        </div>

        <!-- Result -->
        <div v-else-if="data" class="ui container">
          <ApolloMutation
            :mutation="require('@/graphql/NiveauExercice/ReorganiserNiveaux.gql')"
            :variables="{ niveaux: data.niveaux.map(x => x.id) }"
            :update="reorgUpdateCache"
          >
            <template v-slot="{ mutate, loading, gqlError }">
              <!-- Bouton de réorganisation des niveaux -->
              <div class="text-center">
                <transition name="fade" mode="out-in">
                  <button v-if="!niveau.sontDraggable" key="reorganiser" @click="niveau.sontDraggable = true" class="ui button primary right labeled icon">
                    <i class="right bars icon"></i>
                    Réorganiser les niveaux
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
              <!--/ Bouton de réorganisation des niveaux -->

              <sui-loader v-if="loading" active centered inline class="mt-3">Réorganisation ...</sui-loader>

              <!-- Liste des niveaux -->
              <sui-table v-else celled>
                <sui-table-header>
                  <sui-table-row text-align="center">
                    <sui-table-header-cell v-if="niveau.sontDraggable">#</sui-table-header-cell>
                    <sui-table-header-cell>id</sui-table-header-cell>
                    <sui-table-header-cell>titre</sui-table-header-cell>
                    <sui-table-header-cell>dateCreation</sui-table-header-cell>
                    <sui-table-header-cell v-if="!niveau.sontDraggable">Editer</sui-table-header-cell>
                  </sui-table-row>
                </sui-table-header>
                <draggable
                  :list="data.niveaux"
                  :animation="200"
                  group="niveau"
                  :disabled="!niveau.sontDraggable"
                  ghost-class="ghost"
                  tag="sui-table-body"
                >
                  <sui-table-row v-for="aNiveau in data.niveaux" :key="aNiveau.id" text-align="center">
                    <sui-table-cell v-if="niveau.sontDraggable"><i class="bars icon cursor-move" /></sui-table-cell>
                    <sui-table-cell v-text="aNiveau.id" text-align="center" />
                    <sui-table-cell v-text="aNiveau.titre" />
                    <sui-table-cell v-text="new Date(parseInt(aNiveau.dateCreation, 10)).toJSON()" />
                    <sui-table-cell v-if="!niveau.sontDraggable">
                      <router-link :to="`/NiveauExercice/niveau/${aNiveau.id}`" class="ui primary right labeled icon button mini">
                        <i class="edit icon"></i>
                        Editer
                      </router-link>
                    </sui-table-cell>
                  </sui-table-row>
                </draggable>
              </sui-table>

              <Alerte v-if="gqlError" :liste-msg="[gqlError.message]" type-alerte="Erreur" />
            <!--/ Liste des niveaux -->
            </template>
          </ApolloMutation>
        </div>
      </template>
    </ApolloQuery>

    <!-- Bouton d'ajout de niveau -->
    <div class="text-center mt-4">
      <router-link to="/NiveauExercice/niveau/ajouterNiveau/" class="ui button right labeled icon text-center" tag="button">
        <i class="plus icon"></i>
        Ajouter un niveau
      </router-link>
    </div>
    <!--/ Bouton d'ajout de niveau -->
  </div>
</template>

<script>
import Utilisateur from '@/graphql/Utilisateur/Utilisateur.gql'
import { checkPermissions } from '@/functions'

import draggable from 'vuedraggable'

import Niveaux from '@/graphql/NiveauExercice/Niveaux.gql'

export default {
  name: 'ListeNiveaux',
  components: {
    draggable
  },
  data() {
    return {
      niveau: {
        sontDraggable: false
      }
    }
  },

  apollo: {
    moi: {
      query: Utilisateur,
      result: checkPermissions(['GESTION_NIVEAU', 'GESTION_EXERCICE'])
    }
  },

  methods: {
    reorgUpdateCache(store, { data: { reorganiserNiveaux: nouvelleOrganisation } }) {
      this.niveau.sontDraggable = false

      // Lire le cache pour récupérer le contenu actuel
      const data = store.readQuery({ query: Niveaux })

      // Modifier le contenu actuel récupéré
      data.niveaux = nouvelleOrganisation

      // Appliquer la modification en cache
      store.writeQuery({ query: Niveaux, data })
    }
  }
}
</script>
