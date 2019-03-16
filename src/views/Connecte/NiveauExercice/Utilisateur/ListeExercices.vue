<template>
  <div class="ui container fluid">
    <!-- Ecran de chargement de la page -->
    <!-- <div v-else-if="$apollo.queries.niveaux.loading" class="ui text vertical segment container loading"></div> -->
    <!--/ Ecran de chargement de la page -->

    <!-- <div v-else> -->
    <div>
      <div class="ui doubling stackable grid container contenu my-2">
        <!-- Bloc de gauche -->
        <div class="four wide column">
          <!-- Bloc d'énoncé -->
          <div class="ui container segment description">
            <div class="column">
              <h2 class="text-center">Résumé</h2>
            </div>
            <div class="ui middle aligned divided list side-liste-niveau">
              <div
                v-for="(aNiveau, index) in TEMP_NIVEAUX" :key="'side-niveau-' + aNiveau.id"
                @click="scrollNiveau(aNiveau)"
                :title="aNiveau.titre + (aNiveau.deverouille ? ' (Cliquer pour afficher)' : ' (Non dévérouillé)')"
                class="item"
                :class="{ 'side-liste-niveau-clickable': aNiveau.deverouille }"
              >
                <div>
                  <h1>{{ ++index }}</h1>
                </div>
                <div class="ui container large screen only grid side-niveau-titre">
                  {{ aNiveau.titre.length > 30 ? aNiveau.titre.slice(0, 30) + '...' : aNiveau.titre }}
                </div>
                <div class="side-niveau-completion">
                  <i v-if="!aNiveau.deverouille" class="lock icon big"></i>
                  <i v-else-if="aNiveau.deverouille && niveauTermine(aNiveau)" class="check icon big"></i>
                  <h1 v-else-if="aNiveau.deverouille && !niveauTermine(aNiveau)" v-text="niveauPourcentageCompletion(aNiveau) + ' %'" />
                </div>
              </div>
            </div>
          </div>
        <!--/ Bloc d'énoncé -->
        </div>
        <!--/ Bloc de gauche -->

        <!-- Bloc de droite -->
        <div class="twelve wide column">
          <h2 class="ui header">
            <div class="content">
              Liste des niveaux
            </div>
          </h2>
          <!-- Liste des niveaux -->
          <div
            v-for="(aNiveau, index) in niveauAvecExercice"
            :key="`niveau-${index}-${aNiveau.id}`"
            class="ui doubling stackable grid container segment contenu my-3 liste-niveau"
            :id="`niveau-${aNiveau.id}`"
          >
            <div class="one wide column niveau-index">
              <h1>{{ ++index }}</h1>
            </div>
            <div class="fifteen wide column niveau-content">
              <h2>{{ aNiveau.titre }}</h2>
              <span class="niveau-introduction">{{ aNiveau.introduction }}</span>
              <!-- Liste des exercices d'un niveau -->
              <sui-table celled selectable>
                <sui-table-header>
                  <sui-table-row>
                    <sui-table-header-cell width="one" text-align="center">#</sui-table-header-cell>
                    <sui-table-header-cell width="nine">Nom</sui-table-header-cell>
                    <sui-table-header-cell width="four">Langage(s)</sui-table-header-cell>
                    <sui-table-header-cell width="one" text-align="center">Réussi</sui-table-header-cell>
                    <sui-table-header-cell width="one" text-align="center">Lancer</sui-table-header-cell>
                  </sui-table-row>
                </sui-table-header>
                <sui-table-body>
                  <sui-table-row
                    v-for="(anExercice, indexEx) in aNiveau.exercices" :key="`exercice-${indexEx}-${anExercice.id}`"
                    :positive="anExercice.reussi"
                  >
                    <sui-table-cell v-text="++indexEx" text-align="center" width="one" />
                    <sui-table-cell v-text="anExercice.titre" width="nine" />
                    <sui-table-cell v-text="anExercice.langages.join(', ')" width="four" />
                    <sui-table-cell width="one" text-align="center">
                      <button
                        class="ui icon button mini"
                        :class="{ green: anExercice.reussi, red: !anExercice.reussi }"
                      >
                        <i
                          class="icon"
                          :class="{ check: anExercice.reussi, close: !anExercice.reussi }"
                        />
                      </button>
                    </sui-table-cell>
                    <sui-table-cell width="one" text-align="center">
                      <router-link :to="`/faireExercice/${anExercice.id}`" class="ui primary right labeled icon button mini">
                        <i class="right arrow icon"></i>
                        Lancer
                      </router-link>
                    </sui-table-cell>
                  </sui-table-row>
                </sui-table-body>
              </sui-table>
              <!-- Liste des exercices d'un niveau -->
            </div>
          </div>
          <!--/ Liste des niveaux -->
        </div>
        <!--/ Bloc de droite -->
      </div>
    </div>
  </div>
