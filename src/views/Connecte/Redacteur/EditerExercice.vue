<template>
  <div class="ui text vertical segment container">
    <!-- Fil d'ariane -->
    <div class="ui large breadcrumb">
      <router-link to="/redacteur/niveau/liste" class="section">Liste des niveaux</router-link>
      <i class="right angle icon divider"></i>
      <router-link :to="`/redacteur/niveau/${niveau.id}`" class="section">{{ niveau.id }}</router-link>
      <i class="right arrow icon divider"></i>
      <div class="active section">{{ exercice.id }}</div>
    </div>
    <!--/ Fil d'ariane -->

    <h1 class="ui center aligned header">
      Edition d'exercice
      <h3>"{{ exercice.nom }}"</h3>
    </h1>

    <!-- Formulaire d'édition du niveau TODO: Liaison à Apollo -->
    <div class="ui container segment stripe smallContainer">
      <form class="ui form">
        <div class="field">
          <label>Niveau</label>
          <select class="ui dropdown simple disabled" v-model="niveau.id">
            <option>{{ niveau.id }}</option>
          </select>
        </div>

        <div class="eight wide field">
          <label>Identifiant</label>
          <input type="text" v-model="exercice.id" placeholder="Identifiant">
        </div>

        <div class="field">
          <label>Nom</label>
          <input type="text" v-model="exercice.nom" placeholder="Titre">
        </div>

        <div class="field">
          <label>Consigne</label>
          <textarea v-model="exercice.description" placeholder="Consigne de L'exercice"></textarea>
        </div>

        <div class="field">
          <label>Correction</label>
          <textarea v-model="exercice.correction" placeholder="Un programme qui répond à la consigne"></textarea>
        </div>

        <button class="ui button" type="submit">Modifier l'exercice</button>
      </form>
    </div>
    <!--/ Formulaire d'édition de l'exercice -->
  </div>
</template>

<script>
import { fakeListeNiveau } from '@/functions'

export default {
  data() {
    return {
      niveau: {
        id: null,
        nom: null,
        description: null
      },
      exercice: {
        id: '9',
        nom: 'Exercice 3.1',
        description: 'Description exercice 3.1',
        correction: 'Correction exercice 3.1'
      }
    }
  },
  name: 'editerniveau',
  props: ['idNiveau', 'idExercice'],

  mounted() {
    // TODO: Chargement de l'exercice depuis Apollo quand schéma GraphQL sera prêt
    this.niveau = fakeListeNiveau.find(x => x.id === this.idNiveau)
    this.exercice = this.niveau.exercice.find(x => x.id === this.idExercice)
  }
}
</script>
