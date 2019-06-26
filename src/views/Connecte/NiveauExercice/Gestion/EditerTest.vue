<template>
  <div class="ui text vertical segment container">
    <!-- Erreur de chargement de la page -->
    <div v-if="erreurLoadingTest" class="ui text vertical segment container">
      <router-link to="/NiveauExercice/niveau/liste" class="ui button left labeled icon" tag="button">
        <i class="left arrow icon"></i>
        Retour à la liste des niveaux
      </router-link>
      <Alerte type-alerte="Erreur" :liste-msg="[erreurLoadingTest]" :fermable="false" />
    </div>
    <!--/ Erreur de chargement de la page -->

    <!-- Ecran de chargement de la page -->
    <div v-else-if="!erreurLoadingTest && $apollo.queries.exercice.loading" class="ui text vertical segment container loading"></div>
    <!--/ Ecran de chargement de la page -->

    <!-- Alerte de notification de test supprimé -->
    <div v-else-if="testSupprime" class="ui text vertical segment container">
      <router-link :to="`/NiveauExercice/exercice/${testSupprimeAppartientAExercice}`" class="ui button left labeled icon" tag="button">
        <i class="left arrow icon"></i>
        Retour à l'exercice {{ testSupprimeAppartientAExercice }}
      </router-link>
      <Alerte type-alerte="Succès" :liste-msg="[testSupprime]" :fermable="false" />
    </div>
    <!--/ Alerte de notification de test supprimé -->

    <!-- Contenu de la page -->
    <div v-else>
      <!-- Modal de confirmation de suppression de test -->
      <sui-modal v-model="modalConfirmationSuppression" class="bgTransparent">
        <sui-modal-header>Supprimer le test "{{ exercice.tests[testIndex].nom }}"</sui-modal-header>
        <sui-modal-content>
          <sui-modal-description>
            <sui-header>Êtes-vous sûr de vouloir supprimer ce test ?</sui-header>
            <p>Cette action est irréversible.</p>
          </sui-modal-description>
        </sui-modal-content>
        <sui-modal-actions>
          <sui-button secondary @click.native="modalConfirmationSuppression = false">Annuler</sui-button>
          <sui-button negative @click.native="supprimerTest">Valider la suppression</sui-button>
        </sui-modal-actions>
      </sui-modal>
      <!--/ Modal de confirmation de suppression de test -->

      <!-- Fil d'ariane -->
      <FilAriane :items="[
        { txt: 'Liste des niveaux', to: '/NiveauExercice/niveau/liste' },
        { txt: `Niveau : ${exercice.niveau.id}`, to: `/NiveauExercice/niveau/${exercice.niveau.id}` },
        { txt: `Exercice : ${exercice.id}`, to: `/NiveauExercice/exercice/${exercice.id}` },
        `Test : ${exercice.tests[testIndex].id}`
      ]"
      />
      <!--/ Fil d'ariane -->

      <h1 class="ui center aligned header">
        Edition de test
        <h3>"{{ exercice.tests[testIndex].nom }}"</h3>
      </h1>

      <!-- Formulaire d'édition du test -->
      <div class="ui container segment stripe">
        <ApolloMutation
          :mutation="require('@/graphql/NiveauExercice/EditerTest.gql')"
          :variables="{
            id: idTest,
            modifications: {
              nom: exercice.tests[testIndex].nom,
              entree: exercice.tests[testIndex].entree,
              sortie: exercice.tests[testIndex].sortie,
              // exerciceId: champs.test.exercice.v
              // TODO: Changement d'exercice d'un test - https://github.com/Minigugus/CodinSchool/issues/45
            }
          }"
          @error="chargerErreur"
          @done="testModif"
        >
          <template slot-scope="{ mutate, loading }">
            <form @submit.prevent="checkForm() && mutate()" :class="{ loading }" class="ui form" novalidate>
              <form-champs
                v-model="exercice.tests[testIndex].id"
                nom="Identifiant"
                id="id"
                :err="champs.test.id.err"
                disabled
              />
              <!-- Champs id bloqué : https://github.com/Minigugus/CodinSchool/issues/20 -->

              <form-champs
                v-model="exercice.tests[testIndex].nom"
                nom="Nom"
                id="nom"
                :err="champs.test.nom.err"
              />

              <div class="field" :class="{ error: champs.test.exercice.err.length > 0 }">
                <label>Exercice</label>
                <select class="ui dropdown" v-model="champs.test.exercice.v">
                  <option>-</option>
                  <template v-for="(aNiveau, index) in niveaux">
                    <option v-for="(aExercice, indexExo) in aNiveau.exercices" :value="aExercice.id" :key="`option-${index}-${indexExo}`">
                      {{ aExercice.titre }} (Niveau "#{{ aNiveau.id }}" / Exercice "#{{ aExercice.id }}")
                    </option>
                  </template>
                </select>
                <div v-for="(anError, index) in champs.test.exercice.err" :key="'erreur-exercice-' + index" class="ui basic red pointing prompt label transition">{{ anError }}</div>
              </div>

              <form-champs
                v-model="exercice.tests[testIndex].entree"
                nom="Entrée"
                id="entree"
                :err="champs.test.entree.err"
              />

              <form-champs
                v-model="exercice.tests[testIndex].sortie"
                nom="Sortie"
                id="sortie"
                :err="champs.test.sortie.err"
              />

              <button
                class="ui button"
                type="submit"
              >
                Modifier le test
              </button>
            </form>

            <Alerte ref="erreurs" :type-alerte="typeAlerte" />
          </template>
        </ApolloMutation>
      </div>
      <!--/ Formulaire d'édition du test -->

      <!-- Bouton de suppression du test -->
      <div class="text-center mt-4">
        <button @click="modalConfirmationSuppression = true" class="ui button negative right labeled icon text-center">
          <i class="trash alternate icon"></i>
          Supprimer le test
        </button>
      </div>
      <!--/ Bouton de suppression du test -->
    </div>
  </div>
