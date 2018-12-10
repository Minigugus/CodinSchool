<template>
  <div v-if="visible" class="ui message" :class="choixCouleur">
    <i @click="visible = false" class="close icon"></i>

    <div class="header">{{ choixTitre }}</div>

    <ul class="list">
      <li v-for="(aMessage, index) in messages" :key="'alerte' + index">{{aMessage}}</li>
    </ul>
  </div>
</template>

<script>

const typesAlertes = [
  { titre: 'Information', type: 'info', icone: 'info circle' },
  { titre: 'Attention', type: 'warning', icone: 'exclamation triangle' },
  { titre: 'Succès', type: 'success', icone: 'check circle' },
  { titre: 'Erreur', type: 'error', icone: 'exclamation circle' }
]

export default {
  name: 'Alerte',
  data() {
    return {
      visible: true
    }
  },

  props: {
    typeAlerte: String,
    messages: Array
  },

  methods: {
    getAlerteTypeConfig(){
      return typesAlertes.find(x => x.titre === this.typeAlerte)
    }
  },

  computed: {
    choixTitre() {
      const config = this.getAlerteTypeConfig()
      return config ? config.titre : ''
    },
    choixCouleur() {
      const config = this.getAlerteTypeConfig()
      return config ? config.type : ''
    }
  }
}
</script>
