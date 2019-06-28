<template>
  <transition name="fade">
    <div v-if="visible && messages && messages.length > 0" class="ui message" :class="choixCouleur">
      <i v-if="fermable" @click="messages = []" class="close icon"></i>

      <div class="header">{{ choixTitre }}</div>

      <ul class="list">
        <li v-for="(aMessage, index) in messages" :key="'alerte' + index">{{ aMessage }}</li>
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

  props: {
    typeAlerte: {
      type: String,
      required: true,
      validator: v => typesAlertes.map(x => x.titre).includes(v)
    },
    fermable: {
      type: Boolean,
      required: false,
      default: true
    },
    listeMsg: {
      type: Array,
      required: false,
      default: () => []
    }
  },

  data() {
    return {
      messages: []
    }
  },

  computed: {
    visible() {
      return this.messages.length > 0
    },

    choixTitre() {
      const config = this.getAlerteTypeConfig()
      return config ? config.titre : ''
    },
    choixCouleur() {
      const config = this.getAlerteTypeConfig()
      return config ? config.type : ''
    }
  },

  mounted() {
    if (this.listeMsg.length > 0) this.messages = this.listeMsg
  },

  methods: {
    getAlerteTypeConfig() {
      return typesAlertes.find(x => x.titre === this.typeAlerte)
    },

    ajouterAlerte(...str) {
      const notifNonPresent = str.filter(x => !this.messages.includes(x))
      this.messages.push(...notifNonPresent)
    },

    setAlerte(...str) {
      this.viderAlerte()
      this.messages = str
    },

    viderAlerte() {
      this.messages = []
    }
  }
}
</script>
