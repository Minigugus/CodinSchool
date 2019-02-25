<template>
  <div class="ui container segment">
    <!-- Ecran de chargement de la page -->
    <div v-if="$apollo.queries.permissions.loading" class="ui text vertical segment container loading"></div>
    <!--/ Ecran de chargement de la page -->

    <!-- Contenu de la page -->
    <div v-else class="ui container">
      <!-- Lien de retour vers la liste des rôles -->
      <div>
        <router-link to="/Administration/gererRoles" class="ui button left labeled icon" tag="button">
          <i class="left arrow icon"></i>
          Retour vers la liste des rôles
        </router-link>
      </div>
      <!--/ Lien de retour vers la liste des rôles -->

      <h2 class="ui center aligned header">
        <div class="content">
          Création d'un rôle
        </div>
      </h2>

      <!-- Formulaire de création de rôle -->
      <ApolloMutation
        :mutation="require('@/graphql/Administration/CreerRole.gql')"
        :variables="{
          role: {
            nom: champs.role.nom.v,
            permissions: champs.role.permissions.v,
            parDefaut: champs.role.parDefaut.v
          }
        }"
        @error="chargerErreur"
        @done="roleCree"
      >
        <template slot-scope="{ mutate, loading }">
          <form @submit.prevent="checkForm() && mutate()" :class="{ loading }" class="ui form" novalidate>
            <form-champs
              v-model="champs.role.nom.v"
              nom="Nom"
              id="nom"
              :err="champs.role.nom.err"
            />

            <label>Liste des permissions</label>
            <table class="ui celled table">
              <thead>
                <tr>
                  <th>Permission</th>
                  <th>Attribuée</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(aPermission, index) in permissions" :key="'permission-' + index">
                  <td>{{ aPermission }}</td>
                  <td>
                    <input
                      type="checkbox"
                      :checked="possedePermission(aPermission)"
                      @change="togglePermission(aPermission)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="field">
              <label for="parDefaut">Par défaut</label>
              <input type="checkbox" class="ui checkbox" v-model="champs.role.parDefaut.v" id="parDefaut" />
            </div>

            <button class="ui button" type="submit">Créer le rôle</button>
          </form>

          <Alerte ref="erreurs" :type-alerte="typeAlerte" />
        </template>
      </ApolloMutation>
      <!--/ Formulaire de création de rôle -->
    </div>
    <!--/ Contenu de la page -->
  </div>
</template>

<script>
import Utilisateur from '@/graphql/Utilisateur/Utilisateur.gql'
import { checkPermissions } from '@/functions'

import Alerte from '@/components/Alerte.vue'
import FormChamps from '@/components/FormChamps.vue'

import Roles from '@/graphql/Administration/Roles.gql'
import Permissions from '@/graphql/Administration/Permissions.gql'

export default {
  name: 'CreerRoles',
  components: {
    Alerte,
    FormChamps
  },
  apollo: {
    moi: {
      query: Utilisateur,
      result({ loading, data }) {
        if (loading) return
        // Vérification que l'utilisateur possède les permissions requises par la route
        const permissionsRequises = ['GESTION_ROLE']
        checkPermissions(data.moi.permissions, permissionsRequises, this.$router)
      }
    },
    roles: Roles,
    permissions: {
      query: Permissions,
      update({__type: { enumValues } }) {
        return enumValues.map(x => x.name)
      }
    }
  },
  data() {
    return {
      champs: {
        role: {
          id: { v: '', err: [] },
          nom: { v: '', err: [] },
          permissions: { v: [], err: [] },
          parDefaut: { v: false, err: [] }
        }
      },

      typeAlerte: 'Erreur'
    }
  },
  methods: {
    // Savoir si le rôle possède une permission
    possedePermission(permission) {
      return this.champs.role.permissions.v.includes(permission)
    },

    // Toggle l'activation de la permission sur le rôle
    togglePermission(permission) {
      this.possedePermission(permission)
        ? this.champs.role.permissions.v = this.champs.role.permissions.v.filter(x => x !== permission)
        : this.champs.role.permissions.v = this.champs.role.permissions.v.concat(permission)
    },

    // Charger une erreur GraphQL envoyée par Apollo dans la liste des erreurs
    chargerErreur(errorObject) {
      const { gqlError } = errorObject
      if (!gqlError) return console.error(errorObject)

      // Affichage de l'erreur dans l'alerte
      this.$refs.erreurs.viderAlerte()
      this.typeAlerte = 'Erreur'
      this.$refs.erreurs.ajouterAlerte(gqlError.message)
    },

    checkForm() {
      this.$refs.erreurs.viderAlerte()
      this.typeAlerte = 'Erreur'
      let tousRemplis = true

      // Vider la liste des erreurs
      for (const el in this.champs.role)
        this.champs.role[el].err = []

      if (this.champs.role.nom.v === '') {
        this.champs.role.nom.err.push('Champs vide.')
        tousRemplis = false
      }
      if (!tousRemplis) this.$refs.erreurs.ajouterAlerte('Tous les champs sont obligatoires.')
      return tousRemplis
    },

    roleCree({ data: { creerRole: nouveauRole } }) {
      // Mise à jour du cache
      const apolloClient = this.$apollo.provider.defaultClient
      const oldData = apolloClient.readQuery({ query: Roles })
      oldData.roles.push(nouveauRole)
      apolloClient.writeQuery({ query: Roles, data: oldData })
      this.$refs.erreurs.viderAlerte()
      this.typeAlerte = 'Succès'
      this.$refs.erreurs.ajouterAlerte(`Le rôle "${nouveauRole.nom}" a été ajouté.`)
    }
  }
}
</script>
