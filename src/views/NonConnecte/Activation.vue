<template>
  <div class="ui container">
    <h2 class="text-center">Activation de compte</h2>

    <!-- Chargement -->
    <sui-loader v-if="isLoading" active centered inline />

    <!-- Erreur -->
    <Alerte
      v-else-if="error"
      :liste-msg="[error.message]"
      type-alerte="Erreur"
      :fermable="false"
    />

    <!-- Result -->
    <div v-else-if="validated" class="ui container segment">
      <Alerte
        :liste-msg="['Félicitations ! Votre compte CodinSchool a été activé. Vous pouvez maintenant vous connecter.']"
        type-alerte="Succès"
        :fermable="false"
      />
    </div>
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
    code: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      isLoading: false,
      error: null,

      validated: false
    }
  },

  async mounted() {
    this.isLoading = true
    try {
      await this.$apollo.mutate({
        mutation: require('@/graphql/Utilisateur/Activation.gql'),
        variables: { code: this.code }
      })
    }
    catch (error) {
      this.error = error
    }
    finally {
      this.isLoading = false
    }
    this.validated = true
  }
}
</script>
