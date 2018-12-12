import Vue from 'vue'
import Router from 'vue-router'
import Accueil from './views/NonConnecte/Accueil.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'accueil',
      component: Accueil
    },
    {
      path: '/apropos',
      name: 'apropos',
      component: () => import('./views/NonConnecte/Apropos.vue')
    },
    {
      path: '/langagec',
      name: 'langagec',
      component: () => import('./views/NonConnecte/LangageC.vue')
    },
    {
      path: '/inscription',
      name: 'inscription',
      component: () => import('./views/NonConnecte/Inscription.vue')
    },
    {
      path: '/connexion',
      name: 'connexion',
      component: () => import('./views/NonConnecte/Connexion.vue')
    },
    {
      path: '/profil',
      name: 'profil',
      component: () => import('./views/Connecte/Profil.vue')
    }
  ]
})
