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

 * [Activité](Activite.md) - Représente une Activité (« étape / page ») que possède un Chapitre.
 * [Chapitre](Chapitre.md) - Représente un Chapitre, contenant une ou plusieurs Activité.
 * [ModèleActivité](ModeleActivite.md) - Défini les caractéristiques communes aux Activités de ce Modèle.
 * [Module](Module.md) - Représente un Niveu, contenant un ou plusieurs Chapitres.
 * [Niveau](Niveau.md) - Représente un Module de cours (ex : « M2103 »), contenant plusieurs Niveaux.
 * [Rôle](Role.md) - Représente un Rôle auquel appartient un Utilisateur (s'apparente à un groupe).
 * [Utilisateur](Utilisateur.md) - Représente un Utilisateur de CodinSchool.

### Détails : les Modèle d'Activité et les Évaluateurs

Les Modèles d'Activité servent à définir un type d'Activité, ainsi que leur configuration.

Exemple de Modèle :
 - `Cours` - Représente une Activité de type « cours », qui n'est pas évalué.
 - `TD` - Représente une Activité de type « TD », qui peut être évalué.
 - `TP` - Représente une Activité de type « TP », qui peut être évalué.
 - `Évaluation` - Représente une Activité de type « évaluation ».

Ces Modèles permettent entre autre de choisir le type d'évaluation que proposeront les Activités, grâce aux Évaluateurs.
Les *Évaluateurs* sont des « plugins », des extensions de CodinSchool qui permettent de changer le type d'évaluation des Activités.

Exemple d'évaluateurs :
 - `CodinSchoolRunner` - Évaluateur de code en ligne, livré avec CodinSchool. Compile et éxécute le code fourni par l'Utilisateur et le note suivant le nombre de test qu'il réussi.
 - `TableauATrou` - Tableau où l'Utilisateur doit compléter correctement les cases vides.
 - `QCM` - QCM interactif.

### Détails : les Rôles

Les Rôles servent à regrouper les Utilisateurs afin de gérer plus facilement l'accès aux Modules.

Un Utilisateur peut appartenir à plusieurs Rôles.

Tous les Utilisateurs font parti du Rôle `Tout le monde`.
Ce Rôle permet de gérer les permissions de tous les Utilisateurs (ex : `Accès à la liste des Utilisateurs enregistrés`).

Le Rôle `Invités` ne peut contenir aucun Utilisateur.
Il représente tous les utilisateurs du site qui ne sont pas connectés.
Il sert donc à gérér les permissions des utilisateurs non connectés (ex : `Accès aux Modules publiques`).

Exemple de Role :
 - `professeurs` - Professeur inscris sur CodinSchool.
 - `élève` - Tous les élèves inscris sur CodinSchool.
 - `iut_ulco_calais` - Tous les élèves de l'IUT à l'ULCO de Calais.
 - `dut_info_1` - Premières années du DUT Informatique.

### Détails : la Responsabilité

À chaque Module sont attribués des Responsables.

Être Responsable d'un Module donne un accès en écriture à celui-ci, ce qui implique la possibilité :
 - d'éditer le titre, la description et le corps de texte de ce Module.
 - de modifier le contenu de chaque Niveau / Chapitre / Activité que contient ce Module.
 - d'ajouter / retirer des membres de ce Module - *NOTE : Donne donc accès à la liste de tous les Utilisateurs*.
 - d'ajouter / retirer des responsables de ce Module - ***ATTENTION : Un responsable peut donc expulser celui qui l'a invité ! Il faut donc faire attention à qui vous donnez cette permission.***.