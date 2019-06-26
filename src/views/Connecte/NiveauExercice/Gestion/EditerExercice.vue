<template>
  <div class="ui text vertical segment container">
    <!-- Erreur de chargement de la page -->
    <div v-if="erreurLoadingExercice" class="ui text vertical segment container">
      <router-link to="/NiveauExercice/niveau/liste" class="ui button left labeled icon" tag="button">
        <i class="left arrow icon"></i>
        Retour à la liste des niveaux
      </router-link>
      <Alerte type-alerte="Erreur" :liste-msg="[erreurLoadingExercice]" :fermable="false" />
    </div>
    <!--/ Erreur de chargement de la page -->

    <!-- Ecran de chargement de la page -->
    <div v-else-if="!erreurLoadingExercice && $apollo.queries.exercice.loading" class="ui text vertical segment container loading"></div>
    <!--/ Ecran de chargement de la page -->

    <!-- Alerte de notification d'exercice supprimé -->
    <div v-else-if="exerciceSupprime" class="ui text vertical segment container">
      <router-link :to="`/NiveauExercice/niveau/${exerciceSupprimeAppartientANiveau}`" class="ui button left labeled icon" tag="button">
        <i class="left arrow icon"></i>
        Retour au niveau {{ exerciceSupprimeAppartientANiveau }}
      </router-link>
      <Alerte type-alerte="Succès" :liste-msg="[exerciceSupprime]" :fermable="false" />
    </div>
    <!--/ Alerte de notification d'exercice supprimé -->

    <!-- Contenu de la page -->
    <div v-else>
      <!-- Modal de confirmation de suppression d'exercice -->
      <sui-modal v-model="modalConfirmationSuppression" class="bgTransparent">
        <sui-modal-header>Supprimer l'exercice "{{ exercice.titre }}"</sui-modal-header>
        <sui-modal-content>
          <sui-modal-description>
            <sui-header>Êtes-vous sûr de vouloir supprimer cet exercice ?</sui-header>
            <p>Cette action est irréversible.</p>
          </sui-modal-description>
        </sui-modal-content>
        <sui-modal-actions>
          <sui-button secondary @click.native="modalConfirmationSuppression = false">Annuler</sui-button>
          <sui-button negative @click.native="supprimerExercice">Valider la suppression</sui-button>
        </sui-modal-actions>
      </sui-modal>
      <!--/ Modal de confirmation de suppression d'exercice -->

      <!-- Fil d'ariane -->
      <FilAriane :items="[
        { txt: 'Liste des niveaux', to: '/NiveauExercice/niveau/liste' },
        { txt: `Niveau : ${exercice.niveau.id}`, to: `/NiveauExercice/niveau/${exercice.niveau.id}` },
        idExercice ? { txt: `Niveau : ${idExercice}`, to: `/NiveauExercice/exercice/${idExercice}` } : undefined,
        `Exercice : ${exercice.id }`
      ]"
      />
      <!--/ Fil d'ariane -->

      <h1 class="ui center aligned header">
        Edition d'exercice
        <h3>"{{ exercice.titre }}"</h3>
      </h1>

      <!-- Formulaire d'édition de l'exercice -->
      <div class="ui container segment stripe">
        <ApolloMutation
          :mutation="require('@/graphql/NiveauExercice/EditerExercice.gql')"
          :variables="{
            id: idExercice,
            exercice: {
              id: exercice.id,
              titre: exercice.titre,
              enonce: exercice.enonce,
              correction: exercice.correction,
              niveauId: exercice.niveau.id
            }
          }"
          @error="chargerErreur"
          @done="exerciceModif"
        >
          <template slot-scope="{ mutate, loading }">
            <form @submit.prevent="checkForm() && mutate()" :class="{ loading }" class="ui form" novalidate>
              <form-champs
                v-model="exercice.id"
                nom="Identifiant"
                id="id"
                :err="champs.exercice.id.err"
                disabled
              />
              <!-- Champs id bloqué : https://github.com/Minigugus/CodinSchool/issues/20 -->

              <form-champs
                v-model="exercice.titre"
                nom="Titre"
                id="titre"
                :err="champs.exercice.titre.err"
              />

              <div class="field" :class="{ error: champs.exercice.niveau.err.length > 0 }">
                <label>Niveau</label>
                <select class="ui dropdown" v-model="exercice.niveau.id">
                  <option>-</option>
                  <option v-for="(aNiveau, index) in niveaux" :value="aNiveau.id" :key="'option-' + index">{{ aNiveau.titre }} (#{{ aNiveau.id }})</option>
                </select>
                <div v-for="(anError, index) in champs.exercice.niveau.err" :key="'erreur-niveau-' + index" class="ui basic red pointing prompt label transition">{{ anError }}</div>
              </div>

              <form-champs
                tag="texteditor"
                v-model="exercice.enonce"
                nom="Enoncé"
                id="enonce"
                :err="champs.exercice.enonce.err"
              />

              <form-champs
                v-model="exercice.correction"
                tag="textarea"
                nom="Correction"
                id="correction"
                :err="champs.exercice.correction.err"
              />

              <button
                class="ui button"
                type="submit"
              >
                Modifier l'exercice
              </button>
            </form>

            <Alerte ref="erreurs" :type-alerte="typeAlerte" />
          </template>
        </ApolloMutation>
      </div>
      <!--/ Formulaire d'édition de l'exercice -->

      <!-- Liste des tests -->
      <template v-if="exercice.tests.length === 0">
        <div class="ui container segment stripe text-center">
          Cet exercice ne contient aucun test.<br>
          <router-link :to="`/NiveauExercice/ajouterTest/${idExercice}`" class="underlineHover">
            Ajouter un test à l'exercice
          </router-link>
        </div>
      </template>
      <template v-else>
        <!-- Liste des tests de l'exercice -->
        <sui-table celled selectable>
          <sui-table-header>
            <sui-table-row text-align="center">
              <sui-table-header-cell>Id</sui-table-header-cell>
              <sui-table-header-cell>Nom</sui-table-header-cell>
              <sui-table-header-cell>Entrée</sui-table-header-cell>
              <sui-table-header-cell>Sortie</sui-table-header-cell>
              <sui-table-header-cell>Editer</sui-table-header-cell>
            </sui-table-row>
          </sui-table-header>
          <sui-table-body>
            <sui-table-row v-for="aTest in exercice.tests" :key="`test-${aTest.id}`" text-align="center">
              <sui-table-cell v-text="aTest.id" text-align="center" />
              <sui-table-cell v-text="aTest.nom" />
              <sui-table-cell v-text="aTest.entree" />
              <sui-table-cell v-text="aTest.sortie" />
              <sui-table-cell>
                <router-link :to="`/NiveauExercice/exercice/${idExercice}/test/${aTest.id}`" class="ui primary right labeled icon button mini">
                  <i class="edit icon"></i>
                  Editer
                </router-link>
              </sui-table-cell>
            </sui-table-row>
          </sui-table-body>
        </sui-table>
        <!--/ Liste des tests de l'exercice -->

        <!-- Bouton d'ajout de test -->
        <div class="text-center">
          <router-link :to="`/NiveauExercice/ajouterTest/${idExercice}`" class="ui button right labeled icon text-center" tag="button">
            <i class="plus icon"></i>
            Ajouter un test
          </router-link>
        </div>
        <!--/ Bouton d'ajout de test -->
      </template>
      <!--/ Liste des tests -->

      <!-- Bouton de suppression du niveau -->
      <div class="text-center mt-4">
        <button @click="modalConfirmationSuppression = true" class="ui button negative right labeled icon text-center">
          <i class="trash alternate icon"></i>
          Supprimer l'exercice
        </button>
      </div>
      <!--/ Bouton de suppression du niveau -->
    </div>
  </div>
</template>

<script>
import Utilisateur from '@/graphql/Utilisateur/Utilisateur.gql'
import { checkPermissions } from '@/functions'

import Alerte from '@/components/Alerte.vue'
import FormChamps from '@/components/FormChamps.vue'
import FilAriane from '@/components/FilAriane.vue'

import NiveauxExercices from '@/graphql/NiveauExercice/NiveauxExercices.gql'
import Exercice from '@/graphql/NiveauExercice/Exercice.gql'
import SupprimerExercice from '@/graphql/NiveauExercice/SupprimerExercice.gql'

export default {
  name: 'EditerExercice',
  components: {
    Alerte,
    FormChamps,
    FilAriane
  },
  props: {
    idExercice: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      erreurLoadingExercice: false,

      champs: {
        exercice: {
          id: { err: [] },
          titre: { err: [] },
          niveau: { err: [] },
          enonce: { err: [] },
          correction: { err: [] }
        }
      },
      typeAlerte: 'Erreur',

      modalConfirmationSuppression: false,
      exerciceSupprime: false,
      exerciceSupprimeAppartientANiveau: ''
    }
  },
  apollo: {
    moi: {
      query: Utilisateur,
      result: checkPermissions(['GESTION_NIVEAU', 'GESTION_EXERCICE'])
    },
    niveaux: NiveauxExercices,
    exercice() {
      return {
        query: Exercice,
        variables: {
          id: this.idExercice
        },
        error: errorObject => {
          const { gqlError } = errorObject
          if (!gqlError) return console.error(errorObject)
          this.erreurLoadingExercice = gqlError.message
        }
      }
    }
  },

  methods: {
    checkForm() {
      this.$refs.erreurs.viderAlerte()
      this.typeAlerte = 'Erreur'
      let tousRemplis = true
      for (const el in this.champs.exercice) {
        this.champs.exercice[el].err = []
        if (this.exercice[el] === '') {
          this.champs.exercice[el].err.push('Champs vide.')
          tousRemplis = false
        }
      }
      if (this.exercice.niveau.id === '-') {
        this.champs.exercice.niveau.err.push('Veuillez sélectionner un niveau.')
        tousRemplis = false
      }
      if (!tousRemplis) this.$refs.erreurs.ajouterAlerte('Tous les champs sont obligatoires.')

      return tousRemplis
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

    async supprimerExercice() {
      const apolloClient = this.$apollo.provider.defaultClient

      await apolloClient.mutate({
        mutation: SupprimerExercice,
        variables: {
          id: this.exercice.id
        },
        update: store => {
          try {
            // Lire le cache pour récupérer le contenu actuel
            const data = store.readQuery({ query: NiveauxExercices })
            const indexNiveau = data.niveaux.findIndex(x => x.id === this.exercice.niveau.id)
            if (indexNiveau !== -1) {
              const indexExercice = data.niveaux[indexNiveau].exercices.findIndex(x => x.id === this.exercice.id)
              if (indexExercice !== 1) {
                data.niveaux[indexNiveau].exercices.splice(indexExercice, 1)
                this.modalConfirmationSuppression = false

                // Appliquer la modification en cache
                store.writeQuery({ query: NiveauxExercices, data })
                this.exerciceSupprime = `L'exercice "${this.idExercice}" a été supprimé.`
                this.exerciceSupprimeAppartientANiveau = data.niveaux[indexNiveau].id
                return
              }
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

    exerciceModif({ data }) {
      const apolloClient = this.$apollo.provider.defaultClient

      // Lire le cache pour récupérer le contenu actuel
      const oldData = apolloClient.readQuery({ query: NiveauxExercices })
      const indexNiveau = oldData.niveaux.findIndex(x => x.id === this.exercice.niveau.id)
      try {
        const indexExercice = oldData.niveaux[indexNiveau].exercices.findIndex(x => x.id === this.exercice.id)
        oldData.niveaux[indexNiveau].exercices.splice(indexExercice, 1)

        // Appliquer la modification en cache
        apolloClient.writeQuery({ query: NiveauxExercices, data: oldData })

        this.$refs.erreurs.viderAlerte()
        this.typeAlerte = 'Succès'
        this.$refs.erreurs.ajouterAlerte(`L'exercice "${data.editerExercice.id}" a été modifié.`)
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

