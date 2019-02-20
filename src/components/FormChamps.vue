<!--
Usage :

Input :
<form-champs
  v-model="Variable contenu"
  nom="Nom du champs"
  id="id_DOM"
  type="text ou number ou date ou autre type d'input HTML"
  placeholder="placeholder HTML"
  :err="Variable tableau des erreurs du champs"
/>

Textarea :
<form-champs
  v-model="Variable contenu"
  nom="Nom du champs"
  tag="textarea"
  id="id_DOM"
  placeholder="placeholder HTML"
  :err="Variable tableau des erreurs du champs"
/>

Editeur de texte :
<form-champs
  v-model="Variable contenu"
  tag="texteditor"
  nom="Nom du champs"
  id="id_DOM"
  placeholder="placeholder HTML"
  :err="Variable tableau des erreurs du champs"
/>

Editeur de code :
<form-champs
  v-model="Variable contenu"
  tag="codeeditor"
  nom="Nom du champs"
  id="id_DOM"
  type="Nom du langage de programmation"
  :err="Variable tableau des erreurs du champs"
/>

-->

<template>
  <div class="field" :class="{ error: err.length > 0, disabled }">
    <label v-if="nom" :for="id">{{ nom }}</label>
    <input
      v-if="tag === 'input'"
      v-model="localValue"
      :id="id"
      :type="type"
      :placeholder="placeholder"
      @input="$emit('input', $event.target.value)"
    />

    <textarea
      v-else-if="tag === 'textarea'"
      v-model="localValue"
      :id="id"
      :placeholder="placeholder"
      @input="$emit('input', $event.target.value)"
    />

    <!-- Editeur de texte -->
    <vue-editor
      v-else-if="tag === 'texteditor'"
      v-model="localValue"
      :id="id"
      use-markdown-shortcuts
      :editor-options="{
        modules: {
          syntax: {
            highlight: text => require('highlight.js').highlightAuto(text).value
          }
        },
        placeholder
      }"
      @input="$emit('input', $event)"
    />
    <!--/ Editeur de texte -->

    <!-- Editeur de code -->
    <editeur-code
      v-else-if="tag === 'codeeditor'"
      v-model="localValue"
      :id="id"
      :langage-name="type"
      @input="$emit('input', $event)"
    />
    <!--/ Editeur de code -->

    <div v-for="(anError, index) in err" :key="id + '-' + index" class="ui basic red pointing prompt label transition">
      {{ anError }}
    </div>
  </div>
</template>

<script>
import 'highlight.js/styles/monokai.css'
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
      localValue: this.value
    }
  }
}
</script>
