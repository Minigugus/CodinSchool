/** Liste des pages liées aux niveaux et exercices `/NiveauExercice/` */
export default [
  {
    // Lister/Réorganiser les niveaux
    path: '/NiveauExercice/niveau/liste',
    name: 'ListeNiveaux',
    component: () => import('@/views/Connecte/NiveauExercice/ListeNiveaux.vue')
  },
  {
    // Créer un niveau
    path: '/NiveauExercice/niveau/ajouterNiveau',
    name: 'AjouterNiveaux',
    component: () => import('@/views/Connecte/NiveauExercice/AjouterNiveau.vue')
  },
  {
    // Modifier un niveau
    path: '/NiveauExercice/niveau/:idNiveau',
    name: 'EditerNiveau',
    component: () => import('@/views/Connecte/NiveauExercice/EditerNiveau.vue'),
    props: true
  },
  {
    // Modifier un exercice
    path: '/NiveauExercice/exercice/:idExercice',
    name: 'EditerExercice',
    component: () => import('@/views/Connecte/NiveauExercice/EditerExercice.vue'),
    props: true
  },
  {
    // Créer un exercice
    path: '/NiveauExercice/ajouterExercice/:idNiveau?',
    name: 'AjouterExercice',
    component: () => import('@/views/Connecte/NiveauExercice/AjouterExercice.vue'),
    props: true
  }
]
