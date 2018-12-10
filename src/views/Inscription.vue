<template>
  <div class="apollo-example">
    <ApolloQuery
      :query="require('../graphql/RecupererProfil.gql')"
    >
      <template slot-scope="{ result: { loading, error, data } }">
        <div v-if="loading" class="loading apollo">Loading...</div>

        <div v-else-if="error" class="error apollo">An error occured</div>

        <div v-else-if="data" class="result apollo">{{ data }}</div>

        <!-- No result -->
        <div v-else class="no-result apollo">No result :(</div>
      </template>
    </ApolloQuery>

    <h1>MUTATION SA MERE</h1>

    <ApolloMutation
      :mutation="require('../graphql/Inscription.gql')"
      :variables="{
        nouvelUtilisateur: {
          email,
          pseudo,
          motDePasse,
          nom,
          prenom,
          dateNaissance
        }
      }"
      class="form"
      @done="injecterJeton"
    >
      <template slot-scope="{ mutate, loading, error }">
        <form v-on:submit.prevent="formValid && mutate()">
          <!-- Loading -->
          <div v-if="loading" class="loading apollo">Loading...</div>

          <!-- Error -->
          <div v-else-if="error" class="error apollo">An error occured</div>


          <label for="field-pseudo">pseudo</label>
          <input
            id="field-pseudo"
            v-model="pseudo"
            placeholder="pseudo"
            class="input"
          >
          <input type="submit" value="Valider">
        </form>
      </template>
    </ApolloMutation>
  </div>
</template>

<script>
import { onLogin } from '../vue-apollo'
import { RECUPERER_PROFIL } from '../graphql/RecupererProfil.gql'

export default {
  name: 'inscription',
  data() {
    return {
      email: 'contact@asauvage.fr',
      pseudo: 'rigwzzzzild2z',
      motDePasse:	'rigwild',
      nom: 'Sauvage',
      prenom: 'Antoine',
      dateNaissance: 2018
    }
  },

  computed: {
    formValid() {
      return true
    }
  },

  methods: {
    // Injecter le jeton de connexion dans Apollo et mettre en cache le profil
    async injecterJeton(result) {
      const apolloClient = this.$apollo.provider.defaultClient

      // Mettre le jeton à jour et recharger le cache
      const jeton = 'Bearer ' + result.data.inscription.moi.jeton
      await onLogin(apolloClient, jeton)

      // Mise à jour du cache
      apolloClient.writeQuery({
        query: RECUPERER_PROFIL,
        data: {
          userCurrent: result.data.moi
        }
      })
    }
  }
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
