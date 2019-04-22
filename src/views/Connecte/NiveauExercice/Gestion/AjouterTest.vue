<template>
  <div class="ui container">
    <!-- Fil d'ariane -->
    <div class="ui large breadcrumb mb-2 mt-3">
      <router-link to="/NiveauExercice/niveau/liste" class="section">Liste des niveaux</router-link>
      <i class="right angle icon divider"></i>
      <template v-if="idExercice">
        <router-link :to="`/NiveauExercice/exercice/${idExercice}`" class="section">Exercice "{{ idExercice }}"</router-link>
        <i class="right arrow icon divider"></i>
      </template>
      <div class="active section">Ajouter un test</div>
    </div>
    <!--/ Fil d'ariane -->

    <div class="ui container segment stripe">
      <h2 class="ui center aligned header">
        <div class="content">
          Ajouter un test
        </div>
      </h2>

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
        <template slot-scope="{ mutate, loading }">
          <form @submit.prevent="checkForm() && mutate()" :class="{ loading }" class="ui form" novalidate>
            <form-champs v-model="champs.nom.v" nom="Nom" id="nom" :err="champs.nom.err" placeholder="Envoi d'entier" />

            <div class="field" :class="{ error: champs.exercice.err.length > 0 }">
              <label>Exercice</label>
              <select class="ui dropdown" v-model="champs.exercice.v">
                <option>-</option>
                <template v-for="(aNiveau, index) in niveaux">
                  <option v-for="(aExercice, indexExo) in aNiveau.exercices" :value="aExercice.id" :key="`option-${index}-${indexExo}`">
                    {{ aExercice.titre }} (Niveau "#{{ aNiveau.id }}" / Exercice "#{{ aExercice.id }}")
                  </option>
                </template>
              </select>
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
  </div>
</template>

<script>
import Utilisateur from '@/graphql/Utilisateur/Utilisateur.gql'
import { checkPermissions } from '@/functions'

import NiveauxExercices from '@/graphql/NiveauExercice/NiveauxExercices.gql'

import Alerte from '@/components/Alerte.vue'
import FormChamps from '@/components/FormChamps.vue'

export default {
  name: 'AjouterTest',
  components: {
    Alerte,
    FormChamps
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
    },
    niveaux: {
      query: NiveauxExercices,
      result({ data, loading }) {
        // Pendant le chargement des niveaux, vérifier si l'id d'exercice passé
        // en paramètre existe. Si oui, l'appliquer dans le champs <select>
        if (!loading && data.niveaux.find(x => x.exercices.find(y => y.id === this.idExercice)))
          this.champs.exercice.v = this.idExercice
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
          (this.form[x.nom] && this.form[x.nom].err.push(x.message)))

      // Affichage de l'erreur dans l'alerte
      this.$refs.erreurs.viderAlerte()
      this.typeAlerte = 'Erreur'
      this.$refs.erreurs.ajouterAlerte(gqlError.message)
    },

    testCree({ data }) {
      this.$refs.erreurs.viderAlerte()
      this.typeAlerte = 'Succès'
      this.$refs.erreurs.ajouterAlerte(`Le test "${data.creerTest.id}" a été ajouté à l'exercice "${this.champs.exercice.v}".`)
    }
  }
}
</script>
