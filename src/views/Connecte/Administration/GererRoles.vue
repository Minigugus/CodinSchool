<template>
  <div class="ui container">
    <h2 class="text-center">Gestion des rôles</h2>

    <sui-loader v-if="$apollo.queries.permissions.loading && $apollo.queries.roles.loading" active centered inline />
    <!-- Result -->
    <div v-else class="ui container">
      <!-- Modal de confirmation de suppression de rôle -->
      <Modale
        header="Supprimer l'utilisateur"
        action="Valider la suppression"
        @validate="supprimerRole(suppressionRoleCible)"
        ref="modaleDeleteRole"
      >
        <sui-header>Êtes-vous sûr de vouloir supprimer le rôle "{{ suppressionRoleCible ? suppressionRoleCible.nom : '' }}" ?</sui-header>
        <p>L'ensemble des utilisateurs possédant ce rôle n'auront plus accès aux permissions qui lui sont associées.</p>
        <p>Cette action est irréversible.</p>

        <!-- On vérifie si l'utilisateur en cours possède le rôle à supprimer -->
        <div v-if="suppressionRoleCible && moi.roles.find(x => x.id === suppressionRoleCible.id)" class="mt-5">
          <h2><i class="exclamation triangle icon" /> Attention !</h2>
          <h3>
            Vous possédez le rôle à supprimer. Vérifiez que vous garderez la permission "GESTION_ROLE" après suppression
            avec un autre de vos rôles. Dans le cas contraire vous n'aurez plus la possibilité d'éditer les rôles.
          </h3>
        </div>
      </Modale>
      <!--/ Modal de confirmation de suppression de rôle -->

      <!-- Tableau de gestion des rôles -->
      <table class="ui celled table table-center">
        <thead>
          <tr>
            <th>id</th>
            <th>Rôle</th>
            <!-- TODO: Placer des messages d'explication en title -->
            <th title="Un message d'explication (TODO)">Par défaut</th>

            <th v-for="(aPermission, index) in permissions" :key="'permission-' + index">
              {{ aPermission }}
            </th>
            <th>Editer</th>
            <th>Effacer</th>
          </tr>
        </thead>
        <tbody>
          <!-- Liste des rôles et leur permission associée -->
          <tr v-for="aRole in roles" :key="'role-' + aRole.id">
            <template v-if="isEditionLoading && roleEnEdition === aRole.id">
              <td :colspan="5 + permissions.length">
                <sui-loader active centered inline />
              </td>
            </template>
            <template v-else>
              <td>{{ aRole.id }}</td>
              <td class="ui form">
                <form-champs
                  v-model="aRole.nom"
                  :disabled="!isRoleEnEdition(aRole.id)"
                  :err="!aRole.nom ? ['Le champs ne peut pas être vide.'] : undefined"
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  v-model="aRole.parDefaut"
                  :disabled="!isRoleEnEdition(aRole.id)"
                />
              </td>
              <td
                v-for="(aPermission, index) in permissions"
                :key="`role-${aRole.id}-permission-${index}`"
              >
                <input
                  type="checkbox"
                  @click="aRole.permissions = $event.target.checked
                    ? aRole.permissions.concat(aPermission)
                    : aRole.permissions.filter(x => x !== aPermission)"
                  :disabled="!isRoleEnEdition(aRole.id)"
                  :checked="possedePermission(aRole, aPermission)"
                />
              </td>
              <td>
                <!-- Bouton d'édition de rôle -->
                <button
                  v-if="!isRoleEnEdition(aRole.id)"
                  @click="roleEnEdition = aRole.id"
                  :disabled="roleEnEdition && !isRoleEnEdition(aRole.id)"
                  class="ui icon button primary tiny"
                >
                  <i class="pencil alternate icon" />
                </button>
                <button
                  v-else
                  :disabled="!aRole.nom"
                  @click="editerRole(aRole)"
                  class="ui icon button positive tiny"
                >
                  <i class="check alternate icon" />
                </button>
                <!--/ Bouton d'édition de rôle -->
              </td>
              <td>
                <!-- Bouton de suppression de rôle -->
                <button @click="(suppressionRoleCible = aRole) && $refs.modaleDeleteRole.show()" class="ui icon button negative tiny">
                  <i class="trash alternate icon" />
                </button>
                <!--/ Bouton de suppression de rôle -->
              </td>
            </template>
          </tr>
          <!--/ Liste des rôles et leur permission associée -->
        </tbody>
      </table>
      <!--/ Tableau de gestion des rôles -->

      <!-- Bouton d'ajout de rôle -->
      <div class="text-center">
        <router-link to="/Administration/creerRole/" class="ui button right labeled icon text-center" tag="button">
          <i class="plus icon"></i>
          Créer un rôle
        </router-link>
      </div>
      <!--/ Bouton d'ajout de rôle -->

      <Alerte ref="erreurs" :type-alerte="typeAlerte" />
    </div>
  </div>
  <!--/ Contenu de la page -->
