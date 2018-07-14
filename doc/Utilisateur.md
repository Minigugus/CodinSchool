# Utilisateur

## Modèle

Représente un utilisateur enregistré sur CodinSchool.

### Propriétés

 * `id` - Identifiant de l'Utilisateur.
 * `nom` - Nom de l'Utilisateur.
 * `prénom` - Prénom de l'Utilisateur.
 * `email` - Adresse email de l'Utilisateur.
 * `avatar` - Lien vers l'image représentant l'Utilisateur.
 * `estActif` - Le compte peut-il être utilisé.
 * `roles` - [Rôles](Role.md) auxquel appartient cet Utilisateur.

### Opérations

 * `s'inscrire` - Permet à un utilisateur de s'enregistrer. L'Administrateur doit valider cette inscription.
 * `ouvrirUneSession` - Permet à l'Utilisateur de s'identifier sur CodinSchool.
 * `fermerSaSession` - Ferme la session en cours.
 * `changerSonMotDePasse` - Modifier le mot de passe de l'Utilisateur.

### Opérations Administratives

 * `validerInscription` - Valider la demande d'inscription de l'Utilisateur.
 * `changerMotDePasse` - Modifier le mot de passe de l'Utilisateur.
 * `activer/desactiver` - Autoriser / Interdire la connexion de l'Utilisateur sur CodinSchool.
 * `supprimer` - Supprimer l'Utilisateur de la base de donnée.