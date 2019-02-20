<template>
  <div v-if="loading" class="ui active centered inline loader"></div>
  <div v-else class="ui container">
    <codemirror
      v-model="localValue"
      :options="cmOptions"
      @input="$emit('input', $event)"
    />
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'

import { loadCodeMirrorModule } from '@/codeMirrorLanguagesLoader'

export default {
  name: 'EditeurCode',
  components: {
    codemirror
  },
  props: {
    value: {
      type: String,
      required: true
    },
    langageName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: true,

      localValue: this.value,
      cmOptions: {
        tabSize: 2,
        mode: null,
        theme: 'monokai',
        lineNumbers: true,
        line: true
      }
    }
  },

  watch: {
    langageName() {
      this.loadLangageName()
    }
  },
  mounted() {
    this.loadLangageName()
  },

  methods: {
    async loadLangageName() {
      this.loading = true
      try {
        const language = await loadCodeMirrorModule(this.langageName)
        this.cmOptions.mode = language.codeMirrorMode
        this.loading = false
      }
      catch (err) {
        console.error('Le langage de code indiqué pour l\'éditeur de code n\'a pas été trouvé.')
      }
    }
  }
}
</script>
