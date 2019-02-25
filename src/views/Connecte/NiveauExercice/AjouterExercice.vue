<template>
  <div class="ui container">
    <!-- Fil d'ariane -->
    <div class="ui large breadcrumb mb-2 mt-3">
      <router-link to="/NiveauExercice/niveau/liste" class="section">Liste des niveaux</router-link>
      <i class="right angle icon divider"></i>
      <template v-if="idNiveau">
        <router-link :to="'/NiveauExercice/niveau/' + idNiveau" class="section">Niveau "{{ idNiveau }}"</router-link>
        <i class="right arrow icon divider"></i>
      </template>
      <div class="active section">Ajouter un exercice</div>
    </div>
    <!--/ Fil d'ariane -->

    <div class="ui container segment stripe">
      <h2 class="ui center aligned header">
        <div class="content">
          Ajouter un exercice
        </div>
      </h2>

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
      >
        <template slot-scope="{ mutate, loading }">
          <form @submit.prevent="checkForm() && mutate()" :class="{ loading }" class="ui form" novalidate>
            <form-champs v-model="champs.id.v" nom="Identifiant" id="identifiant" :err="champs.id.err" />
            <form-champs v-model="champs.titre.v" nom="Titre" id="titre" :err="champs.titre.err" placeholder="Les boucles" />

            <div class="field" :class="{ error: champs.niveau.err.length > 0 }">
              <label>Niveau</label>
              <select class="ui dropdown" v-model="champs.niveau.v">
                <option>-</option>
                <option v-for="(aNiveau, index) in niveaux" :value="aNiveau.id" :key="'option-' + index">{{ aNiveau.titre }} (#{{ aNiveau.id }})</option>
              </select>
              <div v-for="(anError, index) in champs.niveau.err" :key="'erreur-niveau-' + index" class="ui basic red pointing prompt label transition">{{ anError }}</div>
            </div>

            <form-champs v-model="champs.enonce.v" nom="Enoncé" id="enonce" :err="champs.enonce.err"
                         placeholder="Sortir tous les nombres de 1 à 10 séparés par un retour à la ligne."
            />
            <form-champs v-model="champs.correction.v" tag="textarea" nom="Correction" id="correction" :err="champs.correction.err" />

            <button class="ui button" type="submit">Ajouter l'exercice</button>
          </form>

          <Alerte ref="erreurs" :type-alerte="typeAlerte" />
        </template>
      </ApolloMutation>
    <!--/ Formulaire d'ajout d'exercice -->
    </div>
  </div>
</template>

<script>
import Utilisateur from '@/graphql/Utilisateur/Utilisateur.gql'
import { checkPermissions } from '@/functions'

import Niveaux from '@/graphql/NiveauExercice/Niveaux.gql'

import Alerte from '@/components/Alerte.vue'
import FormChamps from '@/components/FormChamps.vue'

export default {
  name: 'AjouterExercice',
  components: {
    Alerte,
    FormChamps
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
        correction: { v: '#include <stdio.h>\nint main(void) {\n  for (int i = 0 ; i < 10 ; ++i)\n    printf("%d\\n", i);\n  return 0;\n}', err: [] }
      },
      typeAlerte: 'Erreur'
    }
  },
  apollo: {
    moi: {
      query: Utilisateur,
      result({ loading, data }) {
        if (loading) return
        // Vérification que l'utilisateur possède les permissions requises par la route
        const permissionsRequises = ['GESTION_NIVEAU', 'GESTION_EXERCICE']
        checkPermissions(data.moi.permissions, permissionsRequises, this.$router)
      }
    },
    niveaux: {
      query: Niveaux,
      result({ data, loading }) {
        // Pendant le chargement des niveaux, vérifier si l'id de niveau passé
        // en paramètre existe. Si oui, l'appliquer dans le champs <select>
        if (!loading && data.niveaux.find(x => x.id === this.idNiveau))
          this.champs.niveau.v = this.idNiveau
      }
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
      // // Un ou plusieurs champs sont invalides
      // if (gqlError.extensions.code === 'VALIDATION_ECHOUEE')
      //   gqlError.extensions.exception.props.champs.forEach(x =>
      //     (this.form[x.nom] && this.form[x.nom].err.push(x.message)))

      // Affichage de l'erreur dans l'alerte
      this.$refs.erreurs.viderAlerte()
      this.typeAlerte = 'Erreur'
      this.$refs.erreurs.ajouterAlerte(gqlError.message)
    },

    exerciceCree({ data }) {
      this.$refs.erreurs.viderAlerte()
      this.typeAlerte = 'Succès'
      this.$refs.erreurs.ajouterAlerte(`L'exercice "${data.creerExercice.id}"a été ajouté au niveau "${this.champs.niveau.v}".`)
    }
  }
}
</script>
