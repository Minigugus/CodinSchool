'use strict'

// Fausse liste de niveaux en attendant que le schema GraphQL du serveur soit réalisé
const fakeListeNiveau = [
  {
    id: 'niveau-un',
    nom: 'Premier niveau',
    description: 'Les bases de l\'algorithmie.',
    exercice: [
      {
        id: 1,
        nom: 'Exercice 1.1',
        description: 'Description exercice 1.1',
        correction: 'Correction exercice 1.1'
      },
      {
        id: 'mon-super-exercice',
        nom: 'Les boucles',
        description: 'Sortir tous les nombres de 1 à 10 séparés par un retour à la ligne.',
        correction:
          '#include <stdio.h>\nint main(void) {\n  int i;\n  for (i = 0 ; i < 10 ; ++i)\n    printf("%d\\n", i);\n  return 0;\n}'
      },
      {
        id: 5,
        nom: 'Exercice 1.3',
        description: 'Description exercice 1.3',
        correction: 'Correction exercice 1.3'
      }
    ]
  },
  {
    id: 2,
    nom: 'Niveau 2',
    description: 'Description niveau 2',
    exercice: [
      {
        id: 3,
        nom: 'Exercice 2.1',
        description: 'Description exercice 2.1',
        correction: 'Correction exercice 2.1'
      },
      {
        id: 6,
        nom: 'Exercice 2.2',
        description: 'Description exercice 2.2',
        correction: 'Correction exercice 2.2'
      }
    ]
  },
  {
    id: 3,
    nom: 'Niveau 3',
    description: 'Description niveau 3',
    exercice: [
      {
        id: 9,
        nom: 'Exercice 3.1',
        description: 'Description exercice 3.1',
        correction: 'Correction exercice 3.1'
      },
      {
        id: 4,
        nom: 'Exercice 3.2',
        description: 'Description exercice 3.2',
        correction: 'Correction exercice 3.2'
      }
    ]
  }
]

export { fakeListeNiveau }
