<template>
  <div class="ui container segment">
    <div class="ui container mb-2">
      <sui-dropdown
        v-model="langageProgrammation"
        fluid
        :options="options"
        placeholder="Liste des langages"
        search
        selection
      />
    </div>

    <form-champs
      v-model="champs.code.v"
      tag="codeeditor"
      nom="Editeur de code"
      id="editeurCode"
      :type="langageProgrammation"
      :err="champs.code.err"
    />
  </div>
</template>

<script>
import FormChamps from '@/components/FormChamps.vue'
import { codeMirrorLanguages } from '@/codeMirrorLanguagesLoader'

const options = Object.keys(codeMirrorLanguages).map(key => {
  return {
    text: key,
    value: key
  }
})

export default {
  name: 'FaireExercice',
  components: {
    FormChamps
  },

  data() {
    return {
      langageProgrammation: 'JavaScript',
      options,

      champs: {
        code: { v: '', err: [] }
      }
    }
  }
}
</script>
