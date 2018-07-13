<template>
  <div id="app">
    <div class="ui inverted menu">
      <div class="ui container">
        <router-link to="/" class="header item prevent-active">
          <img class="logo" src="/static/img/favicon.png"> Codinschool
        </router-link>
        <router-link to="/" class="item">Accueil</router-link>
        <router-link to="/login" class="item">Login</router-link>
        <router-link to="/profile" class="item">Prenom S.</router-link>
      </div>
    </div>

    <div class="ui container">

      <div v-if="notification.visible" v-bind:class="notification.type" class="ui message">
        <i @click="closeNotification()" class="close icon"></i>
        <div class="header">
          {{ notification.header }}
        </div>
        <p>{{ notification.message }}</p>
      </div>

    <router-view/>
    </div>
  </div>
</template>

<script>
import Vuex from 'vuex'

export default {
  computed: {
    ...Vuex.mapGetters([
      'notification'
    ])
  },
  methods: {
    ...Vuex.mapActions([
      'closeNotification'
    ])
  }
}
</script>

<style>
  .prevent-active {
    background: 0 0 !important;
    color: rgba(255,255,255,.9) !important;
  }
  #app {
    text-align: left;
    font-family: Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
