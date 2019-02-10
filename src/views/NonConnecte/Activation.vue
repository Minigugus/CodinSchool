<template>
  <div class="ui container segment stripe smallContainer">
    <h2 class="ui center aligned header">
      <div class="content">
        Activation de compte
      </div>
    </h2>
    <Alerte ref="notifs" :type-alerte="typeAlerte" :fermable="false" />
  </div>
</template>

<script>
import Alerte from '@/components/Alerte.vue'

export default {
  name: 'Activation',
  components: {
    Alerte
  },
  props: {
    email: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      typeAlerte: 'Erreur'
    }
  },

  mounted() {
    this.$apollo.mutate({
      mutation: require('@/graphql/Utilisateur/Activation.gql'),
      variables: {
        code: this.code
      }
    })
      .then(_ => {
        this.ajouterNotif('Félicitations ! Votre compte CodinSchool a été activé. Vous pouvez maintenant vous connecter.')
        this.typeAlerte = 'Succès'
      })
      .catch(err => this.chargerErreur(err))
  },

  methods: {
    // Ajouter une alerte
    ajouterNotif(...str) {
      this.$refs.notifs.ajouterAlerte(...str)
    },

    // Charger une erreur GraphQL envoyée par Apollo dans la liste des erreurs
    chargerErreur(errorObject) {
      let e = errorObject.message
      if (e.includes('GraphQL error: '))
        this.ajouterNotif(e.replace('GraphQL error: ', ''))
    }
  }
}
</script>
