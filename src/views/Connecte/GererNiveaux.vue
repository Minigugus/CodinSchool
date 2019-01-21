<template>
  <div class="ui vertical stripe segment">
    <transition name="slide-left-far" mode="out-in">
      <OrganiserNiveaux v-if="pageEnCours === 'OrganiserNiveaux'"
      @editerNiveau="editerNiveau"
      key="OrganiserNiveaux"
      />
      <EditerNiveau v-else-if="pageEnCours === 'EditerNiveau'"
      key="EditerNiveau"
      :idNiveau="idNiveauEdite"
      />
    </transition>
  </div>
</template>

<script>
import OrganiserNiveaux from '@/components/Niveau/OrganiserNiveaux.vue'
import EditerNiveau from '@/components/Niveau/EditerNiveau.vue'
import Utilisateur from '@/mixins/Utilisateur'

export default {
  data() {
    return {
      pageEnCours: 'OrganiserNiveaux'
    }
  },
  name: 'gererniveaux',
  components: {
    OrganiserNiveaux,
    EditerNiveau
  },
  mixins: [Utilisateur],

  methods: {
    // Lance l'édition d'un niveau via son id
    editerNiveau(idNiveau) {
      this.pageEnCours = 'EditerNiveau'
      this.idNiveauEdite = idNiveau
    }
  }
}
</script>
