<template>
  <div class="ui vertical stripe segment">
    <GererNiveau ref="niveau" />

<!--
  <transition name="smooth">
    <div v-if="aNiveau.editionEnCours" class="ui">
      <draggable
      :list="aNiveau.exercice"
      :options="{animation: 0, group: 'exercice-' + aNiveau.id , disabled: !aNiveau.editionEnCours, ghostClass: 'ghost'}"
      element="div"
      >
        <transition-group name="flip-list" class="ui divided items">
          <div v-for="aExercice in aNiveau.exercice" :key="aNiveau.id + '-' + aExercice.id" class="item">
            {{ aExercice.id }} - {{ aExercice.nom }} - {{ aExercice.description }}
            <button class="ui button">test</button>
          </div>
        </transition-group>
      </draggable>
    </div>
  </transition>
-->

  </div>
</template>

<script>
import GererNiveau from '@/components/GererNiveau.vue'
import Utilisateur from '@/mixins/Utilisateur'

export default {
  data() {
    return {
      niveau: {
        sontDraggable: false,
        liste: [
          {
            id: 1,
            nom: 'Niveau 1',
            description: 'Description niveau 1',
            editionEnCours: false,
            exercice: [
              {
                id: 1,
                nom: 'Exercice 1.1',
                description: 'Description exercice 1.1'
              },
              {
                id: 2,
                nom: 'Exercice 1.2',
                description: 'Description exercice 1.2'
              },
              {
                id: 5,
                nom: 'Exercice 1.3',
                description: 'Description exercice 1.3'
              }
            ]
          },
          {
            id: 2,
            nom: 'Niveau 2',
            description: 'Description niveau 2',
            editionEnCours: false,
            exercice: [
              {
                id: 3,
                nom: 'Exercice 2.1',
                description: 'Description exercice 2.1'
              },
              {
                id: 4,
                nom: 'Exercice 2.2',
                description: 'Description exercice 2.2'
              }
            ]
          },
          {
            id: 3,
            nom: 'Niveau 3',
            description: 'Description niveau 3',
            editionEnCours: false,
            exercice: [
              {
                id: 3,
                nom: 'Exercice 3.1',
                description: 'Description exercice 3.1'
              },
              {
                id: 4,
                nom: 'Exercice 3.2',
                description: 'Description exercice 3.2'
              }
            ]
          }
        ]
      }
    }
  },
  name: 'gestioncontenu',
  components: {
    GererNiveau
  },
  mixins: [Utilisateur],

  mounted() {
    // TODO: Chargement des niveaux depuis Apollo
    this.$refs.niveau.ajouterNiveau(...this.niveau.liste)
  },

  methods: {
    validerReorganisationNiveau() {
      this.niveau.sontDraggable = false
    },

    // Retrouver le niveau dans la liste des niveaux
    trouverNiveau(idNiveau) {
      const niveau = this.niveau.liste.findIndex(x => x.id === idNiveau)
      return niveau !== -1 ? niveau : null
    },

    // Edition d'un niveau. Bloque la propriété de draggage des niveaux et affiche les exercices
    editerNiveau(idNiveau) {
      const niveau = this.trouverNiveau(idNiveau)
      if (isNaN(niveau)) return

      this.niveau.sontDraggable = false
      this.niveau.liste[niveau].editionEnCours = true
    },

    // Validation des modifications d'un niveau
    validerNiveau(idNiveau) {
      const niveau = this.trouverNiveau(idNiveau)
      if (isNaN(niveau)) return

      this.niveau.liste[niveau].editionEnCours = false

      // On vérifie que tous les niveaux sont validés avant d'autoriser le drag
      if (!this.niveau.liste.find(x => x.editionEnCours))
        this.niveau.sontDraggable = true
    }
  }
}
</script>

<style scoped>
.flip-list-move {
  transition: transform 1s !important;
}
.ghost {
  opacity: 0.5 !important;
  background: #c8ebfb !important;
}
.liste-niveau {
  background-color: #f3f3f3 !important;
  display: block;
  border-radius: 12px;
}
.niveau {
  display: block;
  border-bottom: 1px solid #cfcfcf;
  background-color: #f3f3f3;
  padding: 20px;
}
.niveau:first-child {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}
.niveau:last-child {
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}
.niveau:last-of-type {
  border-bottom: none;
}
.reorganiser-niveau {
  text-align: center;
  padding-bottom: 10px;
}
.drag-icon {
  line-height: 60px;
  position: absolute;
  padding-right: 20px;
  cursor: move;
}
.contenu {
  padding-left: 2.2em;
}

.titre-niveau {
  font-size: 1.3em;
  display: inline-block;
  margin: 0;
  font-family: Lato,'Helvetica Neue',Arial,Helvetica,sans-serif;
  font-weight: 700;
  color: rgba(0,0,0,.85);
}
.description-niveau {
  margin: .5em 0 .5em;
  font-size: 1em;
  line-height: 1em;
  color: rgba(0,0,0,.6);
}
.editer {
  position: relative;
}
.editer button {
  position: absolute !important;
  right: 0 !important;
  margin-top: 15px !important;
}


.ui.divided.items>.item {
  border-top: 1px solid rgba(34,36,38,.15);
  background-color: #f3f3f3;
  padding: 23px;
}
.ui.divided.items>.item:first-child {
  border-top: none;
}
.ui.divided.items>.item:first-child, .ui.divided.items>.item:last-child {
  margin: 0 !important;
  padding: 25px !important;
}

/* Animation d'ouverture des niveaux */
.smooth-enter-to, .smooth-leave {
  max-height: 300px;
}
.smooth-enter-active, .smooth-leave-active {
  transition: max-height .8s;
  overflow: hidden;
}
.smooth-enter, .smooth-leave-to {
  max-height: 0;
}
</style>
