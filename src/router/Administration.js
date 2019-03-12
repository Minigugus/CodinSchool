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
  },

  {
    // Editer les utilisateurs de l'application
    path: '/Administration/gererUtilisateurs',
    name: 'GererUtilisateurs',
    component: () => import('@/views/Connecte/Administration/GererUtilisateurs.vue')
  },
  {
    // Editer les utilisateurs de l'application
    path: '/Administration/creerUtilisateur',
    name: 'CreerUtilisateur',
    component: () => import('@/views/Connecte/Administration/CreerUtilisateur.vue')
  },
  {
    // Editer un utilisateur
    path: '/Administration/editerUtilisateur/:idUser',
    name: 'EditerUtilisateur',
    component: () => import('@/views/Connecte/Administration/EditerUtilisateur.vue'),
    props: true
  }
]
