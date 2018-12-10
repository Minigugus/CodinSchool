<template>
  <transition name="fade">
    <div v-if="visible && messages && messages.length > 0" class="ui message" :class="choixCouleur">
      <i @click="synchro ? $emit('vider') : visible = false" class="close icon"></i>

      <div class="header">{{ choixTitre }}</div>

      <ul class="list">
        <li v-for="(aMessage, index) in messages" :key="'alerte' + index">{{aMessage}}</li>
      </ul>
    </div>
  </transition>
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
    typeAlerte: {
      type: String,
      required: true
    },
    messages: {
      type: Array,
      required: true
    },
    // Configurer si l'alerte doit être synchronisée avec son parent
    // true = synchro, rien/false = non synchro
    synchro: {
      type: Boolean,
      required: false
    }
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
