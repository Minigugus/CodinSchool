# Activité

## Modèle

Représente une Activité (« étape / page ») que possède un [Chapitre](Chapitre.md).
La date du premier accès à l'Activité est sauvegardé pour chaque [Utilisateur](Utilisateur.md).

### Propriétés

 * `id` - Identifiant de l'Activité.
 * `numéro` - Position de l'Activité dans le chapitre.
 * `chapitre` - Chapitre dans lequel se trouve cette Activité.
 * `modèle` - [Modèle d'Activité](ModeleActivite.md) de cette Activité.
 * `premièreLecture` - Date de la première lecture de l'Activité, ou vide si non lue.
 * `titre` - Titre qui apparaitra dans le Chapitre.
 * `description` - Présentation brève de l'Activité.
 * `corps` - Texte affiché dans l'Activité (en `Markdown` ou `HTML`).

### Opérations

 * `soumettre` - **Seulement lorsque `estNotée` est `Vrai`.** Évaluer le travail d'un Utilisateur sur cette Activité. Les paramètres dépendent de l'Évaluateur défini par le Modèle d'Activité utilisé.