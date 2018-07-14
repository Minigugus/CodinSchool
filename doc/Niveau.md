# Niveau

## Modèle

Représente un Niveau, contenant une ou plusieurs [Chapitres](./Chapitre.md).

### Propriétés

 * `id` - Identifiant du Niveau.
 * `titre` - Titre du Niveau.
 * `responsables` - [Utilisateurs](./Utilisateur.md) responsables de ce Niveau.
 * `corps` - Texte affiché avec la liste des Chapitres servant à présenter ce Niveau (en `Markdown` ou `HTML`).
 * `chapitres` - Chapitres que contient ce Niveau.