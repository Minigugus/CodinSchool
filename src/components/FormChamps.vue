<template>
  <div class="field" :class="{ error: err.length > 0, disabled }">
    <label v-if="nom" :for="id">{{ nom }}</label>
    <input
      v-if="tag === 'input'"
      :type="type"
      :id="id"
      v-model="localValue"
      @input="$emit('input', $event.target.value)"
      :placeholder="placeholder"
    />

    <textarea
      v-else-if="tag === 'textarea'"
      :id="id"
      v-model="localValue"
      @input="$emit('input', $event.target.value)"
      :placeholder="placeholder"
    />

    <vue-editor
      v-else-if="tag === 'texteditor'"
      :id="id"
      v-model="localValue"
      @input="$emit('input', $event)"
      use-markdown-shortcuts
      :editor-options="editorSettings"
    />

    <editeur-code
      v-else-if="tag === 'codeeditor'"
      v-model="localValue"
      langage-mime-type="text/x-csrc"
      @input="$emit('input', $event)"
    />

    <div v-for="(anError, index) in err" :key="id + '-' + index" class="ui basic red pointing prompt label transition">
      {{ anError }}
    </div>
  </div>
</template>

<script>
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark-reasonable.css'
import { VueEditor } from 'vue2-editor'
import EditeurCode from '@/components/EditeurCode.vue'

export default {
  name: 'FormChamps',
  components: {
    VueEditor,
    EditeurCode
  },
  props: {
    value: {
      type: [String, Number, Boolean],
      required: false,
      default: ''
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
  },

  data() {
    return {
      localValue: this.value,

      editorSettings: {
        modules: {
          syntax: {
            highlight: text => hljs.highlightAuto(text).value
          }
        },
        placeholder: this.placeholder
      }
    }
  }
}
</script>
