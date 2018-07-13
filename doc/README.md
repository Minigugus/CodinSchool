# Recherche des modèles nécessaires

## Analyse des besoins

* Le site propose à l'utilisateur une suite de Niveau.
* Chaque Niveau est constitué d'une suite de Chapitre.
* Un chapitre est peut être une suite d'activité qui fait progresser dans le niveau ou une épreuve dite de déblocage de Niveau.
* Tout le monde peut accèder au niveau 1. Un utilisateur peut accèder au niveau N si et seulement s'il a réussi toutes les évaluations du niveau N-1 ou s'il a réussi une épreuve.
de déblocage du niveau N.
* Une activité peut-être :
 - Un cours
 - Un TD
 - Un TP
 - Une évaluation

## Modèles

 * [Activité](./Activité.md) - Représente une Activité (« étape / page ») que possède un Chapitre.
 * [Chapitre](./Chapitre.md) - Représente un Chapitre, contenant une ou plusieurs Activité.
 * [ModèleActivité](./ModèleActivité.md) - Défini les caractéristiques communes aux Activités de ce Modèle.
 * [Niveau](./Niveau.md) - Représente un Niveu, contenant un ou plusieurs Chapitres.
 * [Utilisateur](./Utilisateur.md) - Représente un Utilisateur de CodinSchool.