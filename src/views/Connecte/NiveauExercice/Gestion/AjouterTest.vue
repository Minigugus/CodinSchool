<template>
  <div class="ui container">
    <!-- Fil d'ariane -->
    <FilAriane :items="[
      { txt: 'Liste des niveaux', to: '/NiveauExercice/niveau/liste' },
      idExercice ? { txt: `Niveau : ${idExercice}`, to: `/NiveauExercice/exercice/${idExercice}` } : undefined,
      `Ajouter un test`
    ]"
    />
    <!--/ Fil d'ariane -->

    <div class="ui container segment stripe">
      <h2 class="text-center">Ajouter un test</h2>

      <!-- Si l'exercice passé en paramètre d'URL existe, le sélectionner dans le choix d'exercice -->
      <ApolloQuery
        :query="require('@/graphql/NiveauExercice/NiveauxExercices.gql')"
        @result="!$event.loading && !$event.error
          && $event.fullData.niveaux.find(x => x.exercices.find(y => y.id === idExercice))
          && (champs.exercice.v = idExercice)"
      >
        <template v-slot="{ result: { error, data }, isLoading }">
          <!-- Chargement -->
          <sui-loader v-if="isLoading" active centered inline />

          <!-- Erreur -->
          <div v-else-if="error">
            <Alerte :liste-msg="[error.message]" type-alerte="Erreur" :fermable="false" />
          </div>

          <!-- Result -->
          <div v-else-if="data" class="ui container">
            <!-- Formulaire d'ajout de test -->
            <ApolloMutation
              :mutation="require('@/graphql/NiveauExercice/CreerTest.gql')"
              :variables="{
                exercice: champs.exercice.v,
                test: {
                  nom: champs.nom.v,
                  entree: champs.entree.v,
                  sortie: champs.sortie.v
                }
              }"
              @error="chargerErreur"
              @done="testCree"
            >
              <template v-slot="{ mutate, loading }">
                <form @submit.prevent="checkForm() && mutate()" :class="{ loading }" class="ui form" novalidate>
                  <form-champs v-model="champs.nom.v" nom="Nom" id="nom" :err="champs.nom.err" placeholder="Envoi d'entier" />

                  <div class="field" :class="{ error: champs.exercice.err.length > 0 }">
                    <label>Exercice</label>

                    <sui-dropdown
                      fluid
                      :options="selectExerciceOptions(data.niveaux)"
                      placeholder="Exercice"
                      search
                      selection
                      v-model="champs.exercice.v"
                    />

                    <div v-for="(anError, index) in champs.exercice.err" :key="'erreur-exercice-' + index" class="ui basic red pointing prompt label transition">{{ anError }}</div>
                  </div>

                  <form-champs
                    v-model="champs.entree.v"
                    nom="Entrée"
                    id="entree"
                    :err="champs.entree.err"
                  />

                  <form-champs
                    v-model="champs.sortie.v"
                    nom="Sortie"
                    id="sortie"
                    :err="champs.sortie.err"
                  />

                  <button class="ui button" type="submit">Ajouter le test</button>
                </form>

                <Alerte ref="erreurs" :type-alerte="typeAlerte" />
              </template>
            </ApolloMutation>
            <!--/ Formulaire d'ajout de test -->
          </div>
        </template>
      </ApolloQuery>
    </div>
  </div>
</template>

<script>
import Utilisateur from '@/graphql/Utilisateur/Utilisateur.gql'
import { checkPermissions } from '@/functions'

import Alerte from '@/components/Alerte.vue'
import FormChamps from '@/components/FormChamps.vue'
import FilAriane from '@/components/FilAriane.vue'

export default {
  name: 'AjouterTest',
  components: {
    Alerte,
    FormChamps,
    FilAriane
  },
  props: {
    idExercice: {
      type: String,
      required: false,
      default: null
    }
  },
  data() {
    return {
      champs: {
        nom: { v: '', err: [] },
        entree: { v: '', err: [] },
        sortie: { v: '', err: [] },
        exercice: { v: '-', err: [] }
      },
      typeAlerte: 'Erreur'
    }
  },
  apollo: {
    moi: {
      query: Utilisateur,
      result: checkPermissions(['GESTION_NIVEAU', 'GESTION_EXERCICE'])
    }
  },

  computed: {
    selectExerciceOptions() {
      return niveaux => {
        let options = []
        niveaux.map(aNiveau => aNiveau.exercices.map(anExercice =>
          (options.push({ text: `${anExercice.titre} (Niveau : #${aNiveau.id} / Exercice : #${anExercice.id})`, value: anExercice.id }))))
        return options
      }
    }
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
      if (this.champs.exercice.v === '-') {
        this.champs.exercice.err.push('Veuillez sélectionner un exercice.')
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
          (this.champs[x.nom] && this.champs[x.nom].err.push(x.message)))

      // Affichage de l'erreur dans l'alerte
      this.$refs.erreurs.viderAlerte()
      this.typeAlerte = 'Erreur'
      this.$refs.erreurs.ajouterAlerte(gqlError.message)
    },

    testCree({ data }) {
      this.$refs.erreurs.viderAlerte()
      this.typeAlerte = 'Succès'
      this.$refs.erreurs.ajouterAlerte(`Le test "${data.creerTest.nom}" a été ajouté à l'exercice "${this.champs.exercice.v}".`)
    }
  }
}
</script>
