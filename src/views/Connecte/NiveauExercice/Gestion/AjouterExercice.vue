<template>
  <div class="ui container">
    <!-- Fil d'ariane -->
    <FilAriane :items="[
      { txt: 'Liste des niveaux', to: '/NiveauExercice/niveau/liste' },
      idNiveau ? { txt: `Niveau : ${idNiveau}`, to: `/NiveauExercice/niveau/${idNiveau}` } : undefined,
      `Ajouter un exercice`
    ]"
    />
    <!--/ Fil d'ariane -->

    <div class="ui container">
      <h2 class="text-center">Ajouter un exercice</h2>

      <!-- Si le niveau passé en paramètre d'URL existe, le sélectionner dans le choix de niveau -->
      <ApolloQuery
        :query="require('@/graphql/NiveauExercice/Niveaux.gql')"
        @result="!$event.loading && !$event.error && $event.fullData.niveaux.find(x => x.id === idNiveau) && (champs.niveau.v = idNiveau)"
      >
        <template v-slot="{ result: { error, data }, isLoading }">
          <!-- Chargement -->
          <sui-loader v-if="isLoading" active centered inline />

          <!-- Erreur -->
          <div v-else-if="error">
            <Alerte :liste-msg="[error.message]" type-alerte="Erreur" :fermable="false" />
          </div>

          <!-- Result -->
          <div v-else-if="data" class="ui container">
            <!-- Formulaire d'ajout d'exercice -->
            <ApolloMutation
              :mutation="require('@/graphql/NiveauExercice/CreerExercice.gql')"
              :variables="{
                exercice: {
                  id: champs.id.v,
                  titre: champs.titre.v,
                  niveauId: champs.niveau.v,
                  enonce: champs.enonce.v,
                  correction: champs.correction.v
                }
              }"
              @error="chargerErreur"
              @done="exerciceCree"
              class="ui segment"
            >
              <template v-slot="{ mutate, loading }">
                <form @submit.prevent="checkForm() && mutate()" :class="{ loading }" class="ui form" novalidate>
                  <form-champs v-model="champs.id.v" nom="Identifiant" id="identifiant" :err="champs.id.err" />
                  <form-champs v-model="champs.titre.v" nom="Titre" id="titre" :err="champs.titre.err" placeholder="Les boucles" />

                  <div class="field" :class="{ error: champs.niveau.err.length > 0 }">
                    <label>Niveau</label>

                    <sui-dropdown
                      fluid
                      :options="data.niveaux.map(x => ({ text: `${x.titre} (#${x.id})`, value: x.id }))"
                      placeholder="Rôles"
                      search
                      selection
                      v-model="champs.niveau.v"
                    />
                    <div v-for="(anError, index) in champs.niveau.err" :key="'erreur-niveau-' + index" class="ui basic red pointing prompt label transition">{{ anError }}</div>
                  </div>

                  <form-champs
                    tag="texteditor"
                    v-model="champs.enonce.v"
                    nom="Enoncé"
                    id="enonce"
                    :err="champs.enonce.err"
                  />

                  <form-champs
                    v-model="champs.correction.v"
                    tag="codeeditor"
                    nom="Correction"
                    id="Correction"
                    type="C"
                    :err="champs.correction.err"
                  />

                  <button class="ui button" type="submit">Ajouter l'exercice</button>
                </form>

                <Alerte ref="erreurs" :type-alerte="typeAlerte" />
              </template>
            </ApolloMutation>
            <!--/ Formulaire d'ajout d'exercice -->
          </div>
        </template>
      </ApolloQuery>
    </div>
  </div>
</template>

<script>
import Utilisateur from '@/graphql/Utilisateur/Utilisateur.gql'
import { checkPermissions } from '@/functions'

import Alerte from '@/components/Alerte.vue'
import FormChamps from '@/components/FormChamps.vue'
import FilAriane from '@/components/FilAriane.vue'

export default {
  name: 'AjouterExercice',
  components: {
    Alerte,
    FormChamps,
    FilAriane
  },
  props: {
    idNiveau: {
      type: String,
      required: false,
      default: null
    }
  },
  data() {
    return {
      champs: {
        id: { v: '', err: [] },
        titre: { v: '', err: [] },
        niveau: { v: '-', err: [] },
        enonce: { v: '', err: [] },

        // TODO: support multi langages
        correction: { v: '#include <stdio.h>\nint main(void) {\n  for (int i = 0 ; i < 10 ; ++i)\n    printf("%d\\n", i);\n  return 0;\n}', err: [] }
      },
      typeAlerte: 'Erreur'
    }
  },
  apollo: {
    moi: {
      query: Utilisateur,
      result: checkPermissions(['GESTION_NIVEAU', 'GESTION_EXERCICE'])
    }
  },

  methods: {
    checkForm() {
      this.$refs.erreurs.viderAlerte()
      this.typeAlerte = 'Erreur'
      let tousRemplis = true
      for (const el in this.champs) {
        this.champs[el].err = []
        if (this.champs[el].v === '') {
          this.champs[el].err.push('Champs vide.')
          tousRemplis = false
        }
      }
      if (this.champs.niveau.v === '-') {
        this.champs.niveau.err.push('Veuillez sélectionner un niveau.')
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
      // Un ou plusieurs champs sont invalides
      if (gqlError.extensions.code === 'VALIDATION_ECHOUEE')
        gqlError.extensions.exception.props.champs.forEach(x =>
          (this.form[x.nom] && this.form[x.nom].err.push(x.message)))

      // Affichage de l'erreur dans l'alerte
      this.$refs.erreurs.viderAlerte()
      this.typeAlerte = 'Erreur'
      this.$refs.erreurs.ajouterAlerte(gqlError.message)
    },

    exerciceCree({ data }) {
      this.$refs.erreurs.viderAlerte()
      this.typeAlerte = 'Succès'
      this.$refs.erreurs.ajouterAlerte(`L'exercice "${data.creerExercice.id}" a été ajouté au niveau "${this.champs.niveau.v}".`)
    }
  }
}
</script>
