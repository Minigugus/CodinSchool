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
    <div v-else-if="$apollo.queries.exercice.loading" class="ui text vertical segment container loading"></div>
    <!--/ Ecran de chargement de la page -->

    <div v-else>
      <!-- Fil d'ariane -->
      <FilAriane :items="[
        { txt: 'Liste des exercices', to: '/listeExercices' },
        `Faire exercice : ${ exercice.titre}`
      ]"
      />
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
                    <button @click="copierPressePapier(exercice.enonce, $event)" class="ui button labeled icon tiny">
                      <i class="clone icon"></i>
                      Copier HTML
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <!-- TODO: Vrai énoncé (test car sur cette branche max char = 255) -->
            <div v-html="escapeHtml(exercice.enonce)" class="ui container segment" id="enonce" /> <!--eslint-disable-line -->
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
              <div v-for="(aTest, index) in exercice.tests" :key="'test-' + index">
                <sui-accordion-title class="test-title">
                  <span>
                    <sui-icon name="dropdown" />
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
                <sui-accordion-content>
                  <p>
                    <b>Nom du test :</b> {{ aTest.nom }}<br>
                    <b>Entrée envoyée au programme :</b> {{ aTest.entree }}<br>
                    <b>Sortie attendue par le programme :</b> {{ aTest.sortie }}
                  </p>

                  <div v-if="aTest.hasOwnProperty('stdout')">
                    <!-- Retour du programme -->
                    <div class="ui container retour-code form">
                      <div class="ui grid mb-1">
                        <div class="two column row align-items-center">
                          <div class="left floated column">
                            <h4>Sortie du programme :</h4>
                          </div>
                          <div class="right floated column">
                            <div class="ui text-right">
                              <transition name="fade">
                                <button
                                  v-show="aTest.stdout !== ''"
                                  @click="copierPressePapier(aTest.stdout, $event)"
                                  class="ui button labeled icon tiny"
                                >
                                  <i class="clone icon"></i>
                                  Copier
                                </button>
                              </transition>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-if="aTest.stdout" class="field">
                        <textarea v-text="aTest.stdout" class="field" readonly />
                      </div>
                      <p v-else class="my-0">Aucune sortie.</p>
                    </div>
                    <!--/ Retour du programme -->

                    <!-- Retour d'erreur du programme -->
                    <div class="ui container retour-code form mt-3">
                      <div class="ui grid mb-1">
                        <div class="two column row align-items-center">
                          <div class="left floated column">
                            <h4>Sortie d'erreur du programme :</h4>
                          </div>
                          <div class="right floated column">
                            <div class="ui text-right">
                              <transition name="fade">
                                <button
                                  v-show="aTest.stderr !== ''"
                                  @click="copierPressePapier(aTest.stderr, $event)"
                                  class="ui button labeled icon tiny"
                                >
                                  <i class="clone icon"></i>
                                  Copier
                                </button>
                              </transition>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-if="aTest.stderr" class="field">
                        <textarea v-text="aTest.stderr" class="field" readonly />
                      </div>
                      <p v-else class="my-0">Aucune sortie d'erreur.</p>
                    </div>
                    <!--/ Retour d'erreur du programme -->
                  </div>
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
              v-model="selectedLangageProgrammation"
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
                :type="selectedLangageProgrammation"
                :err="champs.code.err"
              />
            </div>
          </div>
          <!--/ Bloc de l'éditeur de code -->
        </div>
        <!--/ Bloc de droite -->
      </div>
    </div>
  </div>
</template>

<script>
import 'highlight.js/styles/monokai.css'

import Exercice from '@/graphql/NiveauExercice/Exercice.gql'
import Soumettre from '@/graphql/NiveauExercice/Soumettre.gql'

import Alerte from '@/components/Alerte.vue'
import FormChamps from '@/components/FormChamps.vue'
import FilAriane from '@/components/FilAriane.vue'

import { delay, escapeHtml, copierVersPressePapier, copierDOMVersPressePapier } from '@/functions'

export default {
  name: 'FaireExercice',
  components: {
    FormChamps,
    Alerte,
    FilAriane
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
        },
        result({ loading, data }) {
          // Ajouter un état de loading aux tests
          if (!loading)
            this.exercice.tests = data.exercice.tests.map(x => ({ ...x, loading: false, reussi: false }))
        }
      }
    }
  },

  data() {
    return {
      // TODO: Ajout des langages disponibles pour cet exercice
      TEMP_LANGAGES_DISPONIBLES: [
        'JavaScript',
        'C'
      ].map(key => ({ text: key, value: key })),
      selectedLangageProgrammation: 'JavaScript',

      erreurLoadingExercice: false,
      champs: {
        code: { v: '', err: [] }
      }
    }
  },
  computed: {
    testsLoading() {
      return this.exercice.tests.some(x => x.loading)
    },
    testsCompletion() {
      return this.exercice.tests.reduce((acc, x) => x.reussi ? ++acc : acc, 0) / (this.exercice.tests.length || 1) * 100
    }
  },

  mounted() {
    // TODO: Champs `Code de départ` en bdd, injecter un code par défaut pour le langage
    // choisis directement dans le module `codeMirrorLanguageLoader`
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
      // console.debug(this)
      this.$apollo.subscribe({
        query: Soumettre,
        variables: {
          code: this.champs.code.v,
          exercice: this.exercice.id
        }
      }).subscribe({
        next: ({ data: { soumettre: { /* etat, compilation,*/ tests } } }) => {
          // console.info(`DEBUG ${etat}`, compilation, tests)
          // console.log(JSON.stringify(tests, null, 2))
          /* ;*/(tests || []).forEach(aTest => {
            // FIXME: aTest.id is the submission ID ? how to identify the test ? (editing only the test number 1 right now )
            const i = this.exercice.tests.findIndex(x => x.id === /* aTest.id*/this.exercice.tests[0].id)
            if (i === -1) return

            console.log('mdr2')
            this.exercice.tests[i].duree = aTest.duree
            this.exercice.tests[i].etat = aTest.etat
            this.exercice.tests[i].stderr = aTest.stderr
            this.exercice.tests[i].stdout = aTest.stdout

            this.exercice.tests[i].loading = aTest.etat !== 'TERMINE'
            this.exercice.tests[i].reussi = aTest.passe
          })
        },
        error: console.error
      })
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
