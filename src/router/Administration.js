/** Liste des pages liées à l'administration de l'application `/Administration/` */
export default [
  {
    // Editer les rôles et leurs permissions
    path: '/Administration/gererRoles',
    name: 'GererRoles',
    component: () => import('@/views/Connecte/Administration/GererRoles.vue')
  },
  {
    // Créer un rôle
    path: '/Administration/creerRole',
    name: 'CreerRole',
    component: () => import('@/views/Connecte/Administration/CreerRole.vue')
  }
]
