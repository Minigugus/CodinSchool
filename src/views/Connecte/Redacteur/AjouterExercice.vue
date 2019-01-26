<template>
  <div class="ui container segment stripe">
    <h2 class="ui center aligned header">
      <div class="content">
        Ajouter un exercice
      </div>
    </h2>

    <form class="ui form">
      <div class="eight wide field">
        <label>Identifiant</label>
        <input type="text" v-model="id" placeholder="Identifiant">
      </div>

      <div class="field">
        <label>Titre</label>
        <input type="text" v-model="titre" placeholder="Titre">
      </div>

      <div class="field">
        <label>Niveau</label>
        <select class="ui dropdown simple" v-model="niveau">
          <option>-</option>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
        </select>
      </div>

      <div class="field">
        <label>Description</label>
        <textarea v-model="description" placeholder="Description de L'exercice"></textarea>
      </div>

      <div class="field">
        <label>Correction</label>
        <textarea v-model="correction" placeholder="Un programme qui répond à la consigne"></textarea>
      </div>

      <button class="ui button" type="submit">Ajouter l'exercice</button>
    </form>
  </div>
</template>

<script>
import Utilisateur from '@/mixins/Utilisateur'

// TODO: Relier avec Apollo
// TODO: Vérifier le formulaire et ajouter l'alerte (Cf : Connexion.vue)
export default {
  name: 'ajouterexercice',
  mixins: [Utilisateur],
  data() {
    return {
      id: 'mon-super-exercice',
      titre: 'Les boucles',
      niveau: '-',
      description: 'Sortir tous les nombres de 1 à 10 séparés par un retour à la ligne.',
      correction: '#include <stdio.h>\nint main(void) {\n  int i;\n  for (i = 0 ; i < 10 ; ++i)\n    printf("%d\\n", i);\n  return 0;\n}'
    }
  }
}
</script>
