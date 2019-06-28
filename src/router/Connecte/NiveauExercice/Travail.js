/** Liste des pages relatives au passage d'exercices */
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
  }
]
