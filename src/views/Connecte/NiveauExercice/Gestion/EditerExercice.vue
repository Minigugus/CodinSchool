<template>
  <div class="ui container">
    <!-- Chargement -->
    <sui-loader v-if="$apollo.queries.exercice.loading" active centered inline />

    <!-- Erreur -->
    <div v-else-if="erreurLoadingExercice || exerciceSupprime">
      <template v-if="erreurLoadingExercice">
        <GoBack to="/NiveauExercice/niveau/liste" text="Retour à la liste des niveaux" />
        <Alerte :liste-msg="[erreurLoadingExercice]" type-alerte="Erreur" :fermable="false" />
      </template>
      <template v-else-if="exerciceSupprime">
        <GoBack :to="`/NiveauExercice/niveau/${exercice.niveau.id}`" :text="`Retour au niveau : ${exercice.niveau.id}`" />
        <Alerte :liste-msg="[`L'exercice : ${exercice.id} a été supprimé.`]" type-alerte="Succès" :fermable="false" />
      </template>
    </div>

    <div v-else class="ui container">
      <!-- Contenu de la page -->
      <!-- Modal de confirmation de suppression d'exercice -->
      <Modale
        header="Supprimer l'exercice"
        action="Valider la suppression"
        @validate="supprimerExercice"
        ref="modaleDeleteExercice"
      >
        <sui-header>Êtes-vous sûr de vouloir supprimer cet exercice ?</sui-header>
        <p>Cette action est irréversible.</p>
      </Modale>
      <!--/ Modal de confirmation de suppression d'exercice -->

      <!-- Fil d'ariane -->
      <FilAriane :items="[
        { txt: 'Liste des niveaux', to: '/NiveauExercice/niveau/liste' },
        { txt: `Niveau : ${exercice.niveau.titre}`, to: `/NiveauExercice/niveau/${exercice.niveau.id}` },
        `Exercice : ${exercice.titre }`
      ]"
      />
      <!--/ Fil d'ariane -->

      <h2 class="ui center aligned header">
        Edition d'exercice
        <h3>"{{ exercice.titre }}"</h3>
      </h2>

      <!-- Formulaire d'édition de l'exercice -->
      <div class="ui container segment stripe">
        <ApolloMutation
          :mutation="require('@/graphql/NiveauExercice/EditerExercice.gql')"
          :variables="{
            id: idExercice,
            exercice: {
              id: exercice.id,
              titre: exercice.titre,
              enonce: exercice.enonce,
              correction: exercice.correction,
              niveauId: champs.exercice.niveau.v
            }
          }"
          @error="chargerErreur"
          @done="exerciceModif"
        >
          <template v-slot="{ mutate, loading }">
            <form @submit.prevent="checkForm() && mutate()" :class="{ loading }" class="ui form" novalidate>
              <form-champs
                v-model="exercice.id"
                nom="Identifiant"
                id="id"
                :err="champs.exercice.id.err"
                disabled
              />
              <!-- Champs id bloqué : https://github.com/Minigugus/CodinSchool/issues/20 -->

              <form-champs
                v-model="exercice.titre"
                nom="Titre"
                id="titre"
                :err="champs.exercice.titre.err"
              />

              <div class="field" :class="{ error: champs.exercice.niveau.err.length > 0 }">
                <label>Niveau</label>

                <sui-dropdown
                  fluid
                  :options="niveaux.map(aNiveau => ({ text: `${aNiveau.titre} (#${aNiveau.id})`, value: aNiveau.id }))"
                  placeholder="Rôles"
                  search
                  selection
                  v-model="champs.exercice.niveau.v"
                />

                <div v-for="(anError, index) in champs.exercice.niveau.err" :key="'erreur-niveau-' + index" class="ui basic red pointing prompt label transition">{{ anError }}</div>
              </div>

              <form-champs
                tag="texteditor"
                v-model="exercice.enonce"
                nom="Enoncé"
                id="enonce"
                :err="champs.exercice.enonce.err"
              />

              <form-champs
                v-model="exercice.correction"
                tag="textarea"
                nom="Correction"
                id="correction"
                :err="champs.exercice.correction.err"
              />

              <button class="ui button" type="submit">Modifier l'exercice</button>
            </form>

            <Alerte ref="erreurs" :type-alerte="typeAlerte" />
          </template>
        </ApolloMutation>
      </div>
      <!--/ Formulaire d'édition de l'exercice -->

      <!-- Liste des tests -->
      <template v-if="exercice.tests.length === 0">
        <div class="ui container segment stripe text-center">
          Cet exercice ne contient aucun test.<br>
          <router-link :to="`/NiveauExercice/ajouterTest/${idExercice}`" class="underlineHover">
            Ajouter un test à l'exercice
          </router-link>
        </div>
      </template>
      <template v-else>
        <h2 class="ui center aligned header">Tests de l'exercice</h2>

        <ApolloMutation
          :mutation="require('@/graphql/NiveauExercice/ReorganiserTests.gql')"
          :variables="{
            exercice: exercice.id,
            tests: exercice.tests.map(x => x.id)
          }"
          :update="reorgUpdateCache"
        >
          <template v-slot="{ mutate, loading, gqlError }">
            <!-- Bouton de réorganisation des exercices -->
            <div class="text-center">
              <transition name="fade" mode="out-in">
                <button v-if="!test.sontDraggable" key="reorganiser" @click="test.sontDraggable = true" class="ui button primary right labeled icon">
                  <i class="right bars icon"></i>
                  Réorganiser les tests
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

            <sui-table v-else celled selectable>
              <sui-table-header>
                <sui-table-row text-align="center">
                  <sui-table-header-cell v-if="test.sontDraggable">#</sui-table-header-cell>
                  <sui-table-header-cell>Id</sui-table-header-cell>
                  <sui-table-header-cell>Nom</sui-table-header-cell>
                  <sui-table-header-cell>Entrée</sui-table-header-cell>
                  <sui-table-header-cell>Sortie</sui-table-header-cell>
                  <sui-table-header-cell v-if="!test.sontDraggable">Editer</sui-table-header-cell>
                </sui-table-row>
              </sui-table-header>
              <draggable
                :list="exercice.tests"
                :animation="200"
                group="test"
                :disabled="!test.sontDraggable"
                ghost-class="ghost"
                class="liste-test"
                tag="sui-table-body"
              >
                <sui-table-row v-for="aTest in exercice.tests" :key="`test-${aTest.id}`" text-align="center">
                  <sui-table-cell v-if="test.sontDraggable"><i class="bars icon cursor-move" /></sui-table-cell>
                  <sui-table-cell v-text="aTest.id" text-align="center" />
                  <sui-table-cell v-text="aTest.nom" />
                  <sui-table-cell v-text="aTest.entree" />
                  <sui-table-cell v-text="aTest.sortie" />
                  <sui-table-cell v-if="!test.sontDraggable">
                    <router-link :to="`/NiveauExercice/exercice/${idExercice}/test/${aTest.id}`" class="ui primary right labeled icon button mini">
                      <i class="edit icon"></i>
                      Editer
                    </router-link>
                  </sui-table-cell>
                </sui-table-row>
              </draggable>
            </sui-table>

            <Alerte v-if="gqlError" :liste-msg="[gqlError.message]" type-alerte="Erreur" />
          </template>
        </ApolloMutation>

        <!-- Bouton d'ajout de test -->
        <div v-if="!test.sontDraggable" class="text-center mt-2">
          <router-link :to="`/NiveauExercice/ajouterTest/${idExercice}`" class="ui button right labeled icon text-center" tag="button">
            <i class="plus icon"></i>
            Ajouter un test
          </router-link>
        </div>
        <!--/ Bouton d'ajout de test -->
      </template>
      <!--/ Liste des tests -->

      <!-- Bouton de suppression de l'exercice -->
      <div v-if="!test.sontDraggable" class="text-center mt-4">
        <button @click="$refs.modaleDeleteExercice.show()" class="ui button negative right labeled icon text-center">
          <i class="trash alternate icon"></i>
          Supprimer l'exercice
        </button>
      </div>
      <!--/ Bouton de suppression de l'exercice -->
    </div>
  </div>