</template>

<script>
import Utilisateur from '@/graphql/Utilisateur/Utilisateur.gql'
import NiveauxExercices from '@/graphql/NiveauExercice/NiveauxExercices.gql'

// import Alerte from '@/components/Alerte.vue'
// import FormChamps from '@/components/FormChamps.vue'

export default {
  name: 'FaireExercice',
  components: {
    // FormChamps,
    // Alerte
  },

  apollo: {
    moi: Utilisateur,
    niveaux: NiveauxExercices
  },

  data() {
    return {
      TEMP_NIVEAUX: [
        {
          'id': 'niveau-1',
          'titre': 'Les boucles',
          'introduction': 'A travers ce niveau, nous étudierons l\'utilisation des boucles.',
          'dateCreation': '1552254806811',
          'position': 0,
          'deverouille': true,
          '__typename': 'Niveau',
          'exercices': [
            {
              'id': 'premiere-boucle',
              'titre': 'Première utilisation des boucles',
              'enonce': '<p>czec</p>',
              'correction': '#include <stdio.h>\nint main(void) {\n  for (int i = 0 ; i < 10 ; ++i)\n    printf("%d\\n", i);\n  return 0;\n}',
              'position': 0,
              'reussi': false,
              'langages': [
                'JavaScript',
                'C'
              ],
              '__typename': 'Exercice'
            },
            {
              'id': 'premiere-boucle2',
              'titre': 'Première utilisation des boucles2',
              'enonce': '<p>czec</p>',
              'correction': '#include <stdio.h>\nint main(void) {\n  for (int i = 0 ; i < 10 ; ++i)\n    printf("%d\\n", i);\n  return 0;\n}',
              'position': 0,
              'reussi': true,
              'langages': [
                'JavaScript',
                'C'
              ],
              '__typename': 'Exercice'
            }
          ]
        },
        {
          'id': 'niveaux-deux',
          'titre': 'Le niveau deux',
          'introduction': 'Utilisation de listes chaînées.',
          'dateCreation': '1552728786921',
          'position': 1,
          'deverouille': true,
          '__typename': 'Niveau',
          'exercices': [
            {
              'id': 'intro-listes-chainees',
              'titre': 'Introduction aux listes chaînées',
              'enonce': '<h1>bla bla</h1><p>bla bla</p>',
              'correction': '#include <stdio.h>\nint main(void) {\n  for (int i = 0 ; i < 10 ; ++i)\n    printf("%d\\n", i);\n  return 0;\n}',
              'position': 0,
              'reussi': true,
              'langages': [
                'JavaScript',
                'C'
              ],
              '__typename': 'Exercice'
            },
            {
              'id': 'intro-listes-chainees2',
              'titre': 'Introduction aux listes chaînées2',
              'enonce': '<h1>bla bla</h1><p>bla bla</p>',
              'correction': '#include <stdio.h>\nint main(void) {\n  for (int i = 0 ; i < 10 ; ++i)\n    printf("%d\\n", i);\n  return 0;\n}',
              'position': 0,
              'reussi': true,
              'langages': [
                'JavaScript',
                'C'
              ],
              '__typename': 'Exercice'
            },
            {
              'id': 'intro-listes-chainees3',
              'titre': 'Introduction aux listes chaînées3',
              'enonce': '<h1>bla bla</h1><p>bla bla</p>',
              'correction': '#include <stdio.h>\nint main(void) {\n  for (int i = 0 ; i < 10 ; ++i)\n    printf("%d\\n", i);\n  return 0;\n}',
              'position': 0,
              'reussi': true,
              'langages': [
                'JavaScript',
                'C'
              ],
              '__typename': 'Exercice'
            }
          ]
        },
        {
          'id': 'niveau-3',
          'titre': 'Le niveau trois',
          'introduction': 'Nulla duis anim veniam nostrud irure est quis exercitation tempor consectetur qui fugiat nulla. Non fugiat ea consectetur sit. Officia eu laborum duis ex sit.',
          'dateCreation': '1552728887265',
          'position': 2,
          'deverouille': true,
          '__typename': 'Niveau',
          'exercices': [
            {
              'id': 'intro-niveau-trois',
              'titre': 'Introduction au niveau 3',
              'enonce': '<h1>bla bla</h1><p>bla bla</p>',
              'correction': '#include <stdio.h>\nint main(void) {\n  for (int i = 0 ; i < 10 ; ++i)\n    printf("%d\\n", i);\n  return 0;\n}',
              'position': 0,
              'reussi': false,
              'langages': [
                'JavaScript',
                'C'
              ],
              '__typename': 'Exercice'
            }
          ]
        },
        {
          'id': 'niveau-4',
          'titre': 'Le niveau quatre',
          'introduction': 'Nulla duis anim veniam nostrud irure est quis exercitation tempor consectetur qui fugiat nulla. Non fugiat ea consectetur sit. Officia eu laborum duis ex sit.',
          'dateCreation': '1552728894117',
          'position': 3,
          'deverouille': false,
          '__typename': 'Niveau',
          'exercices': []
        },
        {
          'id': 'niveau-5',
          'titre': 'Le niveau cinq',
          'introduction': 'Nulla duis anim veniam nostrud irure est quis exercitation tempor consectetur qui fugiat nulla. Non fugiat ea consectetur sit. Officia eu laborum duis ex sit.',
          'dateCreation': '1552728899010',
          'position': 4,
          'deverouille': false,
          '__typename': 'Niveau',
          'exercices': []
        }
      ]
    }
  },
  computed: {
    // Récupérer la liste des niveaux qui contiennent au moins un exercice
    niveauAvecExercice() {
      return this.TEMP_NIVEAUX.filter(x => x.exercices && x.exercices.length > 0)
    }
  },

  mounted() {
  },
  methods: {
    scrollNiveau(aNiveau) {
      const el = document.querySelector(`#niveau-${aNiveau.id}`)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    },
    niveauTermine(aNiveau) {
      return aNiveau.exercices.every(x => x.reussi)
    },
    niveauPourcentageCompletion(aNiveau) {
      return aNiveau.exercices.reduce((acc, x) => x.reussi ? ++acc : acc, 0) / aNiveau.exercices.length * 100
    }
  }
}
</script>

<style scoped>
.ui.container.fluid {
  width: 85%;
}
.contenu.ui.grid.container {
  width: 100% !important;
}

.ui.list>.item:after, .ui.list>.list>.item, ol.ui.list>li:first-child:after, ul.ui.list>li:first-child:after {
  content: none;
}
.side-liste-niveau h1 {
  display: inline !important;
  padding: 0 !important;
  margin: 0 !important;
}
.side-liste-niveau .item {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  transition-duration: .3s;
  padding: 10px 0px 10px 10px !important;
}
.side-liste-niveau-clickable:hover {
  cursor: pointer;
  background-color: #f4f4f4;
}
.side-niveau-titre.ui.grid.container {
  width: auto !important;
  padding: 10px !important;
}
.side-niveau-completion {
  width: 75px;
  text-align: center;
}

.niveau-index {
  border-right: 0 !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}
.niveau-index h1 {
  font-size: 60px !important;
}
.niveau-content h2 {
  padding: 0;
  margin-bottom: 3px;
}
</style>
