<template>
  <div class="ui container">
    <!-- Chargement -->
    <sui-loader v-if="$apollo.queries.test.loading && $apollo.queries.niveaux.loading" active centered inline />

    <!-- Erreur -->
    <div v-else-if="erreurLoadingTest || testSupprime">
      <template v-if="erreurLoadingTest">
        <GoBack to="/NiveauExercice/niveau/liste" text="Retour à la liste des niveaux" />
        <Alerte :liste-msg="[erreurLoadingTest]" type-alerte="Erreur" :fermable="false" />
      </template>
      <template v-else-if="testSupprime">
        <GoBack :to="`/NiveauExercice/exercice/${test.exercice.id}`" :text="`Retour à l'exercice : ${test.exercice.id}`" />
        <Alerte :liste-msg="[`Le test : ${test.id} a été supprimé.`]" type-alerte="Succès" :fermable="false" />
      </template>
    </div>

    <div v-else class="ui container">
      <!-- Contenu de la page -->
      <!-- Modal de confirmation de suppression de test -->
      <Modale
        header="Supprimer le test"
        action="Valider la suppression"
        @validate="supprimerTest"
        ref="modaleDeleteTest"
      >
        <sui-header>Êtes-vous sûr de vouloir supprimer ce test ?</sui-header>
        <p>Cette action est irréversible.</p>
      </Modale>
      <!--/ Modal de confirmation de suppression de test -->

      <!-- Fil d'ariane -->
      <FilAriane :items="[
        { txt: 'Liste des niveaux', to: '/NiveauExercice/niveau/liste' },
        { txt: `Niveau : ${test.niveau.titre}`, to: `/NiveauExercice/niveau/${test.niveau.id}` },
        { txt: `Exercice : ${test.exercice.titre}`, to: `/NiveauExercice/exercice/${test.exercice.id}` },
        `Test : ${test.nom }`
      ]"
      />
      <!--/ Fil d'ariane -->

      <h2 class="ui center aligned header">
        Edition de test
        <h3>"{{ test.nom }}"</h3>
      </h2>

      <!-- Formulaire d'édition de le test -->
      <div class="ui container segment stripe">
        <ApolloMutation
          :mutation="require('@/graphql/NiveauExercice/EditerTest.gql')"
          :variables="{
            id: test.id,
            test: {
              entree: test.entree,
              nom: test.nom,
              sortie: test.sortie,
              exerciceId: champs.test.exercice.v
            }
          }"
          @error="chargerErreur"
          @done="testModif"
        >
          <template v-slot="{ mutate, loading }">
            <form @submit.prevent="checkForm() && mutate()" :class="{ loading }" class="ui form" novalidate>
              <form-champs
                v-model="test.id"
                nom="Identifiant"
                id="id"
                :err="champs.test.id.err"
                disabled
              />
              <!-- Champs id bloqué : https://github.com/Minigugus/CodinSchool/issues/20 -->

              <form-champs
                v-model="test.nom"
                nom="Nom"
                id="nom"
                :err="champs.test.nom.err"
              />

              <div class="field" :class="{ error: champs.test.exercice.err.length > 0 }">
                <label>Niveau</label>

                <sui-dropdown
                  fluid
                  :options="selectExerciceOptions"
                  placeholder="Rôles"
                  search
                  selection
                  v-model="champs.test.exercice.v"
                />
                <div v-for="(anError, index) in champs.test.exercice.err" :key="'erreur-exercice-' + index" class="ui basic red pointing prompt label transition">{{ anError }}</div>
              </div>

              <form-champs
                v-model="test.entree"
                nom="Entrée"
                id="entree"
                :err="champs.test.entree.err"
              />

              <form-champs
                v-model="test.sortie"
                nom="Sortie"
                id="sortie"
                :err="champs.test.sortie.err"
              />

              <button class="ui button" type="submit">Modifier le test</button>
            </form>

            <Alerte ref="erreurs" :type-alerte="typeAlerte" />
          </template>
        </ApolloMutation>
      </div>
      <!--/ Formulaire d'édition de le test -->

      <!-- Bouton de suppression de le test -->
      <div class="text-center mt-4">
        <button @click="$refs.modaleDeleteTest.show()" class="ui button negative right labeled icon text-center">
          <i class="trash alternate icon"></i>
          Supprimer le test
        </button>
      </div>
      <!--/ Bouton de suppression de le test -->
    </div>
  </div>
</template>

<script>
import Utilisateur from '@/graphql/Utilisateur/Utilisateur.gql'
import { checkPermissions } from '@/functions'

