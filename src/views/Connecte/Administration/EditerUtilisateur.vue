<template>
  <div class="ui text vertical segment container">
    <ApolloQuery
      :query="require('@/graphql/Administration/Utilisateur.gql')"
      :variables="{ id: idUser }"
      @result="!$event.loading && !$event.error && loadUserForm($event)"
    >
      <template v-slot="{ result: { error, data }, isLoading }">
        <!-- Chargement -->
        <sui-loader v-if="isLoading" active centered inline />

        <!-- Erreur -->
        <div v-else-if="error">
          <GoBack to="/Administration/gererUtilisateurs" text="Retour à la liste des utilisateurs" />
          <Alerte :liste-msg="[error.message]" type-alerte="Erreur" :fermable="false" />
        </div>

        <!-- Result -->
        <div v-else-if="data" class="ui container">
          <!-- Alerte de notification d'utilisateur supprimé -->
          <div v-if="userSupprime" class="ui text vertical segment container">
            <GoBack to="/Administration/gererUtilisateurs" text="Retour à la liste des utilisateurs" />
            <Alerte type-alerte="Succès" :liste-msg="[userSupprime]" :fermable="false" />
          </div>
          <!--/ Alerte de notification d'utilisateur supprimé -->

          <!-- Contenu de la page -->
          <div v-else>
            <!-- Modale de confirmation de suppression d'utilisateur -->
            <Modale
              header="Supprimer l'utilisateur"
              action="Valider la suppression"
              @validate="$apollo.mutate({
                mutation: require('@/graphql/Administration/SupprimerUtilisateur.gql'),
                variables: { id: idUser },
                update: () => (userSupprime = `L'utilisateur a été supprimé.`)
              }).catch(chargerErreur)"
              ref="modaleDeleteUser"
            >
              <sui-header>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</sui-header>
              <p>Cette action est irréversible.</p>
            </Modale>
            <!--/ Modale de confirmation de suppression d'utilisateur -->

            <!-- Fil d'ariane -->
            <div class="ui large breadcrumb">
              <router-link to="/Administration/gererUtilisateurs" class="section">Liste des utilisateurs</router-link>
              <i class="right arrow icon divider"></i>
              <div class="active section">Utilisateur "{{ champs.utilisateur.prenom.v + ' ' + champs.utilisateur.nom.v }}"</div>
            </div>
            <!--/ Fil d'ariane -->

            <h1 class="ui center aligned header">
              Edition d'utilisateur
              <h3>"{{ champs.utilisateur.prenom.v + ' ' + champs.utilisateur.nom.v }}"</h3>
            </h1>

            <!-- Formulaire d'édition de l'utilisateur -->
            <div class="ui container segment stripe">
              <ApolloMutation
                :mutation="require('@/graphql/Administration/EditerUtilisateur.gql')"
                :variables="{
                  id: idUser,
                  modifications: {
                    roles: champs.utilisateur.roles.v,
                    motDePasse: champs.modifierMotDePasse ? champs.utilisateur.motDePasse.v : undefined,
                    nom: champs.utilisateur.nom.v,
                    prenom: champs.utilisateur.prenom.v,
                    dateNaissance: champs.utilisateur.dateNaissance.v,
                    adresse: champs.utilisateur.adresse.v,
                    codePostal: champs.utilisateur.codePostal.v,
                    emailPrimaire: champs.utilisateur.emailPrimaire.v,
                    emailSecondaire: champs.utilisateur.emailSecondaire.v,
                    telephonePrimaire: champs.utilisateur.telephonePrimaire.v,
                    telephoneSecondaire: champs.utilisateur.telephoneSecondaire.v,
                    diplome: champs.utilisateur.diplome.v,
                    anneeDiplome: champs.utilisateur.anneeDiplome.v,
                    siteWeb: champs.utilisateur.siteWeb.v,
                    avatar: champs.utilisateur.avatar.v
                  }
                }"
                @error="chargerErreur"
                @done="() => {
                  $refs.alerte.viderAlerte()
                  typeAlerte = 'Succès'
                  $refs.alerte.ajouterAlerte('L\'utilisateur a été modifié.')
                }"
              >
                <template v-slot="{ mutate, loading }">
                  <form @submit.prevent="checkForm() && mutate()" :class="{ loading }" class="ui form" novalidate>
                    <form-champs
                      v-model="champs.utilisateur.id.v"
                      nom="Identifiant"
                      id="id"
                      disabled
                    />

                    <form-champs
                      v-model="champs.utilisateur.nom.v"
                      nom="Nom"
                      id="nom"
                      :err="champs.utilisateur.nom.err"
                    />

                    <form-champs
                      v-model="champs.utilisateur.prenom.v"
                      nom="Prénom"
                      id="prenom"
                      :err="champs.utilisateur.prenom.err"
                    />


                    <form-champs
                      v-model="champs.modifierMotDePasse"
                      nom="Modifier le mot de passe ?"
                      id="modifMdp"
                      type="checkbox"
                    />
                    <form-champs
                      v-model="champs.utilisateur.motDePasse.v"
                      nom="Mot de passe"
                      id="motDePasse"
                      :err="champs.utilisateur.motDePasse.err"
                      :disabled="!champs.modifierMotDePasse"
                    />

                    <!-- Champs de modification des rôles du l'utilisateur (Permission 'GESTION_UTILISATEUR' requise) -->
                    <div v-if="!moi.permissions.includes('GESTION_UTILISATEUR')" class="field disabled">
                      <!-- L'éditeur ne possède pas la permission d'éditer les rôles -->
                      <label for="roles">Rôles</label>
                      <input type="text" :value="champs.utilisateur.roles.map(x => x.nom).join(', ')" id="roles" />
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
                      v-model.number="champs.utilisateur.dateNaissance.v"
                      nom="Date de naissance"
                      id="dateNaissance"
                      type="number"
                      :err="champs.utilisateur.dateNaissance.err"
                    />

                    <form-champs
                      v-model="champs.utilisateur.adresse.v"
                      nom="Adresse"
                      id="adresse"
                      :err="champs.utilisateur.adresse.err"
                    />

                    <form-champs
                      v-model="champs.utilisateur.codePostal.v"
                      nom="Code postal"
                      id="codePostal"
                      :err="champs.utilisateur.codePostal.err"
                    />

                    <form-champs
                      v-model="champs.utilisateur.emailPrimaire.v"
                      nom="Email primaire"
                      id="emailPrimaire"
                      :err="champs.utilisateur.emailPrimaire.err"
                    />

                    <form-champs
                      v-model="champs.utilisateur.emailSecondaire.v"
                      nom="Email secondaire"
                      id="emailSecondaire"
                      :err="champs.utilisateur.emailSecondaire.err"
                    />

                    <form-champs
                      v-model="champs.utilisateur.telephonePrimaire.v"
                      nom="Téléphone primaire"
                      id="telephonePrimaire"
                      :err="champs.utilisateur.telephonePrimaire.err"
                    />

                    <form-champs
                      v-model="champs.utilisateur.telephoneSecondaire.v"
                      nom="Téléphone secondaire"
                      id="telephoneSecondaire"
                      :err="champs.utilisateur.telephoneSecondaire.err"
                    />

                    <form-champs
                      v-model="champs.utilisateur.diplome.v"
                      nom="Diplôme en cours"
                      id="diplome"
                      :err="champs.utilisateur.diplome.err"
                    />

                    <form-champs
                      v-model.number="champs.utilisateur.anneeDiplome.v"
                      type="number"
                      nom="Année du diplôme en cours"
                      id="anneeDiplome"
                      :err="champs.utilisateur.anneeDiplome.err"
                    />

                    <form-champs
                      v-model="champs.utilisateur.siteWeb.v"
                      nom="Site web"
                      id="siteWeb"
                      :err="champs.utilisateur.siteWeb.err"
                    />

                    <form-champs
                      v-model="champs.utilisateur.avatar.v"
                      nom="Avatar"
                      id="avatar"
                      :err="champs.utilisateur.avatar.err"
                      disabled
                    />

                    <button class="ui button" type="submit">Modifier l'utilisateur</button>
                  </form>

                  <Alerte ref="alerte" :type-alerte="typeAlerte" />
                </template>
              </ApolloMutation>
            </div>
            <!--/ Formulaire d'édition de l'utilisateur -->

            <!-- Bouton de suppression de l'utilisateur -->
            <div class="text-center mt-4">
              <button v-if="idUser !== moi.id" @click="$refs.modaleDeleteUser.show()" class="ui button negative right labeled icon text-center">
                <i class="trash alternate icon"></i>
                Supprimer l'utilisateur
              </button>
              <p v-else>Vous ne pouvez pas supprimer votre propre compte d'utilisateur.</p>
            </div>
            <!--/ Bouton de suppression de l'utilisateur -->
          </div>
        </div>
      </template>
    </ApolloQuery>
  </div>
