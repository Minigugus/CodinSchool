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

      <button class="ui button" @click="addNotification({type: ['info','warning','error','success'][[Math.floor(Math.random() * 4)]], message: 'Laborum in sit et fugiat ea do cupidatat exercitation enim ea laboris. ' + Math.random().toString(36).substr(2, 30)})">Ajouter une notification</button>

      <transition name="fade">
        <div v-if="notificationsCount > 0" id="notification">
          <transition-group name="list" mode="out-in">
            <div v-for="notif in notifications" v-bind:key="notif.id" v-bind:class="notif.type" class="ui message list-item">
              <i @click="closeNotification(notif.id)" class="close icon"></i>
              <div class="header">{{ notif.header }}</div>
              <p>{{ notif.message }}</p>
            </div>
          </transition-group>
          <div class="text-right" style="padding-top: .5em;">
            <button @click="closeAllNotifications" class="ui mini right labeled icon button"><i class="right close icon"></i>Fermer les notifications</button>
          </div>
        </div>
      </transition>

      <router-view/>
    </div>
  </div>
</template>

<script>
import Vuex from 'vuex'

export default {
  computed: {
    ...Vuex.mapGetters([
      'notifications',
      'notificationsCount'
    ])
  },
  methods: {
    ...Vuex.mapActions([
      'addNotification',
      'closeNotification',
      'closeAllNotifications'
    ])
  }
}
</script>

<style>
  .text-left {
    text-align: left !important;
  }

  .text-center {
    text-align: center !important;
  }

  .text-right {
    text-align: right !important;
  }

  #notification {
    position: fixed !important;
    margin-top: 30px !important;
    right: 30px !important;
    bottom: 20px !important;
    z-index: 999;
  }

  /* START Notification container animation*/

  .fade-enter-active,
  .fade-leave-active {
    transition: all .5s !important;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0 !important;
    transform: translateY(30px) !important;
  }

  /* END Notification container animation*/

  /* START Notification list animation*/

  .list-item {
    transition: opacity 1s, !important;
    display: block !important;
  }

  .list-enter {
    opacity: 0 !important;
    transform: translateY(30px) !important;
  }

  .list-leave-to {
    opacity: 0 !important;
    transform: translateX(50px) !important;
  }

  .list-leave-active {
    transition: all 1s !important;
  }

  .list-move {
    transition: transform 1s !important;
  }

  /* END Notification list animation*/

  .prevent-active {
    background: 0 0 !important;
    color: rgba(255, 255, 255, .9) !important;
  }

  #app {
    text-align: left;
    font-family: Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