</template>

<script>
import Utilisateur from '@/graphql/Utilisateur/Utilisateur.gql'
import { checkPermissions } from '@/functions'

import Alerte from '@/components/Alerte.vue'
import FormChamps from '@/components/FormChamps.vue'
import Modale from '@/components/Modale.vue'

import Roles from '@/graphql/Administration/Roles.gql'
import Permissions from '@/graphql/Administration/Permissions.gql'
import EditerRole from '@/graphql/Administration/EditerRole.gql'
import SupprimerRole from '@/graphql/Administration/SupprimerRole.gql'

export default {
  name: 'GererRoles',
  components: {
    Alerte,
    FormChamps,
    Modale
  },
  apollo: {
    moi: {
      query: Utilisateur,
      result: checkPermissions(['GESTION_ROLE'])
    },
    permissions: Permissions,
    roles: Roles
  },
  data() {
    return {
      // Garde en mémoire le rôle à supprimer dans la modale
      suppressionRoleCible: null,

      // Garde en mémoire le rôle en cours de modification
      roleEnEdition: null,
      // Définis sur le rôle en cours d'édition est en cours de chargement
      isEditionLoading: false,

      typeAlerte: 'Erreur'
    }
  },

  computed: {
    isRoleEnEdition() {
      return roleId => this.roleEnEdition === roleId
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
    },

    async editerRole(aRole) {
      this.$refs.erreurs.viderAlerte()
      this.isEditionLoading = true
      await this.$apollo.provider.defaultClient.mutate({
        mutation: EditerRole,
        variables: {
          id: aRole.id,
          role: {
            id: aRole.id,
            nom: aRole.nom,
            parDefaut: aRole.parDefaut,
            permissions: aRole.permissions
          }
        },
        update: () => {
          this.isEditionLoading = false
          this.typeAlerte = 'Succès'
          this.$refs.erreurs.ajouterAlerte(`Le rôle "${aRole.nom}" a été modifié.`)
          this.roleEnEdition = null
        }
      }).catch(this.chargerErreur)
    },

    async supprimerRole(aRole) {
      const apolloClient = this.$apollo.provider.defaultClient
      await apolloClient.mutate({
        mutation: SupprimerRole,
        variables: {
          id: aRole.id
        },
        update: (store, { data: { supprimerRole: idRoleSupprime } }) => {
          const oldData = store.readQuery({ query: Roles })
          const index = oldData.roles.findIndex(x => x.id === idRoleSupprime)
          if (index !== -1) {
            oldData.roles.splice(index, 1)
            store.writeQuery({ query: Roles, data: oldData })

            this.suppressionRoleCible = null
            this.$refs.erreurs.viderAlerte()
            this.typeAlerte = 'Succès'
            this.$refs.erreurs.ajouterAlerte(`Le rôle "${aRole.nom}" a été supprimé.`)
          }
        }
      }).catch(this.chargerErreur)
    },

    // Mise à jour du rôle en cache
    cacheRole({ data: { editerRole: roleModif } }) {
      const apolloClient = this.$apollo.provider.defaultClient
      const data = apolloClient.readQuery({ query: Roles })
      const index = data.roles.findIndex(x => x.id === roleModif.id)
      if (index !== -1) {
        data.roles[index] = roleModif
        apolloClient.writeQuery({ query: Roles, data })

        this.$refs.erreurs.viderAlerte()
        this.typeAlerte = 'Succès'
        this.$refs.erreurs.ajouterAlerte(`Le rôle "${roleModif.nom}" a été modifié.`)
      }
    },

    log(){
      console.log(arguments)
    }
  }
}
</script>

<style scoped>
.table-center th, td {
  text-align: center !important;
}
th[title] {
  cursor: help !important;
}
</style>
