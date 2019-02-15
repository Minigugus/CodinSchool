import Vue from 'vue'
import Router from 'vue-router'
import Accueil from '@/views/Accueil.vue'

Vue.use(Router)

/**
 * Liste des pages liées au rôle "Rédacteur"
 */
const PAGES_REDACTEUR = [
  {
    // Lister/Réorganiser les niveaux
    path: '/redacteur/niveau/liste',
    name: 'ListeNiveaux',
    component: () => import('@/views/Connecte/Redacteur/ListeNiveaux.vue')
  },
  {
    // Créer un niveau
    path: '/redacteur/niveau/ajouterNiveau',
    name: 'AjouterNiveaux',
    component: () => import('@/views/Connecte/Redacteur/AjouterNiveau.vue')
  },
  {
    // Modifier un niveau
    path: '/redacteur/niveau/:idNiveau',
    name: 'EditerNiveau',
    component: () => import('@/views/Connecte/Redacteur/EditerNiveau.vue'),
    props: true
  },
  {
    // Modifier un exercice
    path: '/redacteur/exercice/:idExercice',
    name: 'EditerExercice',
    component: () => import('@/views/Connecte/Redacteur/EditerExercice.vue'),
    props: true
  },
  {
    // Créer un exercice
    path: '/redacteur/ajouterExercice/:idNiveau?',
    name: 'AjouterExercice',
    component: () => import('@/views/Connecte/Redacteur/AjouterExercice.vue'),
    props: true
  }
]

export default new Router({
  routes: [
    {
      // Page d'accueil
      path: '/',
      name: 'Accueil',
      component: Accueil
    },
    {
      // A propos de CodinSchool
      path: '/aPropos',
      name: 'APropos',
      component: () => import('@/views/Apropos.vue')
    },
    {
      // Page d'aide sur le langage C
      path: '/langageC',
      name: 'LangageC',
      component: () => import('@/views/LangageC.vue')
    },
    {
      // Inscription
      path: '/inscription',
      name: 'Inscription',
      component: () => import('@/views/NonConnecte/Inscription.vue')
    },
    {
      // Connexion
      path: '/connexion',
      name: 'Connexion',
      component: () => import('@/views/NonConnecte/Connexion.vue')
    },
    {
      // Demande de réinitialisation de mot de passe
      path: '/mdpOublie',
      name: 'MdpOublie',
      component: () => import('@/views/NonConnecte/MdpOublie.vue')
    },
    {
      // Réinitialisation de mot de passe
      path: '/resetMdp/:email/:code',
      name: 'MdpReset',
      component: () => import('@/views/NonConnecte/MdpReset.vue'),
      props: true
    },
    {
      // Activation de compte
      path: '/activation/:code',
      name: 'Activation',
      component: () => import('@/views/NonConnecte/Activation.vue'),
      props: true
    },
    {
      // Profil d'utilisateur
      path: '/profil',
      name: 'Profil',
      component: () => import('@/views/Connecte/Profil.vue')
    },
    {
      path: '/mentionsLegales',
      name: 'MentionsLegales',
      component: () => import('@/views/MentionsLegales.vue')
    }
  ].concat(PAGES_REDACTEUR)
})
