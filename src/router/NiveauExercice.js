/** Liste des pages liées aux niveaux et exercices `/NiveauExercice/` */
export default [
  // Partie "Utilisateur"
  {
    // Faire un exercice
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
    // Lister/Réorganiser les niveaux
    path: '/NiveauExercice/niveau/liste',
    name: 'ListeNiveaux',
    component: () => import('@/views/Connecte/NiveauExercice/Gestion/ListeNiveaux.vue')
  },
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
  }
]
