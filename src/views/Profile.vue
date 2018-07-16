<template>
  <div class="ui raised very padded text container segment">
    <h2 class="ui center aligned header">
      <i class="settings icon" style="display: inline;position: absolute;margin-left: -44px;margin-top: 7px;"></i>
      <div class="content" style="display: inline-block;">
        Mon profil
        <div class="sub header">{{ getUserData.username }}</div>
      </div>
    </h2>
  </div>
</template>

<script>
import Vuex from 'vuex'

export default {
  name: 'Profile',
  computed: {
    ...Vuex.mapGetters([
      'getUserData'
    ])
  },
  methods: {
    ...Vuex.mapActions([
    ])
  }
}
</script>
