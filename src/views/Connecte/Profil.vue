<template>
  <div class="ui container">
    <h1>En construction ...</h1>
    <pre>{{ JSON.stringify(moi, null, 2) }}</pre>
  </div>
</template>

<script>
import Utilisateur from '@/graphql/Utilisateur/Utilisateur.gql'

export default {
  name: 'Profil',
  apollo: {
    moi: Utilisateur
  }
}
</script>