</template>

<script>
import Utilisateur from '@/graphql/Utilisateur/Utilisateur.gql'
import { checkPermissions } from '@/functions'

import draggable from 'vuedraggable'
import Alerte from '@/components/Alerte.vue'
import Modale from '@/components/Modale.vue'
import GoBack from '@/components/GoBack.vue'
import FormChamps from '@/components/FormChamps.vue'
import FilAriane from '@/components/FilAriane.vue'

import NiveauxExercices from '@/graphql/NiveauExercice/NiveauxExercices.gql'
import Exercice from '@/graphql/NiveauExercice/Exercice.gql'
import SupprimerExercice from '@/graphql/NiveauExercice/SupprimerExercice.gql'

export default {
  name: 'EditerExercice',
  components: {
    draggable,
    Alerte,
    Modale,
    GoBack,
    FormChamps,
    FilAriane
  },
  props: {
    idExercice: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      erreurLoadingExercice: false,

      test: {
        sontDraggable: false
      },

      champs: {
        exercice: {
          id: { err: [] },
          titre: { err: [] },
          niveau: { v: '', err: [] },
          enonce: { err: [] },
          correction: { err: [] }
        }
      },
      typeAlerte: 'Erreur',

      exerciceSupprime: false
    }
  },
  apollo: {
    moi: {
      query: Utilisateur,
      result: checkPermissions(['GESTION_NIVEAU', 'GESTION_EXERCICE'])
    },
    niveaux: NiveauxExercices,
    exercice() {
      return {
        query: Exercice,
        variables: { id: this.idExercice },
        error: err => (this.erreurLoadingExercice = err.message),
        result({ data, loading }) {
          if (!loading && !this.erreurLoadingExercice) this.champs.exercice.niveau.v = data.exercice.niveau.id
        }
      }
    }
  },

  methods: {
    checkForm() {
      this.$refs.erreurs.viderAlerte()
      this.typeAlerte = 'Erreur'
      let tousRemplis = true
      for (const el in this.champs.exercice) {
        this.champs.exercice[el].err = []
        if (this.exercice[el] === '') {
          this.champs.exercice[el].err.push('Champs vide.')
          tousRemplis = false
        }
      }
      if (this.exercice.niveau.id === '-') {
        this.champs.exercice.niveau.err.push('Veuillez sélectionner un niveau.')
        tousRemplis = false
      }
      if (!tousRemplis) this.$refs.erreurs.ajouterAlerte('Tous les champs sont obligatoires.')

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

    supprimerExercice() {
      return this.$apollo.provider.defaultClient.mutate({
        mutation: SupprimerExercice,
        variables: { id: this.exercice.id },
        update: store => {
          // Lire le cache pour récupérer le contenu actuel
          const data = store.readQuery({ query: NiveauxExercices })
          const indexNiveau = data.niveaux.findIndex(x => x.id === this.exercice.niveau.id)
          if (indexNiveau !== -1) {
            const indexExercice = data.niveaux[indexNiveau].exercices.findIndex(x => x.id === this.exercice.id)
            if (indexExercice !== 1) {
              data.niveaux[indexNiveau].exercices.splice(indexExercice, 1)

              // Appliquer la modification en cache
              store.writeQuery({ query: NiveauxExercices, data })
              this.exerciceSupprime = true
            }
          }
        }
      }).catch(err => {
        console.error(err)
        this.$refs.erreurs.viderAlerte()
        this.typeAlerte = 'Erreur'
        this.$refs.erreurs.ajouterAlerte(err.message)
      })
    },

    exerciceModif({ data }) {
      const apolloClient = this.$apollo.provider.defaultClient

      try {
      // Lire le cache pour récupérer le contenu actuel
        const oldData = apolloClient.readQuery({ query: NiveauxExercices })
        const indexNiveau = oldData.niveaux.findIndex(x => x.id === this.exercice.niveau.id)
        const indexExercice = oldData.niveaux[indexNiveau].exercices.findIndex(x => x.id === this.exercice.id)
        oldData.niveaux[indexNiveau].exercices[indexExercice] = data.editerExercice

        // Appliquer la modification en cache
        apolloClient.writeQuery({ query: NiveauxExercices, data: oldData })

        this.$refs.erreurs.viderAlerte()
        this.typeAlerte = 'Succès'
        this.$refs.erreurs.ajouterAlerte(`L'exercice "${data.editerExercice.id}" a été modifié.`)
      }
      catch (err) {
        console.error(err)
        this.$refs.erreurs.viderAlerte()
        this.typeAlerte = 'Erreur'
        this.$refs.erreurs.ajouterAlerte(err.message)
      }
    },

    reorgUpdateCache(store, { data: { reorganiserTests: nouvelleOrganisation } }) {
      this.test.sontDraggable = false

      // Lire le cache pour récupérer le contenu actuel
      const data = store.readQuery({ query: Exercice, variables: { id: this.exercice.id } })

      // Modifier le contenu actuel récupéré
      data.exercice.tests = nouvelleOrganisation

      // Appliquer la modification en cache
      store.writeQuery({ query: Exercice, variables: { id: this.exercice.id }, data })
    }
  }
}
</script>
