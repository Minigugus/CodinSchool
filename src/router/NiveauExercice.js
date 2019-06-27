/** Liste des pages liées aux niveaux et exercices `/NiveauExercice/` */
export default [
  // Partie "Utilisateur"
  {
    // Lister les niveaux et exercices
    path: '/listeExercices',
    name: 'ListeExercices',
    component: () => import('@/views/Connecte/NiveauExercice/Utilisateur/ListeExercices.vue')
  },
  {
    // Faire un exercice
    path: '/faireExercice/:idExercice',
    name: 'FaireExercice',
    component: () => import('@/views/Connecte/NiveauExercice/Utilisateur/FaireExercice.vue'),
    props: true
  },

  // Partie "Gestion"
  {
    // Lister les niveaux
    path: '/NiveauExercice/niveau/liste',
    name: 'ListeNiveaux',
    component: () => import('@/views/Connecte/NiveauExercice/Gestion/ListeNiveaux.vue')
  },
  // TODO: Rendre de nouveau disponible quand feature query multi exos/tests dispo
  // {
  //   // Réorganiser les niveaux/exercices/tests
  //   path: '/NiveauExercice/reorganiser',
  //   name: 'Reorganiser',
  //   component: () => import('@/views/Connecte/NiveauExercice/Gestion/Reorganiser.vue')
  // },
  {
    // Créer un niveau
    path: '/NiveauExercice/niveau/ajouterNiveau',
    name: 'AjouterNiveaux',
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
    // Modifier un exercice
    path: '/NiveauExercice/exercice/:idExercice',
    name: 'EditerExercice',
    component: () => import('@/views/Connecte/NiveauExercice/Gestion/EditerExercice.vue'),
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
    // Créer un test
    path: '/NiveauExercice/ajouterTest/:idExercice?',
    name: 'AjouterTest',
    component: () => import('@/views/Connecte/NiveauExercice/Gestion/AjouterTest.vue'),
    props: true
  }
  // TODO: Rendre de nouveau disponible après https://github.com/Minigugus/CodinSchool/issues/45
  // {
  //   // Modifier un test
  //   path: '/NiveauExercice/exercice/:idExercice/test/:idTest',
  //   name: 'EditerTest',
  //   component: () => import('@/views/Connecte/NiveauExercice/Gestion/EditerTest.vue'),
  //   props: true
  // }
]
