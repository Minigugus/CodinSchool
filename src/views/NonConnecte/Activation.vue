<template>
  <div class="ui container segment stripe">
    <h2 class="ui center aligned header">
      <div class="content">
        Activation de compte
      </div>
    </h2>
    <Alerte ref="notifs" :typeAlerte="typeAlerte" />
  </div>
</template>

<script>
import Alerte from '@/components/Alerte.vue'

export default {
  name: 'activation',
  components: {
    Alerte
  },
  data() {
    return {
      email: 'zcontact@asauvage.fr',
      typeAlerte: 'Erreur'
    }
  },
  props: ['code'],

  mounted() {
    this.$apollo.mutate({
      mutation: require('@/graphql/Activation.gql'),
      variables: {
        email: this.email,
        code: this.code
      }
    })
      .then(_ => {
        this.ajouterNotif('Félicitations ! Votre compte CodinSchool a été activé.')
        this.ajouterNotif('Vous pouvez maintenant vous connecter.')
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
