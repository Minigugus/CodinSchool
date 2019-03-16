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
        <!-- Bloc de gauche -->
        <div class="column">
          <!-- Bloc d'énoncé -->
          <div class="ui container segment description">
            <div class="ui grid">
              <div class="two column row">
                <div class="left floated column">
                  <h2>Enoncé</h2>
                </div>
                <div class="right floated column">
                  <div class="ui text-right">
                    <button @click="copierDivPressePapier('#enonce', $event)" class="ui button labeled icon tiny">
                      <i class="clone icon"></i>
                      Copier
                    </button>
                    <button @click="copierPressePapier(TEMP_ENONCE, $event)" class="ui button labeled icon tiny">
                      <i class="clone icon"></i>
                      Copier HTML
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <!-- TODO: Vrai énoncé (test car sur cette branche max char = 255) -->
            <div v-html="escapeHtml(TEMP_ENONCE)" class="ui container segment" id="enonce" /> <!--eslint-disable-line -->
          </div>
          <!--/ Bloc d'énoncé -->

          <!-- Bloc de retour de tests -->
          <div class="ui container segment retour-tests">
            <div class="ui grid mb-1">
              <div class="two column row">
                <div class="left floated column">
                  <h2>Tests à valider</h2>
                </div>
                <div class="right floated column">
                  <div class="ui text-right">
                    <button
                      @click="lancerTests"
                      class="ui button labeled icon tiny"
                      :class="{
                        loading: testsLoading,
                        primary: !testsLoading
                      }"
                    >
                      <i class="terminal icon"></i>
                      Tester mon code
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Liste des tests -->
            <sui-accordion styled fluid class="mb-3">
              <div v-for="(aTest, index) in TEMP_TESTS" :key="'test-' + index">
                <sui-accordion-title class="test-title">
                  <span>
                    <sui-icon :name="aTest.nom.length > 60 ? 'dropdown' : 'arrow right'" />
                    {{ aTest.nom.slice(0, 60) }} {{ aTest.nom.length > 60 ? '...' : '' }}
                  </span>
                  <span>
                    <button
                      class="ui right floated icon button mini"
                      :class="{
                        orange: aTest.loading,
                        loading: aTest.loading,
                        green: !aTest.loading && aTest.reussi,
                        red: !aTest.loading && !aTest.reussi
                      }"
                    >
                      <i
                        class="icon"
                        :class="{
                          check: !aTest.loading && aTest.reussi,
                          close: !aTest.loading && !aTest.reussi
                        }"
                      />
                    </button>
                  </span>
                </sui-accordion-title>
                <sui-accordion-content v-if="aTest.nom.length > 60">
                  <p v-text="aTest.nom" />
                </sui-accordion-content>
              </div>
            </sui-accordion>
            <!--/ Liste des tests -->
            <sui-progress
              state="active"
              indicating
              :percent="testsCompletion"
              :label="`Complétion de l'exercice - ${testsCompletion}%`"
            />
          </div>
          <!--/ Bloc de retour de tests -->
        </div>
        <!--/ Bloc de gauche -->

        <!-- Bloc de droite -->
        <div class="column">
          <!-- Bloc de l'éditeur de code -->
          <div class="ui container segment code">
            <div class="ui grid mb-1">
              <div class="two column row">
                <div class="left floated column">
                  <h2>Editeur de code</h2>
                </div>
                <div class="right floated column">
                  <div class="ui text-right">
                    <button @click="copierPressePapier(champs.code.v, $event)" class="ui button labeled icon tiny">
                      <i class="clone icon"></i>
                      Copier le code
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <sui-dropdown
              v-model="langageProgrammation"
              fluid
              :options="TEMP_LANGAGES_DISPONIBLES"
              placeholder="Liste des langages autorisés"
              search
              selection
            />
            <div id="editeurCode">
              <form-champs
                v-model="champs.code.v"
                tag="codeeditor"
                class="mt-2"
                :type="langageProgrammation"
                :err="champs.code.err"
              />
            </div>
          </div>
          <!--/ Bloc de l'éditeur de code -->

          <!-- Bloc de retour de code -->
          <div class="ui container segment retour-code form">
            <div class="ui grid mb-1">
              <div class="two column row">
                <div class="left floated column">
                  <h2>Résultat d'exécution de code</h2>
                </div>
                <div class="right floated column">
                  <div class="ui text-right">
                    <transition name="fade">
                      <button
                        v-show="TEMP_RETOUR_CODE !== ''"
                        @click="copierPressePapier(TEMP_RETOUR_CODE, $event)"
                        class="ui button labeled icon tiny"
                      >
                        <i class="clone icon"></i>
                        Copier
                      </button>
                    </transition>
                    <button @click="TEMP_RETOUR_CODE = ''" class="ui button labeled icon tiny">
                      <i class="trash icon"></i>
                      Vider
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="field">
              <textarea v-model="TEMP_RETOUR_CODE" class="field" placeholder="Le résultat de votre code ou les erreurs s'afficheront ici." />
            </div>
          </div>
          <!--/ Bloc de retour de code -->
        </div>
        <!--/ Bloc de droite -->
      </div>
    </div>
  </div>
