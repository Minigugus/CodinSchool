<template>
  <div>
    <h3 class="ui header titreToggledSection" @click="toggle">
      {{ titre }}
      <span>
        <sui-icon name="caret square down outline" class="expand-button" :class="{ flip : estOuvert }" />
      </span>
    </h3>
    <transition name="fade">
      <div v-if="estOuvert">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>

export default {
  name: 'Expandable',

  data() {
    return {
      estOuvert: false
    }
  },

  mounted() {
    this.estOuvert = this.ouvert
  },

  props: {
    titre: {
      type: String,
      required: true
    },
    ouvert: {
      type: Boolean,
      require: false,
      default: false
    }
  },

  methods: {
    toggle() {
      this.estOuvert = !this.estOuvert
    }
  }
}
</script>

<style scoped>
.titreToggledSection {
  cursor: pointer;
  border-radius: 10px;
  padding: 0px 10px;
  width: fit-content;
  transition-duration: 0.3s
}
.titreToggledSection:hover {
  background-color: #e4e4e4;
}
.expand-button {
  user-select: none;
  display: inline-block;
  transition-duration: 0.4s;
}
.flip {
  transform: rotate(180deg);
  vertical-align: sub;
}
</style>
