<template>
  <div id="app" class="pushable">
    <!-- Menu sidebar mobile -->
    <transition name="fade" mode="out-in">
      <div v-if="menuSideBarVisible" class="ui vertical inverted sidebar menu" :class="{ visible: menuSideBarVisible}">
        <router-link to="/" exact-active-class="active" class="item">Accueil</router-link>
        <router-link to="/langageC" exact-active-class="active" class="item">Aide sur le langage C</router-link>
        <router-link to="/aPropos" exact-active-class="active" class="item">A propos</router-link>

        <div v-if="!moi" key="menuNonConnecteMobile">
          <router-link to="/connexion" exact-active-class="active" class="item">Connexion</router-link>
          <router-link to="/inscription" exact-active-class="active" class="item">Inscription</router-link>
        </div>
        <div v-else key="menuConnecteMobile">
          <router-link to="/profil" exact-active-class="active" class="item">Profil</router-link>
          <router-link to="/redacteur/gererNiveaux" exact-active-class="active" class="item">Gérer les niveaux</router-link>
          <router-link to="/redacteur/ajouterExercice" exact-active-class="active" class="item">Ajouter un exercice</router-link>
          <a @click="deconnexion" exact-active-class="active" class="item">Se déconnecter</a>
        </div>
      </div>
    </transition>
    <!--/ Menu sidebar mobile -->

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

            <!-- Menu principal -->
            <template v-else>
              <router-link to="/" exact-active-class="active" class="item">Accueil</router-link>
              <router-link to="/langageC" exact-active-class="active" class="item">Aide langage C</router-link>
              <router-link to="/aPropos" exact-active-class="active" class="item">A propos</router-link>

              <transition name="fade" mode="out-in">
                <div v-if="!moi" key="menuNonConnecte" class="right menu">
                  <router-link to="/connexion" exact-active-class="active" class="ui inverted button b-space">Connexion</router-link>
                  <router-link to="/inscription" exact-active-class="active" class="ui inverted button">Inscription</router-link>
                </div>
                <div v-else key="menuConnecte" class="right menu">
                  <sui-dropdown text="Gestion" :item="true">
                    <sui-dropdown-menu>
                      <sui-dropdown-header>Etudiant</sui-dropdown-header>
                      <sui-dropdown-item :disabled="true">Liste des exercices</sui-dropdown-item>

                      <sui-dropdown-divider/>

                      <sui-dropdown-header>Rédacteur</sui-dropdown-header>

                      <router-link to="/redacteur/niveau/liste" class="item" exact-active-class="active">Gérer les niveaux</router-link>

                      <sui-dropdown-divider/>

                      <sui-dropdown-header>Administrateur</sui-dropdown-header>
                      <sui-dropdown-item :disabled="true">Gérer les utilisateurs</sui-dropdown-item>
                      <sui-dropdown-item :disabled="true">Gérer les rôles</sui-dropdown-item>
                    </sui-dropdown-menu>
                  </sui-dropdown>

                  <router-link to="/profil" class="item" exact-active-class="active">Profil</router-link>
                  <a @click="deconnexion" class="item" exact-active-class="active">Se déconnecter</a>
                </div>
              </transition>
            </template>
            <!--/ Menu principal -->
          </div>
        </div>
      </div>

      <!-- Contenu pages -->
      <transition name="fade-fast" mode="out-in">
        <router-view id="mainContent"></router-view>
      </transition>
      <!--/ Contenu pages -->

      <footer class="ui inverted vertical footer segment">
        <div class="ui container">
          <div class="ui inverted divided equal height grid">
            <div class="height wide column">
              <!-- <h4 class="ui inverted header">A Propos</h4> -->
              <div class="ui inverted link list">
                <li class="item">
                  <a href="#" class="underlineHover ui blanc">Carte du Site</a>
                </li>
                <li class="item">
                  <a href="#" class="underlineHover ui blanc">Nous Contacter</a>
                </li>
              </div>
            </div>
            <div class="seven wide column">
              <router-link to="/mentionsLegales" exact-active-class="active" class="underlineHover blanc">Mentions Legales</router-link>
              <p>&copy; 2018 Codinschool</p>
            </div>
          </div>
        </div>
      </footer>
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
      return this.tailleEcran < 1000
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

/* Début animation de fondu rapide */
.fade-fast-enter-active,
.fade-fast-leave-active {
  transition: all .12s !important;
}
.fade-fast-enter,
.fade-fast-leave-to {
  opacity: 0 !important;
}
/* Fin animation de fondu rapide */

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

.smallContainer {
  width: 40% !important;
}

@media screen and (max-width: 10px) {
  .smallContainer {
    width: 100% !important;
  }
}
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

/* Menu dropdown */
.ui.dropdown .menu>.header {
  color: rgb(0, 0, 0);
  font-weight: 1000;
}
.ui.dropdown .menu>.item a {
  padding: 0 !important;
  color: rgba(0,0,0,.87) !important;
}
.ui.menu .ui.dropdown .menu>.active.item {
  background: rgba(0, 0, 0, 0.08) !important;
  font-weight: normal !important;
  color: rgba(0,0,0,.95) !important;
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

.blanc {
  color: white !important;
}
.blanc-hover:hover {
  color: white !important;
}
</style>
