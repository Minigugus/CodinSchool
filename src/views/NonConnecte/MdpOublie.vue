<template>
  <div class="ui container segment stripe smallContainer">
    <h2 class="ui center aligned header">
      <div class="content">
        Mot de passe oublié
      </div>
    </h2>

    <form class="ui form">
      <p>
        Entrez votre adresse email afin de recevoir un lien de reinitialisation de mot de passe.
      </p>
      <div class="field">
        <label>Adresse email</label>
        <input type="text" placeholder="Adresse email" v-model="email">
      </div>

      <router-link to="/connexion" class="retour underlineHover">Retour à la connexion</router-link>

      <button class="ui button" type="submit">Envoyer</button>
    </form>
  </div>
</template>

<script>
// TODO: Relier avec Apollo
// TODO: Vérifier le formulaire et ajouter l'alerte (Cf : Connexion.vue)
export default {
  name: 'mdpoublie',
  data() {
    return {
      email: 'mail@example.com'
    }
  }
}
</script>

<style scoped>
.retour {
  right: 0;
  position: absolute;
}
</style>
