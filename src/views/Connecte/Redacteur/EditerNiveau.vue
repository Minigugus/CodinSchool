<template>
  <div class="ui text vertical segment container">
    <div v-if="$apollo.queries.niveau.loading" class="ui text vertical segment container loading"></div>
    <div v-else>
      <!-- Fil d'ariane -->
      <div class="ui large breadcrumb">
        <router-link to="/redacteur/niveau/liste" class="section">Liste des niveaux</router-link>
        <i class="right angle icon divider"></i>
        <div class="active section">{{ niveau.id }}</div>
      </div>
      <!--/ Fil d'ariane -->

      <h1 class="ui center aligned header">
        Edition de niveau
        <h3>"{{ niveau.titre }}"</h3>
      </h1>

      <!-- Formulaire d'édition du niveau -->
      <div class="ui container segment stripe">
        <ApolloMutation
          :mutation="require('@/graphql/Niveau/EditerNiveau.gql')"
          :variables="{
            id: idNiveau,
            niveau: {
              id: niveau.id,
              titre: niveau.titre,
              introduction: niveau.introduction,
            }
          }"
          class="form"
          @error="chargerErreur"
          @done="rechargerNiveau"
        >
          <template slot-scope="{ mutate, loading }">
            <form @submit.prevent="mutate" :class="{ loading }" class="ui form" novalidate>
              <form-champs v-model="niveau.id" nom="Identifiant" id="id" :err="champs.niveau.id.err"></form-champs>
              <form-champs v-model="niveau.titre" nom="Titre" id="titre" :err="champs.niveau.titre.err"></form-champs>

              <!-- TODO: Mise à jour de FormChamps pour prise en charge textarea -->
              <!-- <form-champs v-model="niveau.introduction" nom="Introduction" id="introduction" :err="champs.niveau.introduction.err"></form-champs> -->
              <div class="field">
                <label for="introduction">Introduction</label>
                <textarea v-model="niveau.introduction" id="introduction" placeholder="Consigne de L'exercice"></textarea>
              </div>
              <button class="ui button" type="submit">Modifier le niveau</button>
            </form>

            <Alerte ref="erreurs" :typeAlerte="typeAlerte" />
          </template>
        </ApolloMutation>
      </div>
      <!--/ Formulaire d'édition du niveau -->

      <h2 class="ui center aligned header">Réorganiser les exercices du niveau</h2>

      <!-- Bouton de réorganisation des exercices -->
      <div class="reorganiser-exercice">
        <transition name="fade" mode="out-in">
          <button v-if="!exercice.sontDraggable" key="reorganiser" @click="exercice.sontDraggable = true" class="ui button primary right labeled icon">
            <i class="right bars icon"></i>
            Réorganiser les exercices
          </button>
          <button v-else key="valider" @click="validerReorganisation" class="ui button positive right labeled icon">
            <i class="right check icon"></i>
            Valider la réorganisation
          </button>
        </transition>
      </div>
      <!--/ Bouton de réorganisation des exercices -->

      <!-- Liste des exercices du niveau -->
      <draggable
      :list="exercice.liste"
      :options="{ animation: 0, group: 'exercice', disabled: !exercice.sontDraggable, ghostClass: 'ghost' }"
      element="div"
      >
        <transition-group name="flip-list" class="liste-exercice">
          <div v-for="aExercice in exercice.liste" :key="aExercice.id" class="exercice">
            <!-- Bouton d'édition d'un exercice -->
            <transition name="slide-left">
              <div v-if="!exercice.sontDraggable" :key="'editer-' + aExercice.id" class="editer">
                <router-link :to="`/redacteur/niveau/${niveau.id}/exercice/${aExercice.id}`" class="ui button primary right labeled icon" tag="button">
                  <i class="right arrow icon"></i>
                  Editer
                </router-link>
              </div>
            </transition>
            <!--/ Bouton d'édition d'un exercice -->

            <!-- Icône de drag de l'exercice -->
            <transition name="fade-slow">
              <div v-if="exercice.sontDraggable" class="drag-icon">
                <i class="bars icon"></i>
              </div>
            </transition>
            <!--/ Icône de drag de l'exercice -->

            <!-- Informations de l'exercice -->
            <div class="contenu">
              <div class="titre-exercice">{{ aExercice.nom }}</div>
              <div class="id-exercice">#{{ aExercice.id }}</div>
              <div class="description-exercice">
                <span>{{ aExercice.description }}</span>
              </div>
            </div>
            <!--/ Informations de l'exercice -->
          </div>
        </transition-group>
      </draggable>
      <!--/ Liste des exercices du niveau -->
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import Alerte from '@/components/Alerte.vue'
import FormChamps from '@/components/FormChamps.vue'
import Niveau from '@/graphql/Niveau/Niveau.gql'
import ReorganiserExercices from '@/graphql/Niveau/ReorganiserExercices.gql'

export default {
  data() {
    return {
      champs: {
        niveau: {
          id: { err: [] },
          titre: { err: [] },
          introduction: { err: [] }
        }
      },
      exercice: {
        sontDraggable: false,
        liste: []
      },

      typeAlerte: 'Erreur'
    }
  },
  name: 'editerniveau',
  components: {
    draggable,
    Alerte,
    FormChamps
  },
  props: ['idNiveau'],

  apollo: {
    niveau() {
      return {
        query: Niveau,
        variables: {
          id: this.idNiveau
        }
      }
    }
  },

  methods: {
    // Charger une erreur GraphQL envoyée par Apollo dans la liste des erreurs
    chargerErreur(errorObject) {
      const { gqlError } = errorObject
      if (!gqlError) return console.error(errorObject)

      // Affichage de l'erreur dans l'alerte
      this.$refs.erreurs.ajouterAlerte(gqlError.message)
    },

    // Formulaire validé, injection des données et mise à jour de l'url
    async rechargerNiveau({ data }) {
      const apolloClient = this.$apollo.provider.defaultClient

      // Mise à jour du cache
      apolloClient.writeQuery({
        query: Niveau,
        variables: {
          id: this.idNiveau
        },
        data: {
          niveau: {
            ...data.editerNiveau
          }
        }
      })

      // Affichage d'une alerte de succès
      this.$refs.erreurs.ajouterAlerte('Le niveau a été modifié.')
      this.typeAlerte = 'Succès'

      // On modifie le props de l'idNiveau dans l'url
      this.$router.replace({ name: 'editerniveau', params: { idNiveau: this.niveau.id } })
    },

    async validerReorganisation() {
      this.exercice.sontDraggable = false

      const apolloClient = this.$apollo.provider.defaultClient

      // Mise à jour du cache
      await apolloClient.mutate({
        mutation: ReorganiserExercices,
        variables: {
          niveau: this.niveau.id,
          exercices: this.niveaux.map(x => x.id)
        },
        update: (store, { data: { reorganiserExercices: nouvelleOrganisation } }) => {
          // Lire le cache pour récupérer le contenu actuel
          const data = store.readQuery({ query: Niveau, variables: { id: this.niveau.id } })

          // Modifier le contenu actuel récupéré
          data.exercices = nouvelleOrganisation

          // Appliquer la modification en cache
          store.writeQuery({ query: Niveau, variables: { id: this.niveau.id }, data })
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
  font-family: Lato,'Helvetica Neue', Arial,Helvetica, sans-serif;
  font-weight: 700;
  color: rgba(0,0,0,.85);
}
.id-exercice {
  font-size: 1em;
  margin-left: 8px !important;
  display: inline-block;
  margin: 0;
  font-family: Lato, 'Helvetica Neue', Arial,Helvetica, sans-serif;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.377);
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