import Alerte from '@/components/Alerte.vue'
import Modale from '@/components/Modale.vue'
import GoBack from '@/components/GoBack.vue'
import FormChamps from '@/components/FormChamps.vue'
import FilAriane from '@/components/FilAriane.vue'

import NiveauxExercices from '@/graphql/NiveauExercice/NiveauxExercices.gql'
import Test from '@/graphql/NiveauExercice/Test.gql'
import SupprimerTest from '@/graphql/NiveauExercice/SupprimerTest.gql'

export default {
  name: 'EditerTest',
  components: {
    Alerte,
    Modale,
    GoBack,
    FormChamps,
    FilAriane
  },
  props: {
    idTest: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      erreurLoadingTest: false,

      champs: {
        test: {
          nom: { err: [] },
          entree: { err: [] },
          sortie: { err: [] },
          exercice: { v: '', err: [] }
        }
      },
      typeAlerte: 'Erreur',

      testSupprime: false
    }
  },
  apollo: {
    moi: {
      query: Utilisateur,
      result: checkPermissions(['GESTION_NIVEAU', 'GESTION_EXERCICE'])
    },
    niveaux: NiveauxExercices,
    test() {
      return {
        query: Test,
        variables: { id: this.idTest },
        error: err => (this.erreurLoadingTest = err.message),
        result({ data, loading }) {
          if (!loading && !this.erreurLoadingTest) this.champs.test.exercice.v = data.test.exercice.id
        }
      }
    }
  },

  computed: {
    selectExerciceOptions() {
      let options = []
      this.niveaux.forEach(aNiveau => aNiveau.exercices.forEach(anExercice =>
        (options.push({ text: `${anExercice.titre} (Niveau : #${aNiveau.id} / Exercice : #${anExercice.id})`, value: anExercice.id }))))
      return options
    }
  },

  methods: {
    checkForm() {
      this.$refs.erreurs.viderAlerte()
      this.typeAlerte = 'Erreur'
      let tousRemplis = true
      for (const el in this.champs.test) {
        this.champs.test[el].err = []
        if (this.test[el] === '') {
          this.champs.test[el].err.push('Champs vide.')
          tousRemplis = false
        }
      }
      if (this.test.exercice.id === '-') {
        this.champs.test.exercice.err.push('Veuillez sélectionner un exercice.')
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

    supprimerTest() {
      return this.$apollo.provider.defaultClient.mutate({
        mutation: SupprimerTest,
        variables: { id: this.test.id },
        update: store => {
          // Lire le cache pour récupérer le contenu actuel
          const data = store.readQuery({ query: NiveauxExercices })
          const indexNiveau = data.niveaux.findIndex(x => x.id === this.test.niveau.id)
          const indexExercice = data.niveaux[indexNiveau].exercices.findIndex(x => x.id === this.test.exercice.id)
          const indexTest = data.niveaux[indexNiveau].exercices[indexExercice].tests.findIndex(x => x.id === this.test.id)
          data.niveaux[indexNiveau].exercices[indexExercice].tests.splice(indexTest, 1)
          // Appliquer la modification en cache
          store.writeQuery({ query: NiveauxExercices, data })
          this.testSupprime = true
        }
      }).catch(err => {
        console.error(err)
        this.$refs.erreurs.viderAlerte()
        this.typeAlerte = 'Erreur'
        this.$refs.erreurs.ajouterAlerte(err.message)
      })
    },

    testModif({ data }) {
      const apolloClient = this.$apollo.provider.defaultClient

      try {
      // Lire le cache pour récupérer le contenu actuel
        const oldData = apolloClient.readQuery({ query: NiveauxExercices })
        const indexNiveau = oldData.niveaux.findIndex(x => x.id === this.test.niveau.id)
        const indexExercice = oldData.niveaux[indexNiveau].exercices.findIndex(x => x.id === this.test.exercice.id)
        const indexTest = data.niveaux[indexNiveau].exercices[indexExercice].tests.findIndex(x => x.id === this.test.id)
        oldData.niveaux[indexNiveau].exercices[indexExercice].tests[indexTest] = data.editerTest

        // Appliquer la modification en cache
        apolloClient.writeQuery({ query: NiveauxExercices, data: oldData })

        this.$refs.erreurs.viderAlerte()
        this.typeAlerte = 'Succès'
        this.$refs.erreurs.ajouterAlerte(`Le test "${data.editerExercice.id}" a été modifié.`)
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
