# Module

## Modèle

Représente un Module de cours (ex : « M2103 »), contenant plusieurs [Niveaux](Niveau.md).

### Propriétés

 * `id` - Identifiant du Module.
 * `titre` - Titre du Module.
 * `responsables` - [Utilisateurs](Utilisateur.md) ayant un accès en écriture à ce Module et aux Niveaux / Chapitres / Activités qui le composent.
 * `membres` - [Utilisateurs](Utilisateur.md) ayant un accès en lecture à ce Module.
 * `estPublique` - Permet à tout le monde (suivant le choix de l'Administrateur) d'avoir accès à ce Module. Dans ce cas, la liste des membres est vide.
 * `corps` - Texte affiché avec la liste des Niveaux servant à présenter ce Module (en `Markdown` ou `HTML`).
 * `niveaux` - Niveaux qui composent ce Module.