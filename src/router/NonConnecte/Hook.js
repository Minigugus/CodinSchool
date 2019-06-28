/** Liste des pages de tranmission de données */
export default [
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
  }
]
