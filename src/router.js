import Vue from 'vue'
import Router from 'vue-router'
import Accueil from './views/Accueil.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'accueil',
      component: Accueil
    },
    {
      path: '/',
      name: 'aPropos',
      component: () => import('./views/Apropos.vue')
    },
    {
      path: '/inscription',
      name: 'inscription',
      component: () => import('./views/Inscription.vue')
    },
    {
      path: '/connexion',
      name: 'connexion',
      component: () => import('./views/Connexion.vue')
    },
    {
      path: '/profil',
      name: 'profil',
      component: () => import('./views/Profil.vue')
    }
  ]
})
