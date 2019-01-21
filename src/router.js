import Vue from 'vue'
import Router from 'vue-router'
import Accueil from '@/views/Accueil.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      // Page d'accueil
      path: '/',
      name: 'accueil',
      component: Accueil
    },
    {
      // A propos de CodinSchool
      path: '/aPropos',
      name: 'apropos',
      component: () => import('@/views/Apropos.vue')
    },
    {
      // Page d'aide sur le langage C
      path: '/langageC',
      name: 'langagec',
      component: () => import('@/views/LangageC.vue')
    },
    {
      // Inscription
      path: '/inscription',
      name: 'inscription',
      component: () => import('@/views/NonConnecte/Inscription.vue')
    },
    {
      // Connexion
      path: '/connexion',
      name: 'connexion',
      component: () => import('@/views/NonConnecte/Connexion.vue')
    },
    {
      // Demande de réinitialisation de mot de passe
      path: '/mdpOublie',
      name: 'mdpoublie',
      component: () => import('@/views/NonConnecte/MdpOublie.vue')
    },
    {
      // Activation de compte
      path: '/activation/:code',
      name: 'activation',
      component: () => import('@/views/NonConnecte/Activation.vue'),
      props: true
    },
    {
      // Profil d'utilisateur
      path: '/profil',
      name: 'profil',
      component: () => import('@/views/Connecte/Profil.vue')
    },

    /* PARTIE ROLE REDACTEUR */
    {
      // Gérer les niveaux
      path: '/redacteur/gererNiveaux',
      name: 'gererniveaux',
      component: () => import('@/views/Connecte/GererNiveaux.vue')
    },
    {
      // Ajouter/Créer un exercice
      path: '/redacteur/ajouterExercice',
      name: 'ajouterexercice',
      component: () => import('@/views/Connecte/AjouterExercice.vue')
    }
    /* / PARTIE ROLE REDACTEUR */
  ]
})