</template>

<script>
import Utilisateur from '@/graphql/Utilisateur/Utilisateur.gql'
import { checkPermissions } from '@/functions'

import Alerte from '@/components/Alerte.vue'
import FormChamps from '@/components/FormChamps.vue'
import FilAriane from '@/components/FilAriane.vue'

import NiveauxExercices from '@/graphql/NiveauExercice/NiveauxExercices.gql'
import Exercice from '@/graphql/NiveauExercice/Exercice.gql'
import SupprimerTest from '@/graphql/NiveauExercice/SupprimerTest.gql'

export default {
  name: 'EditerTest',
  components: {
    Alerte,
    FormChamps,
    FilAriane
  },
  props: {
    idExercice: {
      type: String,
      required: true
    },
    idTest: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      erreurLoadingTest: false,

      typeAlerte: 'Erreur',

      testIndex: -1,
      champs: {
        test: {
          id: { err: [] },
          nom: { err: [] },
          entree: { err: [] },
          sortie: { err: [] },
          exercice: { v: '-', err: [] }
        }
      },

      modalConfirmationSuppression: false,
      testSupprime: false,
      testSupprimeAppartientAExercice: ''
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
        variables: {
          id: this.idExercice
        },
        error: errorObject => {
          const { gqlError } = errorObject
          if (!gqlError) return console.error(errorObject)
          this.erreurLoadingTest = gqlError.message
        },
        result({ data, loading }) {
          // Pendant le chargement du test, vérifier si l'id d'exercice passé
          // en paramètre existe. Si oui, l'appliquer dans le champs <select>
          if (!loading) {
            const testIndex = data.exercice.tests.findIndex(x => x.id === this.idTest)
            if (testIndex !== -1) {
              // Le test existe, recopier son index dans une variable pour y accéder directement
              this.champs.test.exercice.v = this.idExercice
              this.testIndex = testIndex
            }
            else this.erreurLoadingTest = `Le test à éditer n'a pas été trouvé pour l'exercice ${this.idExercice}.`
          }
        }
      }
    }
  },

  methods: {
    checkForm() {
      this.$refs.erreurs.viderAlerte()
      this.typeAlerte = 'Erreur'
      let tousRemplis = true
      for (const el in this.exercice.tests[this.idTest]) {
        this.champs.test[el].err = []
        if (this.exercice.tests[this.idTest][el] === '') {
          this.champs.test[el].err.push('Champs vide.')
          tousRemplis = false
        }
      }
      if (this.champs.test.exercice.v === '-') {
        this.champs.test.exercice.err.push('Veuillez sélectionner un exercice.')
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
      // Un ou plusieurs champs sont invalides
      if (gqlError.extensions.code === 'VALIDATION_ECHOUEE')
        gqlError.extensions.exception.props.champs.forEach(x =>
          (this.champs.test[x.nom] && this.champs.test[x.nom].err.push(x.message)))

      // Affichage de l'erreur dans l'alerte
      this.$refs.erreurs.viderAlerte()
      this.typeAlerte = 'Erreur'
      this.$refs.erreurs.ajouterAlerte(gqlError.message)
    },

    async supprimerTest() {
      const apolloClient = this.$apollo.provider.defaultClient

      await apolloClient.mutate({
        mutation: SupprimerTest,
        variables: {
          id: this.idTest
        },
        update: store => {
          this.modalConfirmationSuppression = false
          this.testSupprime = `Le test "${this.idTest}" a été supprimé.`
          this.testSupprimeAppartientAExercice = this.idExercice
        }
      }
      )
    },

    // Appliquer la modification en cache
    testModif() {
      this.$refs.erreurs.viderAlerte()
      this.typeAlerte = 'Succès'
      this.$refs.erreurs.ajouterAlerte(`Le test "${this.idTest}" a été modifié.`)
    }
  }
}
</script>

<style scoped>
.bgTransparent {
  background-color: transparent !important;
}
</style>

