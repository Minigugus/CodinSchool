<template>
  <div>
    <h1>En construction ...</h1>
    <pre>{{ JSON.stringify(this.moi, null, 2) }}</pre>
    <Alerte typeAlerte="Erreur" :messages="[]" />
  </div>
</template>

<script>
import Utilisateur from '@/mixins/Utilisateur'
import Alerte from '@/components/Alerte.vue'


export default {
  name: 'profil',
  components: { Alerte },
  data() {
    return {
      email: 'contact@asauvage.fr',
      motDePasse:	'rigwild',
      nom: 'Sauvage',
      prenom: 'Antoine',
      dateNaissance: 2018
    }
  },
  mixins: [Utilisateur],

  methods: {}
}
</script>

<style scoped>
.form,
.input,
.apollo,
.message {
  padding: 12px;
}

label {
  display: block;
  margin-bottom: 6px;
}

.input {
  font-family: inherit;
  font-size: inherit;
  border: solid 2px #ccc;
  border-radius: 3px;
}

.error {
  color: red;
}

.images {
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  grid-auto-rows: 300px;
  grid-gap: 10px;
}

.image-item {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ccc;
  border-radius: 8px;
}

.image {
  max-width: 100%;
  max-height: 100%;
}

.image-input {
  margin: 20px;
}
</style>
