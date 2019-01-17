<template>
  <div class="ui container segment stripe">
    <h2 class="ui center aligned header">
      <div class="content">
        Mot de passe oublié?
      </div>
    </h2>
    <div class="contenu">
      <div class="formulaire">
        <form class="ui form">
          <p>Entrez votre adresse Mail pour recevoir un lien vous permettant de reinitialiser votre mot de passe.</p>
          <div class="field required">
            <label>Adresse Mail</label>
            <input type="text" name="email" placeholder="Adresse Mail" required oninvalid="this.setCustomValidity('Veuillez indiquer une adresse Email')">
          </div>
          <button class="ui button" type="submit">Envoyer</button>
        </form>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'mdpoublie',
  data() {
    return {
      email: 'contact@asauvage.fr'
    }
  }
}
</script>

<style scoped>
   .contenu{
        padding: 20px;

    }
    .formulaire{
        padding: 20px;
        top: 20px;
        width:40%;
        margin: auto;
        border-radius: 15px;
    }
    .formulaire h1, .formulaire p{
        text-align: center;
    }
</style>
