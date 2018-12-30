<template>
  <div class="apollo-example">
    <ApolloQuery
      :query="require('@/graphql/Utilisateur.gql')"
    >
      <template slot-scope="{ result: { loading, error, data } }">
        <div v-if="loading" class="loading apollo">Chargement ...</div>

        <Alerte v-else-if="error" typeAlerte="Erreur" :messages="error.graphQLErrors.map(x => x.message)" />

        <div v-else-if="data" class="result apollo">{{ data }}</div>

        <div v-else class="no-result apollo">No result :(</div>
      </template>
    </ApolloQuery>
  </div>
</template>

<script>

import Alerte from '@/components/Alerte.vue'

export default {
  name: 'profil',
  components: { Alerte },
  data() {
    return {
      email: 'mail@example.com',
      pseudo: 'rigwzzzzild2z',
      motDePasse:	'pseudo',
      nom: 'Sauvage',
      prenom: 'Prenom',
      dateNaissance: 2018
    }
  },

  computed: {
    formValid() {
      return true
    }
  },

  methods: {}
}
</script>

<style scoped>
.form,
.input,
.apollo,
.message {
  padding: 12px;
}

label {
  display: block;
  margin-bottom: 6px;
}

.input {
  font-family: inherit;
  font-size: inherit;
  border: solid 2px #ccc;
  border-radius: 3px;
}

.error {
  color: red;
}

.images {
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  grid-auto-rows: 300px;
  grid-gap: 10px;
}

.image-item {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ccc;
  border-radius: 8px;
}

.image {
  max-width: 100%;
  max-height: 100%;
}

.image-input {
  margin: 20px;
}
</style>
