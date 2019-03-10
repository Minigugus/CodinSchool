<template>
  <div class="ui text vertical segment container">
    <!-- Erreur de chargement de la page -->
    <div v-if="erreurLoadingUser" class="ui text vertical segment container">
      <router-link to="/Administration/gererUtilisateurs" class="ui button left labeled icon" tag="button">
        <i class="left arrow icon"></i>
        Retour à la liste des utilisateurs
      </router-link>
      <Alerte type-alerte="Erreur" :liste-msg="[erreurLoadingUser]" :fermable="false" />
    </div>
    <!--/ Erreur de chargement de la page -->

    <!-- Ecran de chargement de la page -->
    <div v-else-if="!erreurLoadingUser && $apollo.queries.utilisateur.loading" class="ui text vertical segment container loading"></div>
    <!--/ Ecran de chargement de la page -->

    <!-- Alerte de notification d'utilisateur supprimé -->
    <div v-else-if="userSupprime" class="ui text vertical segment container">
      <router-link to="/Administration/gererUtilisateurs" class="ui button left labeled icon" tag="button">
        <i class="left arrow icon"></i>
        Retour à la liste des utilisateurs
      </router-link>
      <Alerte type-alerte="Succès" :liste-msg="[userSupprime]" :fermable="false" />
    </div>
    <!--/ Alerte de notification d'utilisateur supprimé -->

    <!-- Contenu de la page -->
    <div v-else>
      <!-- Modal de confirmation de suppression d'utilisateur -->
      <sui-modal v-model="modalConfirmationSuppression" class="bgTransparent">
        <sui-modal-header>Supprimer l'utilisateur "{{ utilisateur.prenom + ' ' + utilisateur.nom }}"</sui-modal-header>
        <sui-modal-content>
          <sui-modal-description>
            <sui-header>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</sui-header>
            <p>Cette action est irréversible.</p>
          </sui-modal-description>
        </sui-modal-content>
        <sui-modal-actions>
          <sui-button secondary @click.native="modalConfirmationSuppression = false">Annuler</sui-button>
          <sui-button negative @click.native="supprimerUtilisateur">Valider la suppression</sui-button>
        </sui-modal-actions>
      </sui-modal>
      <!--/ Modal de confirmation de suppression d'utilisateur -->

      <!-- Fil d'ariane -->
      <div class="ui large breadcrumb">
        <router-link to="/Administration/gererUtilisateurs" class="section">Liste des utilisateurs</router-link>
        <i class="right arrow icon divider"></i>
        <div class="active section">Utilisateur "{{ utilisateur.prenom + ' ' + utilisateur.nom }}"</div>
      </div>
      <!--/ Fil d'ariane -->

      <h1 class="ui center aligned header">
        Edition d'utilisateur
        <h3>"{{ utilisateur.prenom + ' ' + utilisateur.nom }}"</h3>
      </h1>

      <!-- Formulaire d'édition de l'utilisateur -->
      <div class="ui container segment stripe">
        <ApolloMutation
          :mutation="require('@/graphql/Administration/EditerUtilisateur.gql')"
          :variables="{
            id: idUser,
            modifications: {
              roles: champs.utilisateur.roles.v,
              motDePasse: champs.utilisateur.motDePasse.v,
              nom: utilisateur.nom,
              prenom: utilisateur.prenom,
              dateNaissance: utilisateur.dateNaissance,
              adresse: utilisateur.adresse,
              codePostal: utilisateur.codePostal,
              emailPrimaire: utilisateur.emailPrimaire,
              emailSecondaire: utilisateur.emailSecondaire,
              emailVisible: champs.utilisateur.emailVisible.v,
              telephonePrimaire: utilisateur.telephonePrimaire,
              telephoneSecondaire: utilisateur.telephoneSecondaire,
              telephoneVisible: champs.utilisateur.telephoneVisible.v,
              diplome: utilisateur.diplome,
              anneeDiplome: utilisateur.anneeDiplome,
              siteWeb: utilisateur.siteWeb,
              avatar: utilisateur.avatar
            }
          }"
          @error="chargerErreur"
          @done="utilisateurModif"
        >
          <template slot-scope="{ mutate, loading }">
            <form @submit.prevent="checkForm() && mutate()" :class="{ loading }" class="ui form" novalidate>
              <form-champs
                v-model="utilisateur.id"
                nom="Identifiant"
                id="id"
                disabled
              />
              <!-- Champs id bloqué : https://github.com/Minigugus/CodinSchool/issues/20 -->

              <form-champs
                v-model="utilisateur.nom"
                nom="Nom"
                id="nom"
                :err="champs.utilisateur.nom.err"
              />

              <form-champs
                v-model="utilisateur.prenom"
                nom="Prénom"
                id="prenom"
                :err="champs.utilisateur.prenom.err"
              />

              <form-champs
                v-model="champs.utilisateur.motDePasse.v"
                nom="Mot de passe"
                id="motDePasse"
                :err="champs.utilisateur.motDePasse.err"
              />

              <!-- Champs de modification des rôles du l'utilisateur (Permission 'GESTION_UTILISATEUR' requise) -->
              <div v-if="!moi.permissions.includes('GESTION_UTILISATEUR')" class="field disabled">
                <!-- L'éditeur ne possède pas la permission d'éditer les rôles -->
                <label for="roles">Rôles</label>
                <input type="text" :value="utilisateur.roles.map(x => x.nom).join(', ')" id="roles" />
                <p>La permission "GESTION_UTILISATEUR" est requise pour éditer les rôles de l'utilisateur.</p>
              </div>
              <div v-else class="field" :class="{ error: champs.utilisateur.roles.err.length > 0 }">
                <!-- L'éditeur possède la permission d'éditer les rôles -->
                <label for="roles">Rôles</label>
                <sui-dropdown
                  multiple
                  fluid
                  :options="roles"
                  placeholder="Rôles"
                  search
                  selection
                  v-model="champs.utilisateur.roles.v"
                />
                <div v-for="(anError, index) in champs.utilisateur.roles.err" :key="'erreur-roles-' + index" class="ui basic red pointing prompt label transition">{{ anError }}</div>
              </div>
              <!--/ Champs de modification des rôles du l'utilisateur (Permission 'GESTION_UTILISATEUR' requise) -->

              <form-champs
                v-model.number="utilisateur.dateNaissance"
                nom="Date de naissance"
                id="dateNaissance"
                type="number"
                :err="champs.utilisateur.dateNaissance.err"
              />

              <form-champs
                v-model="utilisateur.adresse"
                nom="Adresse"
                id="adresse"
                :err="champs.utilisateur.adresse.err"
              />

              <form-champs
                v-model="utilisateur.codePostal"
                nom="Code postal"
                id="codePostal"
                :err="champs.utilisateur.codePostal.err"
              />

              <form-champs
                v-model="utilisateur.emailPrimaire"
                nom="Email primaire"
                id="emailPrimaire"
                :err="champs.utilisateur.emailPrimaire.err"
              />

              <form-champs
                v-model="utilisateur.emailSecondaire"
                nom="Email secondaire"
                id="emailSecondaire"
                :err="champs.utilisateur.emailSecondaire.err"
              />

              <form-champs
                v-model="utilisateur.emailVisible"
                nom="Email visible par les autres utilisateurs"
                type="checkbox"
                id="emailVisible"
                :err="champs.utilisateur.emailVisible.err"
              />

              <form-champs
                v-model="utilisateur.telephonePrimaire"
                nom="Téléphone primaire"
                id="telephonePrimaire"
                :err="champs.utilisateur.telephonePrimaire.err"
              />

              <form-champs
                v-model="utilisateur.telephoneSecondaire"
                nom="Téléphone secondaire"
                id="telephoneSecondaire"
                :err="champs.utilisateur.telephoneSecondaire.err"
              />

              <form-champs
                v-model="utilisateur.telephoneVisible"
                nom="Téléphone visible par les autres utilisateurs"
                type="checkbox"
                id="telephoneVisible"
                :err="champs.utilisateur.telephoneVisible.err"
              />

              <form-champs
                v-model="utilisateur.diplome"
                nom="Diplôme en cours"
                id="diplome"
                :err="champs.utilisateur.diplome.err"
              />

              <form-champs
                v-model.number="utilisateur.anneeDiplome"
                type="number"
                nom="Année du diplôme en cours"
                id="anneeDiplome"
                :err="champs.utilisateur.anneeDiplome.err"
              />

              <form-champs
                v-model="utilisateur.siteWeb"
                nom="Site web"
                id="siteWeb"
                :err="champs.utilisateur.siteWeb.err"
              />

              <form-champs
                v-model="utilisateur.avatar"
                nom="Avatar"
                id="avatar"
                :err="champs.utilisateur.avatar.err"
                disabled
              />

              <button
                class="ui button"
                type="submit"
              >
                Modifier l'utilisateur
              </button>
            </form>

            <Alerte ref="erreurs" :type-alerte="typeAlerte" />
          </template>
        </ApolloMutation>
      </div>
      <!--/ Formulaire d'édition de l'utilisateur -->

      <!-- Bouton de suppression de l'utilisateur -->
      <div class="text-center mt-4">
        <button @click="modalConfirmationSuppression = true" class="ui button negative right labeled icon text-center">
          <i class="trash alternate icon"></i>
          Supprimer l'utilisateur
        </button>
      </div>
      <!--/ Bouton de suppression de l'utilisateur -->
    </div>
  </div>
