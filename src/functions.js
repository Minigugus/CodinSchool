'use strict'

// Fausse liste de niveaux en attendant que le schema GraphQL du serveur soit réalisé
const fakeListeNiveau = [
  {
    id: 1,
    nom: 'Niveau 1',
    description: 'Description niveau 1',
    exercice: [
      {
        id: 1,
        nom: 'Exercice 1.1',
        description: 'Description exercice 1.1'
      },
      {
        id: 2,
        nom: 'Exercice 1.2',
        description: 'Description exercice 1.2'
      },
      {
        id: 5,
        nom: 'Exercice 1.3',
        description: 'Description exercice 1.3'
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
        description: 'Description exercice 2.1'
      },
      {
        id: 6,
        nom: 'Exercice 2.2',
        description: 'Description exercice 2.2'
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
        description: 'Description exercice 3.1'
      },
      {
        id: 4,
        nom: 'Exercice 3.2',
        description: 'Description exercice 3.2'
      }
    ]
  }
]

export { fakeListeNiveau }
