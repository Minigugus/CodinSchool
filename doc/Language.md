# Language

## Structure

 - `id` (`string`) : ID du langage.
 - `name` (`string`) : Nom du langage.

## Opérations

### GET `/languages`

Authentification requise.
Retourne la liste des langages supportés par le serveur.

#### Requête

Aucun paramètre requis.

#### Réponse

Status : `200 OK`

Retourne une description succinte des exercices disponibles dans un tableau JSON.

Exemple :

```json
[
	{
		"id": "c",
		"name": "C",
	},
	{
		"id": "java",
		"name": "Java",
	}
]
```

*FIXME : ajouter un champ « description » aux langages ?*