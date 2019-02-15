<template>
  <div class="ui container">
    <!-- Fil d'ariane -->
    <div class="ui large breadcrumb mb-2 mt-3">
      <router-link to="/redacteur/niveau/liste" class="section">Liste des niveaux</router-link>
      <i class="right angle icon divider"></i>
      <div class="active section">Ajouter un niveau</div>
    </div>
    <!--/ Fil d'ariane -->

    <div class="ui container segment stripe">
      <h2 class="ui center aligned header">
        <div class="content">
          Ajouter un niveau
        </div>
      </h2>

      <!-- Formulaire d'ajout de niveau -->
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
    <!--/ Formulaire d'ajout de niveau -->
    </div>
  </div>
</template>

<script>
import Utilisateur from '@/mixins/Utilisateur'
import Alerte from '@/components/Alerte.vue'
import FormChamps from '@/components/FormChamps.vue'
import Niveaux from '@/graphql/Niveau/Niveaux.gql'

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
  apollo: {
    // Chargement des niveaux si pas déjà en cache
    // (Evite erreur si user recharge la page sans passer par la liste des niveaux)
    niveaux: Niveaux
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

    niveauCree({ data: { creerNiveau: nouveauNiveau } }) {
      const apolloClient = this.$apollo.provider.defaultClient
      // Lire le cache pour récupérer le contenu actuel
      const data = apolloClient.readQuery({ query: Niveaux })
      data.niveaux.push(nouveauNiveau)

      // Appliquer la modification en cache
      apolloClient.writeQuery({ query: Niveaux, data })

      this.$refs.erreurs.viderAlerte()
      this.typeAlerte = 'Succès'
      this.$refs.erreurs.ajouterAlerte(`Le niveau "${nouveauNiveau.id}" a été créé.`)
    }
  }
}
</script>
