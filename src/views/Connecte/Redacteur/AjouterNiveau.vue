<template>
  <div class="ui container segment stripe">
    <h2 class="ui center aligned header">
      <div class="content">
        Ajouter un niveau
      </div>
    </h2>

    <ApolloMutation
      :mutation="require('@/graphql/Niveau/CreerNiveau.gql')"
      :variables="{
        niveau: {
          id: champs.id.v,
          titre: champs.titre.v,
          introduction: champs.introduction.v
        }
      }"
      @error="chargerErreur"
      @done="niveauCree"
    >
      <template slot-scope="{ mutate, loading }">
        <form @submit.prevent="checkForm() && mutate()" :class="{ loading }" class="ui form" novalidate>
          <form-champs v-model="champs.id.v" nom="Identifiant" id="identifiant" :err="champs.id.err" />
          <form-champs v-model="champs.titre.v" nom="Titre" id="titre" :err="champs.titre.err" placeholder="Structures de données" />

          <form-champs v-model="champs.introduction.v" tag="textarea" nom="Introduction" id="introduction" :err="champs.introduction.err" />

          <button class="ui button" type="submit">Ajouter le niveau</button>
        </form>

        <Alerte ref="erreurs" :type-alerte="typeAlerte" />
      </template>
    </ApolloMutation>
  </div>
</template>

<script>
import Utilisateur from '@/mixins/Utilisateur'
import Alerte from '@/components/Alerte.vue'
import FormChamps from '@/components/FormChamps.vue'

export default {
  name: 'AjouterNiveau',
  components: {
    Alerte,
    FormChamps
  },
  mixins: [Utilisateur],
  data() {
    return {
      champs: {
        id: { v: '', err: [] },
        titre: { v: '', err: [] },
        introduction: { v: '', err: [] }
      },
      typeAlerte: 'Erreur'
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
      if (!tousRemplis)
        this.$refs.erreurs.ajouterAlerte('Tous les champs sont obligatoires.')

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

    niveauCree({ data }) {
      this.$refs.erreurs.viderAlerte()
      this.typeAlerte = 'Succès'
      this.$refs.erreurs.ajouterAlerte(`Le niveau "${data.creerNiveau.id}" a été créé.`)
    }
  }
}
</script>
