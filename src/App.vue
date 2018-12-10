<template>
  <div id="app">
    <div class="ui inverted stackable menu main-menu center aligned">
      <router-link to="/" class="header item prevent-active">
        <img class="logo" src="/static/img/favicon.png"> Codinschool
      </router-link>
      <router-link to="/" class="item">Accueil</router-link>

      <transition name="fade" mode="out-in">
        <div v-if="/*!isUserLoggedIn*/true" key="inviteMenu" class="right menu">
          <router-link to="/connexion" class="item">Connexion</router-link>
          <router-link to="/inscription" class="item">Inscription</router-link>
        </div>
        <div v-else key="profileMenu" class="right menu">
          <router-link to="/profil" class="item">{{ /*`${getUserData.firstname} ${getUserData.lastname ? getUserData.lastname.charAt(0) : ''}.`*/true }}</router-link>
          <a @click.prevent="/*disconnectUser*/" class="item">Se déconnecter</a>
        </div>
      </transition>
    </div>

    <div class="ui container">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

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

  .fade-enter-active,
  .fade-leave-active {
    transition: all .2s !important;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0 !important;
  }

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
  .main-menu {
    border-radius: 0 !important;
  }
</style>
