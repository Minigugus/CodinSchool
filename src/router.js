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
      path: '/resetMdp',
      name: 'mdpoublie',
      component: () => import('@/views/NonConnecte/MdpOublie.vue')
    },
    {
      path: '/exercice/creer',
      name: 'creerexercice',
      component: () => import('@/views/Connecte/CreerExercice.vue')
    },
    {
      path: '/activation/:code',
      name: 'activation',
      component: () => import('@/views/NonConnecte/Activation.vue'),
      props: true
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
    },
    {
      path: '/mentions',
      name: 'mentions',
      component: () => import('@/views/Mentions.vue')
    }
  ]
})