</template>

<script>
import Utilisateur from '@/graphql/Utilisateur/Utilisateur.gql'
import { checkPermissions, isEmail } from '@/functions'

import Alerte from '@/components/Alerte.vue'
import GoBack from '@/components/GoBack.vue'
import Modale from '@/components/Modale.vue'
import FormChamps from '@/components/FormChamps.vue'

import Roles from '@/graphql/Administration/Roles.gql'
import Utilisateurs from '@/graphql/Administration/Utilisateurs.gql'

export default {
  name: 'EditerUtilisateur',
  components: {
    Alerte,
    GoBack,
    Modale,
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
        modifierMotDePasse: false,
        utilisateur: {
          id: { v: null, err: [] },
          nom: { v: null, err: [] },
          prenom: { v: null, err: [] },
          motDePasse: { v: '', err: [] },
          dateNaissance: { v: null, err: [] },
          adresse: { v: null, err: [] },
          codePostal: { v: null, err: [] },
          emailPrimaire: { v: null, err: [] },
          emailSecondaire: { v: null, err: [] },
          telephonePrimaire: { v: null, err: [] },
          telephoneSecondaire: { v: null, err: [] },
          diplome: { v: null, err: [] },
          anneeDiplome: { v: null, err: [] },
          siteWeb: { v: null, err: [] },
          avatar: { v: null, err: [] },
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
      result: checkPermissions(['GESTION_UTILISATEUR'])
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
    utilisateurs: Utilisateurs
  },

  methods: {
    checkForm() {
      this.$refs.alerte.viderAlerte()
      this.typeAlerte = 'Erreur'
      let tousRemplis = true
      let tousValides = true

      // Réinitialisation des erreurs
      for (const el in this.champs.utilisateur)
        this.champs.utilisateur[el].err = [];

      // On vérifie que les champs obligatoires sont remplis
      ['nom', 'prenom', 'emailPrimaire', 'dateNaissance'].forEach(x => {
        if (this.champs.utilisateur[x].v === '') {
          this.champs.utilisateur[x].err.push('Champs vide.')
          tousRemplis = false
        }
      })
      if (this.champs.modifierMotDePasse && this.champs.utilisateur.motDePasse.v === '') {
        this.champs.utilisateur.motDePasse.err.push('Champs vide.')
        tousRemplis = false
      }

      // On vérifie que les adresses email sont valides
      ['emailPrimaire', 'emailSecondaire'].forEach(x => {
        if (this.champs.utilisateur[x].v && !isEmail(this.champs.utilisateur[x].v)) {
          this.champs.utilisateur[x].err.push('Adresse email invalide.')
          tousValides = false
        }
      })

      if (!tousRemplis) this.$refs.alerte.ajouterAlerte('Certains champs sont obligatoires.')
      if (!tousValides) this.$refs.alerte.ajouterAlerte('Il y a des erreurs dans le formulaire.')
      return tousRemplis && tousValides
    },

    // Charger une erreur GraphQL envoyée par Apollo dans la liste des erreurs
    chargerErreur(err) {
      console.error(err)
      const error = err.gqlError ? err.gqlError : err

      // TODO: Code VALIDATION_ECHOUEE côté serveur à ajouter
      // // Un ou plusieurs champs sont invalides
      // if (gqlError.extensions.code === 'VALIDATION_ECHOUEE')
      //   gqlError.extensions.exception.props.champs.forEach(x =>
      //     (this.form[x.nom] && this.form[x.nom].err.push(x.message)))

      // Affichage de l'erreur dans l'alerte
      this.$refs.alerte.viderAlerte()
      this.typeAlerte = 'Erreur'
      this.$refs.alerte.ajouterAlerte(error.message)
    },

    loadUserForm({ data: { utilisateur } }) {
      this.champs.utilisateur.id.v = utilisateur.id
      this.champs.utilisateur.nom.v = utilisateur.nom
      this.champs.utilisateur.prenom.v = utilisateur.prenom
      this.champs.utilisateur.dateNaissance.v = utilisateur.dateNaissance
      this.champs.utilisateur.adresse.v = utilisateur.adresse
      this.champs.utilisateur.codePostal.v = utilisateur.codePostal
      this.champs.utilisateur.emailPrimaire.v = utilisateur.emailPrimaire
      this.champs.utilisateur.emailSecondaire.v = utilisateur.emailSecondaire
      this.champs.utilisateur.telephonePrimaire.v = utilisateur.telephonePrimaire
      this.champs.utilisateur.telephoneSecondaire.v = utilisateur.telephoneSecondaire
      this.champs.utilisateur.diplome.v = utilisateur.diplome
      this.champs.utilisateur.anneeDiplome.v = utilisateur.anneeDiplome
      this.champs.utilisateur.siteWeb.v = utilisateur.siteWeb
      this.champs.utilisateur.avatar.v = utilisateur.avatar
      this.champs.utilisateur.roles.v = utilisateur.roles.map(x => x.id)
    }
  }
}
</script>
