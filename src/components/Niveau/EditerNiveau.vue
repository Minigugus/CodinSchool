<template>
  <div class="ui text container">
    <h1 class="ui center aligned header">Edition du niveau {{ idNiveau }}</h1>

    <div class="reorganiser-exercice">
      <transition name="fade" mode="out-in">
        <button v-if="!exercice.sontDraggable" key="reorganiser" @click="exercice.sontDraggable = true" class="ui button primary right labeled icon">
          <i class="right bars icon"></i>
          Réorganiser
        </button>
        <button v-else key="valider" @click="validerReorganisation" class="ui button positive right labeled icon">
          <i class="right check icon"></i>
          Valider
        </button>
      </transition>
    </div>

    <draggable
    :list="exercice.liste"
    :options="{ animation: 0, group: 'exercice', disabled: !exercice.sontDraggable, ghostClass: 'ghost' }"
    element="div"
    >
      <transition-group name="flip-list" class="liste-exercice">
        <div v-for="aExercice in exercice.liste" :key="aExercice.id" class="exercice">
          <transition name="slide-left">
            <div v-if="!exercice.sontDraggable" :key="'editer-' + aExercice.id" class="editer">
              <button @click="editerExercice(aExercice.id)" class="ui button primary right labeled icon">
                <i class="right arrow icon"></i>
                Editer
              </button>
            </div>
          </transition>

          <transition name="fade-slow">
            <div v-if="exercice.sontDraggable" class="drag-icon">
              <i class="bars icon"></i>
            </div>
          </transition>

          <div class="contenu">
            <div class="titre-exercice">
              {{ aExercice.nom }}
            </div>
            <div class="description-exercice">
              <span>{{ aExercice.description }}</span>
            </div>
          </div>
        </div>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { fakeListeNiveau } from '@/functions'

export default {
  data() {
    return {
      exercice: {
        sontDraggable: false,
        liste: []
      }
    }
  },
  name: 'editerniveau',
  components: {
    draggable
  },
  props: ['idNiveau'],

  mounted() {
    // TODO: Chargement des niveaux depuis Apollo quand schéma GraphQL sera prêt
    this.exercice.liste = fakeListeNiveau.find(x => x.id === this.idNiveau).exercice
  },

  methods: {
    // TODO: Application des modifications via mutation Apollo
    validerReorganisation() {
      this.exercice.sontDraggable = false
    },

    // Lance l'édition d'un niveau en émettant un évènement
    // "editerExercice" avec l'id de l'exercice à éditer
    editerExercice(idExercice) {
      this.$emit('editerExercice', idExercice)
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
.liste-exercice {
  background-color: #f3f3f3 !important;
  display: block;
  border-radius: 12px;
}
.exercice {
  display: block;
  border-bottom: 1px solid #cfcfcf;
  background-color: #f3f3f3;
  padding: 20px;
}
.exercice:first-child {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}
.exercice:last-child {
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}
.exercice:last-of-type {
  border-bottom: none;
}
.reorganiser-exercice {
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

.titre-exercice {
  font-size: 1.3em;
  display: inline-block;
  margin: 0;
  font-family: Lato,'Helvetica Neue',Arial,Helvetica,sans-serif;
  font-weight: 700;
  color: rgba(0,0,0,.85);
}
.description-exercice {
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
</style>
