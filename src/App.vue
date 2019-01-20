<template>
  <div id="app" class="pushable">

    <!-- Menu sidebar -->
    <transition name="fade" mode="out-in">
      <div v-if="menuSideBarVisible" class="ui vertical inverted sidebar menu" :class="{ visible: menuSideBarVisible}">
        <router-link to="/" exact-active-class="active" class="item">Accueil</router-link>
        <router-link to="/langagec" exact-active-class="active" class="item">Langage C</router-link>
        <router-link to="/apropos" exact-active-class="active" class="item">A propos</router-link>

        <transition name="fade" mode="out-in">
          <div v-if="!moi" key="menuNonConnecteMobile">
            <router-link to="/connexion" exact-active-class="active" class="item">Connexion</router-link>
            <router-link to="/inscription" exact-active-class="active" class="item">Inscription</router-link>
          </div>
          <div v-else key="menuConnecteMobile">
            <router-link to="/profil" exact-active-class="active" class="item">Profil</router-link>
            <router-link to="/niveau/gerer" exact-active-class="active" class="item">Gérer niveaux</router-link>
            <a @click="deconnexion" exact-active-class="active" class="item">Se déconnecter</a>
          </div>
        </transition>
      </div>
    </transition>
    <!--/ Menu sidebar -->

    <!-- Page -->
    <div class="pusher" :class="{ dimmed: menuSideBarVisible }" @click="cacherSideBar(false)">
      <div class="ui inverted vertical masthead center aligned segment">
        <div class="titre-site">
          <h1 class="ui inverted header">
            <router-link to="/" class="item">CodinSchool</router-link>
          </h1>
        </div>
        <div class="ui container">
          <div class="ui large secondary inverted pointing menu">
            <template v-if="isTailleMobile">
              <a class="toc item" @click="menuSideBarVisible = true">
                <i class="sidebar icon"></i>
              </a>
            </template>
            <template v-else>
              <router-link to="/" exact-active-class="active" class="item">Accueil</router-link>
              <router-link to="/langagec" exact-active-class="active" class="item">Langage C</router-link>
              <router-link to="/apropos" exact-active-class="active" class="item">A propos</router-link>

              <transition name="fade" mode="out-in">
                <div v-if="!moi" key="menuNonConnecte" class="right menu">
                  <router-link to="/connexion" exact-active-class="active" class="ui inverted button b-space">Connexion</router-link>
                  <router-link to="/inscription" exact-active-class="active" class="ui inverted button">Inscription</router-link>
                </div>
                <div v-else key="menuConnecte" class="right menu">
                  <router-link to="/profil" exact-active-class="active" class="item">Profil</router-link>
                  <router-link to="/niveau/gerer" exact-active-class="active" class="item">Gérer niveaux</router-link>
                  <a @click="deconnexion" exact-active-class="active" class="item">Se déconnecter</a>
                </div>
              </transition>
            </template>
          </div>
        </div>
      </div>

      <!-- Contenu pages -->
      <transition name="fade" mode="out-in">
        <router-view id="mainContent" ></router-view>
      </transition>
      <!--/ Contenu pages -->

      <div class="ui inverted vertical footer segment">
        <div class="ui container">
          <div class="ui stackable inverted divided equal height stackable grid">
            <div class="three wide column">
              <h4 class="ui inverted header">A Propos</h4>
              <div class="ui inverted link list">
                <a href="#" class="item">Carte du Site</a>
                <a href="#" class="item">Nous Contacter</a>
              </div>
            </div>
            <div class="seven wide column">
              <p>&copy; 2018 Codinschool</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--/ Page -->
</template>

<script>
import Utilisateur from '@/mixins/Utilisateur'
import { onLogout } from '@/vue-apollo'

export default {
  data() {
    return {
      menuSideBarVisible: false,
      tailleEcran: null
    }
  },
  mixins: [Utilisateur],
  mounted() {
    this.tailleEcran = window.innerWidth
    window.addEventListener('resize', () => this.tailleEcran = window.innerWidth)
  },
  computed: {
    isTailleMobile() {
      return this.tailleEcran < 700
    }
  },
  methods: {
    // Cacher la sideBar
    cacherSideBar() {
      if (document.querySelector('.pusher').classList.contains('dimmed'))
        this.menuSideBarVisible = false
    },

    // Déconnecter l'utilisateur
    async deconnexion() {
      // On vide le cache d'Apollo
      const apolloClient = this.$apollo.provider.defaultClient
      await onLogout(apolloClient)

      // On redirige le client vers la page d'accueil
      this.$router.replace({ name: 'accueil' })
    }
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
.underlineHover:hover {
  text-decoration: underline !important;
}

/* Début animation de fondu */
.fade-enter-active,
.fade-leave-active {
  transition: all .2s !important;
}
.fade-enter,
.fade-leave-to {
  opacity: 0 !important;
}
/* Fin animation de fondu */

/* Début animation de fondu lent */
.fade-slow-enter-active,
.fade-slow-leave-active {
  transition: all .7s !important;
}
.fade-slow-enter,
.fade-slow-leave-to {
  opacity: 0 !important;
}
/* Fin animation de fondu lent */

/* Début animation de glissement vers la gauche */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all .3s !important;
}
.slide-left-enter {
  transform: translateX(30px) !important;
  opacity: 0 !important;
}
.slide-left-leave-to {
  transform: translateX(-30px) !important;
  opacity: 0 !important;
}
/* Fin animation de glissement vers la gauche */

/* Début animation de glissement vers la gauche de loin */
.slide-left-far-enter-active,
.slide-left-far-leave-active {
  transition: all .3s !important;
}
.slide-left-far-enter {
  transform: translateX(80%) !important;
  opacity: 0 !important;
}
.slide-left-far-leave-to {
  transform: translateX(-80%) !important;
  opacity: 0 !important;
}
/* Fin animation de glissement vers la gauche de loin*/
</style>

<style scoped>
.titre-site {
  text-align: center;
  position: absolute;
  width: 100%;
  z-index: 0;
  top: 25px;
}
.titre-site a {
  color:white;
}
.right.menu a {
  z-index: 999;
  padding: 1em 2em;
}

.pushable {
  overflow-x: initial;
}
.b-space {
  margin-right: 8px !important;
}

.ui.vertical.segment {
  border: none !important;
}

.pusher {
  min-height: 100vh !important;
  overflow: hidden !important;
  display: block !important;
  position: relative !important;
  padding-bottom: 110px  !important;
}

.footer {
  position: absolute  !important;
  bottom: 0 !important;
  width: 100% !important;
}


.ui.secondary.pointing.menu{
  border: none !important;
}
.ui.inverted.segment{
  background-color: #568EA3 !important;
}

.smallContainer {
  width: 40%;
}

@media screen and (max-width: 700px) {
  #mainContent {
    margin-bottom: 100px;
  }
  .smallContainer {
    width: 100%;
  }
}
</style>
