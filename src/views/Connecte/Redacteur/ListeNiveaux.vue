<template>
  <div class="ui text vertical segment container">
    <h1 class="ui center aligned header">Liste des niveaux</h1>

    <!-- Bouton de réorganisation des niveaux -->
    <div class="reorganiser-niveau">
      <transition name="fade" mode="out-in">
        <button v-if="!niveau.sontDraggable" key="reorganiser" @click="niveau.sontDraggable = true" class="ui button primary right labeled icon">
          <i class="right bars icon"></i>
          Réorganiser les niveaux
        </button>
        <button v-else key="valider" @click="validerReorganisation" class="ui button positive right labeled icon">
          <i class="right check icon"></i>
          Valider la réorganisation
        </button>
      </transition>
    </div>
    <!--/ Bouton de réorganisation des niveaux -->

    <!-- Liste des niveaux -->
    <draggable
    :list="niveaux"
    :options="{ animation: 0, group: 'niveau', disabled: !niveau.sontDraggable, ghostClass: 'ghost' }"
    element="div"
    >
      <transition-group name="flip-list" class="liste-niveau">
        <div v-for="aNiveau in niveaux" :key="aNiveau.id" class="niveau">
          <!-- Bouton d'édition d'un niveau -->
          <transition name="slide-left">
            <div v-if="!niveau.sontDraggable" :key="'editer-' + aNiveau.id" class="editer">
              <router-link :to="`/redacteur/niveau/${aNiveau.id}`" class="ui button primary right labeled icon" tag="button">
                <i class="right arrow icon"></i>
                Editer
              </router-link>
            </div>
          </transition>
          <!--/ Bouton d'édition d'un niveau -->

          <!-- Icône de drag du niveau -->
          <transition name="fade-slow">
            <div v-if="niveau.sontDraggable" class="drag-icon">
              <i class="bars icon"></i>
            </div>
          </transition>
          <!--/ Icône de drag du niveau -->

          <!-- Informations du niveau -->
          <div class="contenu">
            <div class="titre-niveau">{{ aNiveau.titre }}</div>
            <div class="id-niveau">#{{ aNiveau.id }}</div>
            <div class="description-niveau">
              <span>{{ aNiveau.introduction }}</span>
            </div>
          </div>
          <!--/ Informations du niveau -->
        </div>
      </transition-group>
    </draggable>
    <!--/ Liste des niveaux -->
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import Utilisateur from '@/mixins/Utilisateur'
import Niveaux from '@/graphql/Niveau/Niveaux.gql'
import ReorganiserNiveaux from '@/graphql/Niveau/ReorganiserNiveaux.gql'

export default {
  data() {
    return {
      niveau: {
        sontDraggable: false
      }
    }
  },
  name: 'listeniveaux',
  mixins: [Utilisateur],
  components: {
    draggable
  },

  apollo: {
    niveaux: Niveaux
  },

  methods: {
    async validerReorganisation() {
      this.niveau.sontDraggable = false

      const apolloClient = this.$apollo.provider.defaultClient

      // Mise à jour du cache
      await apolloClient.mutate({
        mutation: ReorganiserNiveaux,
        variables: {
          niveaux: this.niveaux.map(x => x.id)
        },
        update: (store, { data: { reorganiserNiveaux: nouvelleOrganisation } }) => {
          // Lire le cache pour récupérer le contenu actuel
          const data = store.readQuery({ query: Niveaux })

          // Modifier le contenu actuel récupéré
          data.niveaux = nouvelleOrganisation

          // Appliquer la modification en cache
          store.writeQuery({ query: Niveaux, data })
        }})
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
.id-niveau {
  font-size: 1em;
  margin-left: 8px !important;
  display: inline-block;
  margin: 0;
  font-family: Lato, 'Helvetica Neue', Arial,Helvetica, sans-serif;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.28);
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
</style>
