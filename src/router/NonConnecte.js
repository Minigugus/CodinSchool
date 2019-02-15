import Accueil from '@/views/Accueil.vue'

/** Liste des pages qui ne nécessitent pas de connexion `/` */
export default [
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
]
