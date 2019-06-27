<template>
  <sui-modal v-model="visible" class="bgTransparent">
    <sui-modal-header v-text="header" />
    <sui-modal-content>
      <sui-modal-description>
        <slot />
      </sui-modal-description>
    </sui-modal-content>
    <sui-modal-actions>
      <sui-button secondary @click.native="hide">Annuler</sui-button>
      <sui-button negative @click.native="hide(), $emit('validate')" v-text="action" />
    </sui-modal-actions>
  </sui-modal>
</template>

<script>
export default {
  props: {
    header: {
      type: String,
      required: true
    },
    action: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      visible: false
    }
  },

  methods: {
    show() {
      this.visible = true
    },
    hide() {
      this.visible = false
    }
  }
}
</script>
