# Utilisateur

## Modèle

Représente un utilisateur connecté.

### Propriétés

 * `id` - Identifiant de l'utilisateur.
 * `nom` - Nom de l'utilisateur.
 * `prénom` - Prénom de l'utilisateur.
 * `email` - Adresse email de l'utilisateur.
 * `estActif` - Le compte peut-il être utilisé.
 * `permissions` - Identifiant des [Permissions](./Permission.md) dont dispose l'Utilisateur.

### Opérations

 * `ouvrirUneSession` - Permet à l'Utilisateur de s'identifier sur CodinSchool.
 * `fermerSaSession` - Ferme la session en cours.
 * `changerSonMotDePasse` - Modifier le mot de passe de l'Utilisateur.
