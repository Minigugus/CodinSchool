<template>
  <div class="ui text container">
    <h1 class="ui center aligned header">Gestion des niveaux</h1>

    <div class="reorganiser-niveau">
      <transition name="fade" mode="out-in">
        <button v-if="!niveau.sontDraggable" key="reorganiser" @click="niveau.sontDraggable = true" class="ui button primary right labeled icon">
          <i class="right bars icon"></i>
          Réorganiser
        </button>
        <button v-else key="valider" @click="validerReorganisationNiveau" class="ui button positive right labeled icon">
          <i class="right check icon"></i>
          Valider
        </button>
      </transition>
    </div>

    <draggable
    :list="niveau.liste"
    :options="{animation: 0, group: 'niveau', disabled: !niveau.sontDraggable, ghostClass: 'ghost'}"
    element="div"
    >
      <transition-group name="flip-list" class="liste-niveau">
        <div v-for="aNiveau in niveau.liste" :key="aNiveau.id" class="niveau">
          <transition name="slide-left">
            <div v-if="!niveau.sontDraggable" :key="'editer-' + aNiveau.id" class="editer">
              <button @click="editerNiveau(aNiveau.id)" class="ui button primary right labeled icon">
                <i class="right arrow icon"></i>
                Editer
              </button>
            </div>
          </transition>

          <transition name="fade-slow">
            <div v-if="niveau.sontDraggable" class="drag-icon">
              <i class="bars icon"></i>
            </div>
          </transition>

          <div class="contenu">
            <div class="titre-niveau">
              {{ aNiveau.nom }}
            </div>
            <div class="description-niveau">
              <span>{{ aNiveau.description }}</span>
            </div>
          </div>
        </div>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  data() {
    return {
      niveau: {
        sontDraggable: false,
        liste: []
      }
    }
  },
  name: 'gererniveau',
  components: {
    draggable
  },
  methods: {
    ajouterNiveau(...niveau) {
      this.niveau.liste.push(...niveau)
    },

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
