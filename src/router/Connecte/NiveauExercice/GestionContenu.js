/** Liste des pages relatives à la gestion des niveaux et exercices */
export default [
  // TODO: Rendre de nouveau disponible quand feature query multi exos/tests dispo
  // {
  //   // Réorganiser les niveaux/exercices/tests
  //   path: '/NiveauExercice/reorganiser',
  //   name: 'Reorganiser',
  //   component: () => import('@/views/Connecte/NiveauExercice/Gestion/Reorganiser.vue')
  // },

  {
    // Lister les niveaux
    path: '/NiveauExercice/niveau/liste',
    name: 'ListeNiveaux',
    component: () => import('@/views/Connecte/NiveauExercice/Gestion/ListeNiveaux.vue')
  },
  {
    // Créer un niveau
    path: '/NiveauExercice/niveau/ajouterNiveau',
    name: 'AjouterNiveau',
    component: () => import('@/views/Connecte/NiveauExercice/Gestion/AjouterNiveau.vue')
  },
  {
    // Modifier un niveau
    path: '/NiveauExercice/niveau/:idNiveau',
    name: 'EditerNiveau',
    component: () => import('@/views/Connecte/NiveauExercice/Gestion/EditerNiveau.vue'),
    props: true
  },

  {
    // Créer un exercice
    path: '/NiveauExercice/ajouterExercice/:idNiveau?',
    name: 'AjouterExercice',
    component: () => import('@/views/Connecte/NiveauExercice/Gestion/AjouterExercice.vue'),
    props: true
  },
  {
    // Modifier un exercice
    path: '/NiveauExercice/exercice/:idExercice',
    name: 'EditerExercice',
    component: () => import('@/views/Connecte/NiveauExercice/Gestion/EditerExercice.vue'),
    props: true
  },

  {
    // Créer un test
    path: '/NiveauExercice/ajouterTest/:idExercice?',
    name: 'AjouterTest',
    component: () => import('@/views/Connecte/NiveauExercice/Gestion/AjouterTest.vue'),
    props: true
  },
  {
    // Modifier un test
    path: '/NiveauExercice/exercice/:idExercice/test/:idTest',
    name: 'EditerTest',
    component: () => import('@/views/Connecte/NiveauExercice/Gestion/EditerTest.vue'),
    props: true
  },

  {
    // Lister les soumissions sur la plateforme
    path: '/NiveauExercice/soumission',
    name: 'ListeSoumissions',
    component: () => import('@/views/Connecte/NiveauExercice/Gestion/ListeSoumissions.vue')
  }// ,
  // {
  //   // FIXME: Route utile ? On peut tout afficher dans listeSoumissions ?
  //   // Afficher les détails d'une soumission
  //   path: '/NiveauExercice/soumission/:idSoumission',
  //   name: 'AfficherSoumission',
  //   component: () => import('@/views/Connecte/NiveauExercice/Gestion/AfficherSoumission.vue')
  // }
]
