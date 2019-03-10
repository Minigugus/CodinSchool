<template>
  <div class="ui container fluid">
    <!-- Erreur de chargement de la page -->
    <div v-if="erreurLoadingExercice" class="ui text vertical segment container">
      <router-link to="/listeExercices" class="ui button left labeled icon" tag="button">
        <i class="left arrow icon"></i>
        Retour à la liste des exercices
      </router-link>
      <Alerte type-alerte="Erreur" :liste-msg="[erreurLoadingExercice]" :fermable="false" />
    </div>
    <!--/ Erreur de chargement de la page -->

    <!-- Ecran de chargement de la page -->
    <div v-else-if="!erreurLoadingExercice && $apollo.queries.exercice.loading" class="ui text vertical segment container loading"></div>
    <!--/ Ecran de chargement de la page -->

    <div v-else>
      <!-- Fil d'ariane -->
      <div class="ui large breadcrumb mt-3">
        <router-link to="/listeExercices" class="section">Liste des exercices</router-link>
        <i class="right arrow icon divider"></i>
        <div class="active section">Faire exercice "{{ exercice.titre }}"</div>
      </div>
      <!--/ Fil d'ariane -->

      <h2 class="ui header">
        <div class="content">
          Niveau "{{ exercice.niveau.titre }}" - "{{ exercice.titre }}"
        </div>
      </h2>

      <div class="ui two column doubling stackable grid container contenu my-3">
        <div class="column">
          <div class="ui container segment description">
            <h2>Consigne</h2>
            <!-- <div v-html="exercice.enonce" />--> <!--eslint-disable-line -->
            <!-- TODO: Vrai énoncé (test car sur cette branche max char = 255) -->
            <div v-html="TEMP_ENONCE" class="ui container segment" /> <!-- eslint-disable-line -->
          </div>
          <div class="ui container segment retour-code"></div>
          <div class="ui container segment retour-tests"></div>
        </div>
        <div class="column">
          <div class="ui container segment code">
            <sui-dropdown
              v-model="langageProgrammation"
              fluid
              :options="options"
              placeholder="Liste des langages"
              search
              selection
            />
            <form-champs
              v-model="champs.code.v"
              tag="codeeditor"
              nom="Editeur de code"
              id="editeurCode"
              class="mt-2"
              :type="langageProgrammation"
              :err="champs.code.err"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'highlight.js/styles/monokai.css'

import Utilisateur from '@/graphql/Utilisateur/Utilisateur.gql'
import Exercice from '@/graphql/NiveauExercice/Exercice.gql'

import Alerte from '@/components/Alerte.vue'
import FormChamps from '@/components/FormChamps.vue'
import { codeMirrorLanguages } from '@/codeMirrorLanguagesLoader'
const options = Object.keys(codeMirrorLanguages).map(key => ({ text: key, value: key }))

export default {
  name: 'FaireExercice',
  components: {
    FormChamps,
    Alerte
  },
  props: {
    idExercice: {
      type: String,
      required: true
    }
  },

  apollo: {
    moi: Utilisateur,
    exercice() {
      return {
        query: Exercice,
        variables: {
          id: this.idExercice
        }
      }
    }
  },

  data() {
    return {
      TEMP_ENONCE: '<h1>Partie 1 :</h1><p>Aujourd\'hui, nous apprenons la triste nouvelle que le membre du projet <em>CodinSchool, \"</em>Minigugus\", n\'a pas codé pour le projet de tout le week end.</p><p><strong>Objectif :</strong></p><p>Sortir tous les nombres de 1 à 48 suivis de la lettre \"h\", afin de lui faire ouvrir les yeux sur les heures perdues pour le projet.</p><p><br></p><h1>Partie 2 :</h1><p>Malheureusement, cela ne suffira pas.Afin de la motiver à se bouger le cul il faut maintenant lui mettre la <strong>pression</strong>.</p><p><strong>Objectif :</strong></p><p>Créer un script affichant le nombre de jours restant avant le jour de rendu du rapport de projet.</p><p><br></p><h3>Obtenir la date en JavaScript :</h3><pre class=\"ql-syntax\" spellcheck=\"false\"><span class=\"hljs-built_in\">var</span> <span class=\"hljs-built_in\">date</span> = <span class=\"hljs-literal\">new</span> <span class=\"hljs-built_in\">Date</span>()\n</pre>',

      erreurLoadingExercice: false,
      langageProgrammation: 'C',
      options,

      champs: {
        // TODO: dropdown avec query langages disponible
        langagesDisponibles: [
          'JavaScript',
          'C'
        ],
        code: { v: '', err: [] }
      }
    }
  }
}
</script>

<style scoped>
.ui.container.fluid {
  width: 90%;
  padding: 10px;
}
.contenu.ui.grid.container {
  width: 100% !important;
}

.enonce {
  border: 1px solid #f4f4f4;
}
</style>
<style>
.ql-syntax {
  background-color: #23241f !important;
  color: #f8f8f2 !important;
  overflow: visible !important;
  white-space: pre-wrap !important;
  margin-bottom: 5px !important;
  margin-top: 5px !important;
  padding: 5px 10px !important;
}
</style>
