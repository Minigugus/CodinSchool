<template>
  <div class="ui container">
    <div v-if="$apollo.queries.niveaux.loading" class="ui text vertical segment container loading"></div>
    <div v-else>
      <router-link :to="`/NiveauExercice/niveau/liste`" class="ui button left labeled icon" tag="button">
        <i class="left arrow icon"></i>
        Retour à la liste des niveaux
      </router-link>

      <h1 class="ui center aligned header">Réorganiser le contenu</h1>

      <!-- Vérification qu'il existe au moins 1 niveau -->
      <div v-if="niveaux.length === 0">
        L'application ne contient aucun niveau.
        <!-- Bouton d'ajout de niveau -->
        <div class="text-center">
          <router-link to="/NiveauExercice/niveau/ajouterNiveau/" class="ui button right labeled icon text-center" tag="button">
            <i class="plus icon"></i>
            Ajouter un niveau
          </router-link>
        </div>
      <!--/ Bouton d'ajout de niveau -->
      </div>
      <!--/ Vérification qu'il existe au moins 1 niveau -->

      <!-- Contenu de la page -->
      <div v-else>
        <div class="text-center mb-3">
          <transition name="fade" mode="out-in">
            <!-- Choix du contenu à réorganiser -->
            <div v-if="areButtonsVisible" key="choix-reorganisation">
              <h3 class="ui center aligned header">Quel contenu réorganiser ?</h3>

              <button @click="reorg.niveau = true" class="ui button primary">Niveaux</button>
              <button @click="reorg.exercice = true" class="ui button primary">Exercices</button>
              <button @click="reorg.test = true" class="ui button primary">Tests</button>
            </div>
            <!--/ Choix du contenu à réorganiser -->

            <!-- Bouton de validation de réorganisation -->
            <div v-else key="valider-reorganisation">
              <button @click="validerReorganisation" class="ui button positive right labeled icon">
                <i class="right check icon"></i>
                Valider la réorganisation
              </button>
            </div>
          <!--/ Bouton de validation de réorganisation -->
          </transition>
        </div>


        <!-- Contenu (Toujours visible) -->
        <!-- Liste des niveaux -->
        <draggable
          :list="niveaux"
          :animation="0"
          group="niveau"
          :disabled="!reorg.niveau"
          ghost-class="ghost"
          element="div"
          class="liste-niveau"
        >
          <transition-group name="flip-list">
            <sui-accordion v-for="aNiveau in niveaux" :key="`niveau-${aNiveau.id}`" exclusive styled>
              <sui-accordion-title>{{ aNiveau.titre }}</sui-accordion-title>

              <sui-accordion-content>
                <!-- Liste des exercices -->
                <draggable
                  :list="aNiveau.exercices"
                  :animation="0"
                  group="niveau"
                  :disabled="!reorg.exercice"
                  ghost-class="ghost"
                  element="div"
                  class="liste-niveau"
                >
                  <transition-group name="flip-list">
                    <sui-accordion v-for="anExercice in aNiveau.exercices" :key="`exercice-${anExercice.id}`" exclusive styled>
                      <sui-accordion-title>{{ anExercice.titre }}</sui-accordion-title>
                      <sui-accordion-content>
                        <!-- Liste des tests -->
                        <draggable
                          :list="anExercice.tests"
                          :animation="0"
                          group="niveau"
                          :disabled="!reorg.test"
                          ghost-class="ghost"
                          element="div"
                          class="liste-niveau"
                        >
                          <transition-group name="flip-list">
                            <sui-accordion v-for="aTest in anExercice.tests" :key="`test-${aTest.id}`" exclusive styled>
                              <sui-accordion-title>{{ aTest.nom }}</sui-accordion-title>
                            </sui-accordion>
                          </transition-group>
                        </draggable>
                        <!--/ Liste des tests -->
                      </sui-accordion-content>
                    </sui-accordion>
                  </transition-group>
                </draggable>
                <!--/ Liste des exercices -->
              </sui-accordion-content>
            </sui-accordion>
          </transition-group>
        </draggable>
        <!--/ Liste des niveaux -->
        <!--/ Contenu (Toujours visible) -->
      </div>
    </div>

    <!--/ Contenu de la page -->
  </div>
</template>

<script>
import Utilisateur from '@/graphql/Utilisateur/Utilisateur.gql'
import { checkPermissions } from '@/functions'

import draggable from 'vuedraggable'

import Contenu from '@/graphql/NiveauExercice/NiveauxExercicesTests.gql'
import Niveaux from '@/graphql/NiveauExercice/Niveaux.gql'
import ReorganiserNiveaux from '@/graphql/NiveauExercice/ReorganiserNiveaux.gql'
import ReorganiserExercices from '@/graphql/NiveauExercice/ReorganiserExercices.gql'

export default {
  name: 'Reorganiser',
  components: {
    draggable
  },
  data() {
    return {
      reorg: {
        niveau: false,
        exercice: false,
        test: false
      }
    }
  },

  apollo: {
    moi: {
      query: Utilisateur,
      result: checkPermissions(['GESTION_NIVEAU', 'GESTION_EXERCICE'])
    },
    niveaux: Contenu
  },
  computed: {
    areButtonsVisible() {
      return Object.values(this.reorg).every(x => x === false)
    }
  },

  methods: {
    validerReorganisation() {
      if (this.reorg.niveau) this.reorgNiveaux()
      else if (this.reorg.exercice) this.reorgExercices()
      else if (this.reorg.test) this.r
    },

    async reorgNiveaux() {
      const apolloClient = this.$apollo.provider.defaultClient

      // Mise à jour du cache
      await apolloClient.mutate({
        mutation: ReorganiserNiveaux,
        variables: {
          niveaux: this.niveaux.map(x => x.id)
        },
        update: (store, { data: { reorganiserNiveaux: nouvelleOrganisation } }) => {
          // Lire le cache pour récupérer le contenu actuel
          const data = store.readQuery({ query: Niveaux })

          // Modifier le contenu actuel récupéré
          data.niveaux = nouvelleOrganisation

          // Appliquer la modification en cache
          store.writeQuery({ query: Niveaux, data })
        }})
    },

    async reorgExercices() {
      // TODO: Multiple niveaux change
      // const apolloClient = this.$apollo.provider.defaultClient

      // // Mise à jour du cache
      // await apolloClient.mutate({
      //   mutation: ReorganiserExercices,
      //   variables: {
      //     niveau:
      //     exercices: this.exercices.map(x => x.id)
      //   },
      //   update: (store, { data: { ReorganiserExercices: nouvelleOrganisation } }) => {
      //     console.log(nouvelleOrganisation)
      //     // Lire le cache pour récupérer le contenu actuel
      //     const data = store.readQuery({ query: Niveaux })

      //     // Modifier le contenu actuel récupéré
      //     data.niveaux = nouvelleOrganisation

      //     // Appliquer la modification en cache
      //     store.writeQuery({ query: Niveaux, data })
      //   }})
    },

    async reorgTests() {
      // TODO: need back
    }
  }
}
</script>

<style scoped>
.flip-list-move {
  transition: transform 1s !important;
}
.liste-niveau .accordion {
  width: 100% !important;
  margin: 0 !important;
}
</style>
