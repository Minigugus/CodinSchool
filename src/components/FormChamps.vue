<template>
  <div class="field" :class="{ error: err.length > 0, disabled }">
    <label v-if="nom" :for="id">{{ nom }}</label>
    <input
    :type="type"
    :id="id"
    :value="value"
    @input="$emit('input', $event.target.value)"
    :placeholder="placeholder"
    >

    <div v-for="(anError, index) in err" :key="id + '-' + index" class="ui basic red pointing prompt label transition">
      {{ anError }}
    </div>
  </div>
</template>

<script>

export default {
  name: 'FormChamps',
  props: {
    value: {
      type: [String, Date, Number]
    },
    nom: {
      type: String,
      required: false
    },
    type: {
      type: String,
      required: false,
      default: 'text'
    },
    id: {
      type: String,
      required: false
    },
    placeholder: {
      type: String,
      required: false,
      default() {
        return this.$props.nom || null
      }
    },
    err: {
      type: Array,
      required: false,
      default: () => []
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>
