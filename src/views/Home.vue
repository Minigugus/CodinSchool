<template>
  <div class="home">
    <img src="../assets/logo.png">
    <HelloWorld/>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'
import Vuex from 'vuex'

export default {
  computed: {
    ...Vuex.mapGetters([
    ])
  },
  name: 'home',
  components: {
    HelloWorld
  }
}
</script>