</template>

<script>
import Utilisateur from '@/graphql/Utilisateur/Utilisateur.gql'
import { checkPermissions, isEmail } from '@/functions'

import Alerte from '@/components/Alerte.vue'
import FormChamps from '@/components/FormChamps.vue'

import Roles from '@/graphql/Administration/Roles.gql'
import Utilisateurs from '@/graphql/Administration/Utilisateurs.gql'
import UtilisateurId from '@/graphql/Administration/Utilisateur.gql'
import SupprimerUtilisateur from '@/graphql/Administration/SupprimerUtilisateur.gql'

export default {
  name: 'EditerUtilisateur',
  components: {
    Alerte,
    FormChamps
  },
  props: {
    idUser: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      erreurLoadingUser: false,

      champs: {
        utilisateur: {
          nom: { err: [] },
          prenom: { err: [] },
          motDePasse: { v: '', err: [] },
          dateNaissance: { err: [] },
          adresse: { err: [] },
          codePostal: { err: [] },
          emailPrimaire: { err: [] },
          emailSecondaire: { err: [] },
          // TODO: Ajout dans la query graphql (le serveur ne le contient pas)
          emailVisible: { v: false, err: [] },
          telephonePrimaire: { err: [] },
          telephoneSecondaire: { err: [] },
          // TODO: Ajout dans la query graphql (le serveur ne le contient pas)
          telephoneVisible: { v: false, err: [] },
          diplome: { err: [] },
          anneeDiplome: { err: [] },
          siteWeb: { err: [] },
          avatar: { err: [] },
          roles: { v: [], err: [] }
        }
      },
      typeAlerte: 'Erreur',

      modalConfirmationSuppression: false,
      userSupprime: false
    }
  },
  apollo: {
    moi: {
      query: Utilisateur,
      result({ data, loading }) {
        checkPermissions(['GESTION_UTILISATEUR']).call(this, { data, loading })
        if (!loading) this.champs.utilisateur.roles.v = data.moi.roles.map(x => x.id)
      }
    },
    roles() {
      return {
        query: Roles,
        result({ data, loading }) {
          if (!loading)
            this.roles = data.roles.map(x => ({
              text: `${x.nom} (${x.permissions.join(', ')})`,
              value: x.id,
              key: x.id
            }))
        }
      }
    },
    utilisateurs: Utilisateurs,
    utilisateur() {
      return {
        query: UtilisateurId,
        variables: {
          id: this.idUser
        },
        error: errorObject => {
          const { gqlError } = errorObject
          if (!gqlError) return console.error(errorObject)
          this.erreurLoadingUser = gqlError.message
        }
      }
    }
  },

  methods: {
    checkForm() {
      this.$refs.erreurs.viderAlerte()
      this.typeAlerte = 'Erreur'
      let tousRemplis = true
      let tousValides = true

      // Réinitialisation des erreurs
      for (const el in this.champs.utilisateur)
        this.champs.utilisateur[el].err = [];

      // On vérifie que les champs obligatoires sont remplis
      ['nom', 'prenom', 'emailPrimaire', 'dateNaissance'].forEach(x => {
        if (this.utilisateur[x] === '') {
          this.champs.utilisateur[x].err.push('Champs vide.')
          tousRemplis = false
        }
      })
      if (this.champs.utilisateur.motDePasse.v === '') {
        this.champs.utilisateur.motDePasse.err.push('Champs vide.')
        tousRemplis = false
      }


      // On vérifie que les adresses email sont valides
      ['emailPrimaire', 'emailSecondaire'].forEach(x => {
        if (this.utilisateur[x] && !isEmail(this.utilisateur[x])) {
          this.champs.utilisateur[x].err.push('Adresse email invalide.')
          tousValides = false
        }
      })

      if (!tousRemplis) this.$refs.erreurs.ajouterAlerte('Certains champs sont obligatoires.')
      if (!tousValides) this.$refs.erreurs.ajouterAlerte('Il y a des erreurs dans le formulaire.')
      return tousRemplis && tousValides
    },

    // Charger une erreur GraphQL envoyée par Apollo dans la liste des erreurs
    chargerErreur(errorObject) {
      const { gqlError } = errorObject
      if (!gqlError) return console.error(errorObject)

      // TODO: Code VALIDATION_ECHOUEE côté serveur à ajouter
      // // Un ou plusieurs champs sont invalides
      // if (gqlError.extensions.code === 'VALIDATION_ECHOUEE')
      //   gqlError.extensions.exception.props.champs.forEach(x =>
      //     (this.form[x.nom] && this.form[x.nom].err.push(x.message)))

      // Affichage de l'erreur dans l'alerte
      this.$refs.erreurs.viderAlerte()
      this.typeAlerte = 'Erreur'
      this.$refs.erreurs.ajouterAlerte(gqlError.message)
    },

    async supprimerUtilisateur() {
      const apolloClient = this.$apollo.provider.defaultClient

      await apolloClient.mutate({
        mutation: SupprimerUtilisateur,
        variables: {
          id: this.utilisateur.id
        },
        update: store => {
          try {
            // Lire le cache pour récupérer le contenu actuel
            const data = store.readQuery({ query: Utilisateurs })
            const indexUser = data.utilisateurs.findIndex(x => x.id === this.utilisateur.id)
            if (indexUser !== -1) {
              data.utilisateurs.splice(indexUser, 1)
              this.modalConfirmationSuppression = false

              // Appliquer la modification en cache
              store.writeQuery({ query: Utilisateurs, data })
              this.userSupprime = `L'utilisateur "${this.idUser}" a été supprimé.`
              return
            }
          }
          catch (err) {
            console.error(err)
            this.$refs.erreurs.viderAlerte()
            this.typeAlerte = 'Erreur'
            this.$refs.erreurs.ajouterAlerte(err.message)
          }
        }
      }
      )
    },

    utilisateurModif({ data: { editerUtilisateur } }) {
      try {
        const apolloClient = this.$apollo.provider.defaultClient
        const data = apolloClient.readQuery({ query: Utilisateurs })
        const indexUser = data.utilisateurs.findIndex(x => x.id === editerUtilisateur.id)
        if (indexUser !== -1) {
          data.utilisateurs[indexUser] = editerUtilisateur
          // Appliquer la modification en cache
          apolloClient.writeQuery({ query: Utilisateurs, data })

          this.$refs.erreurs.viderAlerte()
          this.typeAlerte = 'Succès'
          this.$refs.erreurs.ajouterAlerte(`L'utilisateur "${this.idUser}" a été modifié.`)
        }
      }
      catch (err) {
        console.error(err)
        this.$refs.erreurs.viderAlerte()
        this.typeAlerte = 'Erreur'
        this.$refs.erreurs.ajouterAlerte(err.message)
      }
    }
  }
}
</script>

<style scoped>
.bgTransparent {
  background-color: transparent !important;
}
</style>

