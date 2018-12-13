<template>
  <div class="ui vertical stripe segment">
    <div class="ui text container">
      <h1 class="ui center aligned header">Gestion des niveaux</h1>

      <draggable
      :list="niveau.liste"
      :options="{animation: 0, group: 'niveau', disabled: !niveau.sontDraggable, ghostClass: 'ghost'}"
      element="div"
      class="liste-niveau"
      >
        <transition-group name="flip-list" class="ui divided items">
          <div v-for="aNiveau in niveau.liste" :key="aNiveau.id" class="item">
            <div class="content">
              <div class="editer">
                <button v-if="!aNiveau.editionEnCours" @click="editerNiveau(aNiveau.id)" class="ui button primary">Editer</button>
                <button v-else @click="validerNiveau(aNiveau.id)" class="ui button positive">Valider</button>
              </div>
              <div class="header">
                {{ aNiveau.nom }}
              </div>
              <div class="meta">
                <span>{{ aNiveau.description }}</span>
              </div>
            </div>
            <transition name="smooth">
              <div v-if="aNiveau.editionEnCours" class="ui">
                <transition-group name="flip-list" class="ui divided items">
                  <div v-for="aExercice in aNiveau.exercice" :key="aExercice.id" class="item">
                    {{ aExercice }}
                  </div>
                </transition-group>
              </div>
            </transition>
          </div>
        </transition-group>
      </draggable>

    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  data() {
    return {
      niveau: {
        sontDraggable: true,
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
                nom: 'Exercice 1.2',
                description: 'Description exercice 1.2'
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
  name: 'gererniveau',
  components: {
    draggable
  },
  methods: {
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

    validerNiveau(idNiveau) {
      const niveau = this.trouverNiveau(idNiveau)
      if (isNaN(niveau)) return
      this.niveau.sontDraggable = true
      this.niveau.liste[niveau].editionEnCours = false
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
}
.item {
  display: block !important;
}
.editer {
  position: relative;
}
.editer button {
  position: absolute;
  right: 0;
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

.smooth-enter-to, .smooth-leave {
  height: 170px;
}
.smooth-enter-active, .smooth-leave-active {
  transition: height .5s;
  overflow: hidden;
}
.smooth-enter, .smooth-leave-to {
  height: 0;
}
</style>
