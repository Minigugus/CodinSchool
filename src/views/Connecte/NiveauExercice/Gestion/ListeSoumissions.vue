<template>
  <div class="ui container">
    <h2 class="text-center">Liste des soumissions</h2>

    <ApolloQuery :query="require('@/graphql/NiveauExercice/Soumissions.gql')">
      <template v-slot="{ result: { error, data }, isLoading }">
        <!-- Chargement -->
        <sui-loader v-if="isLoading" active centered inline />

        <!-- Erreur -->
        <div v-else-if="error">
          <Alerte :liste-msg="[error.message]" type-alerte="Erreur" :fermable="false" />
        </div>

        <!-- Result -->
        <div v-else-if="data" class="ui container">
          <!-- Liste des niveaux -->
          <sui-table celled>
            <sui-table-header>
              <sui-table-row text-align="center">
                <sui-table-header-cell>id</sui-table-header-cell>
                <sui-table-header-cell>Timestamp</sui-table-header-cell>
                <sui-table-header-cell>Exercice</sui-table-header-cell>
                <sui-table-header-cell>Nombre tests réussis</sui-table-header-cell>
              </sui-table-row>
            </sui-table-header>
            <sui-table-body>
              <sui-table-row v-for="aSoumission in data.soumissions" :key="aSoumission.id" text-align="center">
                <sui-table-cell v-text="aSoumission.id" text-align="center" />
                <sui-table-cell v-text="new Date(parseInt(aSoumission.date, 10)).toJSON()" />
                <sui-table-cell>
                  <router-link :to="`/NiveauExercice/niveau/${aSoumission.exercice.niveau.id}`">{{ aSoumission.exercice.niveau.id }}</router-link>
                  <span>/</span>
                  <router-link :to="`/NiveauExercice/exercice/${aSoumission.exercice.id}`">{{ aSoumission.exercice.id }}</router-link>
                </sui-table-cell>
                <sui-table-cell>{{ aSoumission.nbPasses }}/{{ aSoumission.nbTests }}</sui-table-cell>
              </sui-table-row>
            </sui-table-body>
          </sui-table>
        </div>
      </template>
    </ApolloQuery>
  </div>
</template>

<script>
import Alerte from '@/components/Alerte.vue'

import Utilisateur from '@/graphql/Utilisateur/Utilisateur.gql'
import { checkPermissions } from '@/functions'

export default {
  name: 'ListeSoumissions',
  components: {
    Alerte
  },
  data() {
    return {}
  },

  apollo: {
    moi: {
      query: Utilisateur,
      result: checkPermissions(['GESTION_NIVEAU', 'GESTION_EXERCICE'])
    }
  },

  methods: {}
}
</script>
