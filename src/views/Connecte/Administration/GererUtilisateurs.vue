<template>
  <div class="ui container">
    <h2 class="ui center aligned header">
      <div class="content">Gestion des utilisateurs</div>
    </h2>

    <ApolloQuery :query="require('@/graphql/Administration/Utilisateurs.gql')">
      <template v-slot="{ result: { error, data }, isLoading }">
        <!-- Chargement -->
        <sui-loader v-if="isLoading" active centered inline />

        <!-- Erreur -->
        <div v-else-if="error">
          <Alerte :liste-msg="[error.message]" type-alerte="Erreur" />
        </div>

        <!-- Result -->
        <div v-else-if="data" class="ui container">
          <!-- Modal de confirmation de suppression d'utilisateur -->
          <Modale
            header="Supprimer l'utilisateur"
            action="Valider la suppression"
            @validate="supprimerUtilisateur"
            ref="modaleDeleteUser"
          >
            <sui-header>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</sui-header>
            <p>L'utilisateur n'aura plus accès à la plateforme. Tous ses travaux seront supprimés.</p>
            <p>Cette action est irréversible.</p>
          </Modale>
          <!--/ Modal de confirmation de suppression d'utilisateur -->


          <!-- Tableau de gestion des utilisateurs -->
          <table class="ui celled table table-center">
            <thead>
              <tr>
                <th>Effacer</th>
                <th>id</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Date d'inscription</th>
                <th>Rôles</th>
                <th>Editer</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="aUser in data.utilisateurs" :key="'user-' + aUser.id">
                <td>
                  <!-- Bouton de suppression d'utilisateur -->
                  <button
                    @click="demandeSuppression(aUser.id)"
                    :disabled="aUser.id === moi.id"
                    title="Supprimer l'utilisateur"
                    class="ui icon button negative tiny"
                  >
                    <i class="trash alternate icon"></i>
                  </button>
                  <!--/ Bouton de suppression d'utilisateur -->
                </td>
                <td :title="aUser.id">{{ aUser.id.slice(0, 8) }}...</td>
                <td>{{ aUser.prenom + ' ' + aUser.nom }}</td>
                <td>{{ aUser.emailPrimaire }}</td>
                <td>{{ new Date(parseInt(aUser.dateInscription, 10)).toJSON() }}</td>
                <td>
                  {{ listeRoles(aUser) }}
                </td>
                <td>
                  <!-- Bouton de redirection vers page d'édition d'utilisateur -->
                  <router-link :to="`/Administration/editerUtilisateur/${aUser.id}`" class="ui icon button primary tiny" tag="button">
                    <i class="pencil alternate icon"></i>
                  </router-link>
                  <!--/ Bouton de redirection vers page d'édition d'utilisateur -->
                </td>
              </tr>
            </tbody>
          </table>
          <!--/ Tableau de gestion des utilisateurs -->

          <!-- Bouton d'ajout d'utilisateur -->
          <div class="text-center">
            <router-link to="/Administration/creerUtilisateur/" class="ui button right labeled icon text-center" tag="button">
              <i class="plus icon"></i>
              Créer un utilisateur
            </router-link>
          </div>
          <!--/ Bouton d'ajout d'utilisateur -->

          <Alerte ref="notifications" :type-alerte="typeAlerte" />
        </div>
      </template>
    </ApolloQuery>
  </div>
</template>

<script>
import Utilisateur from '@/graphql/Utilisateur/Utilisateur.gql'
import { checkPermissions } from '@/functions'

import Alerte from '@/components/Alerte.vue'
import Modale from '@/components/Modale.vue'

import Utilisateurs from '@/graphql/Administration/Utilisateurs.gql'
import SupprimerUtilisateur from '@/graphql/Administration/SupprimerUtilisateur.gql'

export default {
  name: 'GererUtilisateurs',
  components: {
    Alerte,
    Modale
  },
  apollo: {
    moi: {
      query: Utilisateur,
      result: checkPermissions(['GESTION_UTILISATEUR'])
    }
  },
  data() {
    return {
      modalConfirmationSuppression: false,
      modaleUserSupprId: null,
      typeAlerte: 'Erreur'
    }
  },

  computed: {
    listeRoles() {
      return aUser => aUser.roles.map(x => x.nom).join(', ')
    }
  },

  methods: {
    // Afficher la modal de confirmation de suppression d'utilisateur
    demandeSuppression(aUserId) {
      this.$refs.modaleDeleteUser.show()
      this.modaleUserSupprId = aUserId
    },

    // Supprimer un rôle
    async supprimerUtilisateur() {
      const apolloClient = this.$apollo.provider.defaultClient
      await apolloClient.mutate({
        mutation: SupprimerUtilisateur,
        variables: {
          id: this.modaleUserSupprId
        },
        update: (store, { data: { supprimerUtilisateur: idUtilisateurSupprime } }) => {
          const oldData = store.readQuery({ query: Utilisateurs })
          const index = oldData.utilisateurs.findIndex(x => x.id === idUtilisateurSupprime)
          if (index !== -1) {
            oldData.utilisateurs.splice(index, 1)
            store.writeQuery({ query: Utilisateurs, data: oldData })

            this.modaleUserSupprId = null
            this.$refs.notifications.viderAlerte()
            this.typeAlerte = 'Succès'
            this.$refs.notifications.ajouterAlerte('L\'utilisateur a été supprimé.')
          }
        }
      })
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
