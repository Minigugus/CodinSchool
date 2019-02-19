<template>
  <div v-if="pret" class="ui container">
    <codemirror
      v-model="localValue"
      :options="cmOptions"
      @input="$emit('input', $event)"
    />
  </div>
</template>

<script>
import { mimes } from '@/functions'

import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'

// TODO: Dynamic module injection ??? Voir functions.js qui contient les URI vers les modules.
// import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/clike/clike.js'

// const importModule = uri => import('' + uri)

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
    langageMimeType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      pret: false,

      localValue: this.value,
      cmOptions: {
        tabSize: 2,
        mode: this.langageMimeType,
        theme: 'monokai',
        lineNumbers: true,
        line: true
      }
    }
  },
  async mounted() {
    const res = mimes.find(x => x.text === this.langageMimeType)
    if (res) {
      // console.log(res)
      // await importModule(res.value)
      this.pret = true
    }
    else console.error('Le mime type indiqué pour l\'éditeur de code n\'existe pas.')
  }
}
</script>
