/** Liste des pages liées à l'administration de l'application `/Administration/` */
export default [
  {
    // Lister/Réorganiser les niveaux
    path: '/Administration/gererRoles',
    name: 'GererRoles',
    component: () => import('@/views/Connecte/Administration/GererRoles.vue')
  }
]
