<template>
  <div class="ui container segment stripe">
    <h2 class="ui center aligned header">
      <div class="content">
        Créer un exercice
      </div>
    </h2>
<div class="contenu">
    <div class="formulaire">
      <form class="ui form">
            <div class="required eight wide field">
                <label>Identifiant</label>
              <input type="text" name="id" placeholder="Identifiant" required oninvalid="this.setCustomValidity('Veuillez indiquer un Identifiant')">
            </div>

            <div class="required field">
                <label>Titre</label>
              <input type="text" name="titre" placeholder="Titre" required oninvalid="this.setCustomValidity('Veuillez indiquer un Titre')">
            </div>
            <div class=" required field">
                <label>Niveau</label>
                <select class="ui search dropdown">
                <option value="">Selectionnez un Niveau</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                </select>
            </div>
            <div class="required field">
                <label>Consigne</label>
                <textarea id="consigne" name="consigne" placeholder="Consigne de L'exercice" required oninvalid="this.setCustomValidity('Veuillez indiquer une Consigne')"></textarea>
            </div>
            <div class="field">
                <label>Correction </label>
                <textarea id="Correction" name="Correction" placeholder="Un Programme C qui repond a la consigne"></textarea>
            </div>
        <button class="ui button" type="submit">Valider</button>
      </form>
    </div>
</div>
  </div>
</template>

<script>
export default {
  name: 'creerexercice'
}
</script>

<style scoped>
/* Style de la page */
</style>
