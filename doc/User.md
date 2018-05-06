# User

Il y a plusieurs « nom » pour l'utilisateur :
 - `name` : Nom visible dans l'interface.
 - `username` : Nom servant à la connexion. *FIXME : e-mail ?*

## FIXME

 - Inscription possible depuis l'API (avec ou sans validation l'accord de l'Admin) ?
 - Utiliser les noms - prénoms des utilisateurs plutôt qu'un seul champs `name` ?
 - Rendre les profiles visibles par les autres utilisateurs (comme Moodle) ?
 - Un utilisateur possède une image (inutile si profile non publique) ?

## Structure

 - `id` (`integer`) : ID de l'utilisateur.
 - `name` (`string`) : Nom de l'utilisateur.
 - `email` (`string`) : E-mail de l'utilisateur. *FIXME : Vraiment utile ?*

## Opérations

### POST `/login`

Connecte un utilisateur.

#### Requête

2 paramètres (Type MIME : `x-www-form-urlencoded` - formulaire HTML standard) :
 - `username` : Nom de compte de l'utilisateur.
 - `password` : Mot de passe de l'utilisateur.

#### Réponse

Status :
 - Succès : `200 OK`
 - Mauvais identifiants : `403 Forbidden`

En cas de succès, défini le cookie `codinschool_session` avec l'ID de la session et retourne un object `User` qui représente l'utilisateur connecté.

Exemple :

```json
{
	"id": 42,
	"name": "DUPONT Robert"
}
```


### GET `/logout`

Déconnecte un utilisateur (fait expirer la session).

#### Requête

Aucun paramètre requis.

#### Réponse

Status :
 - Si la session est valide (cookie `codinschool_session`) : `204 No Content`
 - Sinon : `404 Not Found`

En cas de succès invalide la session de `codinschool_session` et supprime le cookie.