</template>

<script>
import 'highlight.js/styles/monokai.css'

import Exercice from '@/graphql/NiveauExercice/Exercice.gql'

import Alerte from '@/components/Alerte.vue'
import FormChamps from '@/components/FormChamps.vue'
import { delay, escapeHtml, copierVersPressePapier, copierDOMVersPressePapier } from '@/functions'

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
    exercice() {
      return {
        query: Exercice,
        variables: {
          id: this.idExercice
        },
        error: errorObject => {
          const { gqlError } = errorObject
          if (!gqlError) return console.error(errorObject)
          this.erreurLoadingExercice = gqlError.message
        }
      }
    }
  },

  data() {
    return {
      TEMP_ENONCE: '<h1>Partie 1 :</h1><p>Aujourd\'hui, nous apprenons la triste nouvelle que le membre du projet <em>CodinSchool, \"</em>Minigugus\", n\'a pas codé pour le projet de tout le week end.</p><p><strong>Objectif :</strong></p><p>Sortir tous les nombres de 1 à 48 suivis de la lettre \"h\", afin de lui faire ouvrir les yeux sur les heures perdues pour le projet.</p><p><br></p><h1>Partie 2 :</h1><p>Malheureusement, cela ne suffira pas.Afin de la motiver à se bouger le cul il faut maintenant lui mettre la <strong>pression</strong>.</p><p><strong>Objectif :</strong></p><p>Créer un script affichant le nombre de jours restant avant le jour de rendu du rapport de projet.</p><p><br></p><h3>Obtenir la date en JavaScript :</h3><pre class=\"ql-syntax\" spellcheck=\"false\"><span class=\"hljs-built_in\">var</span> <span class=\"hljs-built_in\">date</span> = <span class=\"hljs-literal\">new</span> <span class=\"hljs-built_in\">Date</span>()\n</pre><script>console.log(\'mdr\')script>',
      TEMP_RETOUR_CODE: '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n13\n14\n15\n16\n17\n18\n19\n20\n21\n22\n23\n24\n25\n26\n27\n28\n29\n30\n31\n32\n33\n34\n35\n36\n37\n38\n39\n40\n41\n42\n43\n44\n45\n46\n47\n48\n',
      TEMP_LANGAGES_DISPONIBLES: [
        'JavaScript',
        'C'
      ].map(key => ({ text: key, value: key })),
      TEMP_TESTS: [
        { nom: 'Sortir tous les nombres de 1 à 48', loading: false, reussi: false },
        { nom: 'Sortir le nombre de jours avant le rendu du rapport de projet. Minim pariatur nulla aute sit adipisicing ipsum elit in nisi tempor enim non. Lorem sunt veniam ad cillum ut adipisicing commodo laborum laboris eiusmod aliquip magna magna. Nostrud occaecat fugiat ea consectetur nulla mollit.', loading: false, reussi: false },
        { nom: 'Sortir le nombre de jours avant le rendu du rapport de projet. Minim pariatur nulla aute sit adipisicing ipsum elit in nisi tempor enim non. Lorem sunt veniam ad cillum ut adipisicing commodo laborum laboris eiusmod aliquip magna magna. Nostrud occaecat fugiat ea consectetur nulla mollit.', loading: false, reussi: false },
        { nom: 'Sortir le nombre de jours avant le rendu du rapport.', loading: false, reussi: false }
      ],

      erreurLoadingExercice: false,
      langageProgrammation: 'C',

      champs: {
        code: { v: '', err: [] }
      }
    }
  },
  computed: {
    testsLoading() {
      return this.TEMP_TESTS.some(x => x.loading)
    },
    testsCompletion() {
      return this.TEMP_TESTS.reduce((acc, x) => x.reussi ? ++acc : acc, 0) / this.TEMP_TESTS.length * 100
    }
  },

  mounted() {
    this.champs.code.v = 'for (let i = 1 ; i <= 48 ; i++)\n  console.log(i)'
  },
  methods: {
    escapeHtml,
    async copierPressePapier(content, event) {
      const source = event.srcElement
      const buttonText = event.srcElement.textContent
      copierVersPressePapier(content)
      source.textContent = 'Copié !'
      await delay(2000)
      source.textContent = buttonText
    },
    async copierDivPressePapier(querySelector, event) {
      const ele = document.querySelector(querySelector)
      copierDOMVersPressePapier(ele)
      const source = event.srcElement
      const buttonText = event.srcElement.textContent
      source.textContent = 'Copié !'
      await delay(2000)
      source.textContent = buttonText
    },

    async lancerTests() {

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
.retour-code > textarea {
  height: 400px;
}
.test-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(0, 0, 0, 0.75) !important;
}

#editeurCode {
  overflow-x: hidden;
  overflow-y: scroll;
  max-height: 800px;
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
.CodeMirror {
  border: 1px solid #eee !important;
  height: 500px !important;
}
</style>
