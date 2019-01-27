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
    name: 'listeniveaux',
    component: () => import('@/views/Connecte/Redacteur/ListeNiveaux.vue')
  },
  {
    // Consulter/Modifier un niveau
    path: '/redacteur/niveau/:idNiveau',
    name: 'editerniveau',
    component: () => import('@/views/Connecte/Redacteur/EditerNiveau.vue'),
    props: true
  },
  {
    // Consulter/Modifier un exercice
    path: '/redacteur/niveau/:idNiveau/exercice/:idExercice',
    name: 'editerexercice',
    component: () => import('@/views/Connecte/Redacteur/EditerExercice.vue'),
    props: true
  },
  {
    // Ajouter/Créer un exercice
    path: '/redacteur/niveau/:idNiveau/ajouterExercice',
    name: 'ajouterexercice',
    component: () => import('@/views/Connecte/Redacteur/AjouterExercice.vue'),
    props: true
  }
]

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
      // Réinitialisation de mot de passe
      path: '/resetMdp/:email/:code',
      name: 'mdpreset',
      component: () => import('@/views/NonConnecte/MdpReset.vue'),
      props: true
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
    }
  ].concat(PAGES_REDACTEUR)
})
