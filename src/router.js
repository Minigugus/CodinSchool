import Vue from 'vue'
import Router from 'vue-router'
import Accueil from '@/views/Accueil.vue'

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
      component: () => import('@/views/Apropos.vue')
    },
    {
      path: '/langagec',
      name: 'langagec',
      component: () => import('@/views/LangageC.vue')
    },
    {
      path: '/inscription',
      name: 'inscription',
      component: () => import('@/views/NonConnecte/Inscription.vue')
    },
    {
      path: '/connexion',
      name: 'connexion',
      component: () => import('@/views/NonConnecte/Connexion.vue')
    },
    {
      path: '/profil',
      name: 'profil',
      component: () => import('@/views/Connecte/Profil.vue')
    },
    {
      path: '/niveau/gerer',
      name: 'gestioncontenu',
      component: () => import('@/views/Connecte/GestionContenu.vue')
    }
  ]
})
