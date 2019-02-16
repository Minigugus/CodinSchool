<template>
  <div class="ui container segment">
    <!-- Ecran de chargement de la page -->
    <div v-if="$apollo.queries.roles.loading" class="ui text vertical segment container loading"></div>
    <!--/ Ecran de chargement de la page -->

    <!-- Contenu de la page -->
    <div v-else class="ui container stripe">
      <h2 class="ui center aligned header">
        <div class="content">
          Gestion des rôles
        </div>
      </h2>

      <!-- Tableau de gestion des rôles -->
      <table class="ui celled table table-center">
        <thead>
          <tr>
            <th>id</th>
            <th>Rôle</th>
            <!-- TODO: Placer des messages d'explication -->
            <th title="Un message d'explication">Par défaut</th>

            <!-- TODO: Query liste des permissions disponibles -->
            <th v-for="(aPermission, index) in permissions" :key="'permission-' + index">
              {{ aPermission }}
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Liste des rôles et leur permission associée -->
          <tr v-for="aRole in roles" :key="'role-' + aRole.id">
            <td>{{ aRole.id }}</td>
            <!-- TODO: Modifier le nom du rôle -->
            <td>{{ aRole.nom }}</td>
            <td>
              <!-- TODO: Liaison Apollo -->
              <sui-checkbox v-model="aRole.parDefaut" toggle disabled />
            </td>
            <td
              v-for="(aPermission, index) in permissions"
              :key="`role-${aRole.id}-permission-${index}`"
            >
              <!-- TODO: trouver un moyen de le lier au state
              <sui-checkbox v-model="aRole.permissions" toggle disabled />
              -->
              <ApolloMutation
                :mutation="require('@/graphql/Administration/EditerRole.gql')"
                :variables="{
                  id: aRole.id,
                  role: {
                    id: aRole.id,
                    nom: aRole.nom,
                    parDefaut: aRole.parDefaut,
                    permissions: possedePermission(aRole, aPermission)
                      ? permissions.filter(x => x !== aPermission)
                      : aRole.permissions.concat(aPermission)
                  }
                }"
                @error="chargerErreur"
                @done="() => {}"
              >
                <!-- TODO: Notification de succès -->
                <template slot-scope="{ mutate, loading }">
                  <div v-show="loading" class="ui active centered inline loader small"></div>
                  <input v-show="!loading" type="checkbox" :checked="possedePermission(aRole, aPermission)" @change="mutate()" />
                </template>
              </ApolloMutation>
            </td>
          </tr>
          <!--/ Liste des rôles et leur permission associée -->
        </tbody>
      </table>
      <!--/ Tableau de gestion des rôles -->

      <Alerte ref="erreurs" :type-alerte="typeAlerte" />
    </div>
    <!--/ Contenu de la page -->
  </div>
</template>

<script>
import Utilisateur from '@/mixins/Utilisateur'
import Alerte from '@/components/Alerte.vue'

import Roles from '@/graphql/Administration/Roles.gql'
// import Role from '@/graphql/Administration/Role.gql'

export default {
  name: 'GererRoles',
  components: {
    Alerte
  },
  mixins: [Utilisateur],
  apollo: {
    roles: Roles
  },
  data() {
    return {
      typeAlerte: 'Erreur',
      permissions: [
        'GESTION_UTILISATEUR',
        'GESTION_ROLE',
        'GESTION_NIVEAU',
        'GESTION_EXERCICE'
      ]
    }
  },
  methods: {
    // Savoir si un rôle possède une permission
    possedePermission: (role, permission) => role.permissions.includes(permission),

    // Charger une erreur GraphQL envoyée par Apollo dans la liste des erreurs
    chargerErreur(errorObject) {
      const { gqlError } = errorObject
      if (!gqlError) return console.error(errorObject)

      // Affichage de l'erreur dans l'alerte
      this.$refs.erreurs.viderAlerte()
      this.typeAlerte = 'Erreur'
      this.$refs.erreurs.ajouterAlerte(gqlError.message)
    }
  }
}
</script>

<style>
.table-center th, td {
  text-align: center !important;
}
th[title] {
  cursor: help !important;
}
</style>
