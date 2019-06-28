import Accueil from '@/views/Accueil.vue'

/** Liste des pages statiques */
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
    // Mentions légales
    path: '/mentionsLegales',
    name: 'MentionsLegales',
    component: () => import('@/views/MentionsLegales.vue')
  }
]
