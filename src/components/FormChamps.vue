<template>
  <div class="field" :class="{ error: err.length > 0, disabled }">
    <label v-if="nom" :for="id">{{ nom }}</label>
    <input
      v-if="tag === 'input'"
      :type="type"
      :id="id"
      :value="value"
      @input="$emit('input', $event.target.value)"
      :placeholder="placeholder"
    >

    <textarea
      v-else-if="tag === 'textarea'"
      :id="id"
      :value="value"
      @input="$emit('input', $event.target.value)"
      :placeholder="placeholder"
    ></textarea>

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
      type: [String, Number, Boolean],
      required: false,
      default: 'text'
    },
    tag: {
      type: String,
      required: false,
      default: 'input'
    },
    nom: {
      type: String,
      required: false,
      default: null
    },
    type: {
      type: String,
      required: false,
      default: 'text'
    },
    id: {
      type: String,
      required: false,
      default: null
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
