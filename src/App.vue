<template>
  <div id="app">
    <div class="ui inverted menu">
      <div class="ui container">
        <router-link to="/" class="header item prevent-active">
          <img class="logo" src="/static/img/favicon.png"> Codinschool
        </router-link>
        <router-link to="/" class="item">Accueil</router-link>
        <router-link to="/login" class="item">Login</router-link>
        <router-link to="/profile" class="item">Antoine S.</router-link>
      </div>
    </div>

    <div class="ui container">

      <div class="ui button" @click="addNotification({type: ['info','warning','error','success'][[Math.floor(Math.random() * 4)]], message: Math.random().toString(36).substr(2, 15)})">Ajouter une notification</div>

      <transition name="fade">
        <div v-if="notificationCount > 0" id="notification">
          <transition-group name="list" mode="out-in" v-on:after-leave="reorderNotification">
            <div v-for="notif in notification" v-bind:key="notif.id" v-bind:class="notif.type" class="ui message list-item">
              <i @click="closeNotification(notif.id)" class="close icon"></i>
              <div class="header">{{ notif.header }} - {{notif.id}}</div>
              <p>{{ notif.message }}</p>
            </div>
          </transition-group>
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
      'notification',
      'notificationCount'
    ])
  },
  methods: {
    ...Vuex.mapActions([
      'reorderNotification',
      'addNotification',
      'closeNotification'
    ])
  }
}
</script>

<style>
  #notification {
    margin-bottom: 20px !important;
  }

  /* START Notification container animation*/

  /* END Notification container animation*/

  /* START Notification list animation*/

.list-item {
  transition: all 1s !important;
  display: block !important;
}
.list-enter, .list-leave-to {
  opacity: 0 !important;
  transform: translateY(30px) !important;
}
.list-leave-active {
}
.list-move {
  transition: transform 1s;
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
