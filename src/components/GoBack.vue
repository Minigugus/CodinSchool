<template>
  <router-link :to="to" class="ui button left labeled icon" tag="button">
    <i class="left arrow icon" />
    {{ text }}
  </router-link>
</template>

<script>
export default {
  props: {
    to: {
      type: [String, Object],
      required: true
    },
    text: {
      type: String,
      required: false,
      default: 'Retour'
    }
  }
}
</script>
