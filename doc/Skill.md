# Skill

## Structure

 - `id` (`integer`) : ID de la compétence.
 - `name` (`string`) : Nom de la compétence.
 - `level` (`float`) : Niveau de l'utilisateur pour la compétence donnée.

## Opérations

### GET `/skills`

Authentification requise.
Retourne la liste des compétences visibles par l'utilisateur connecté.

#### Requête

Aucun paramètre requis.

#### Réponse

Status : `200 OK`

Retourne une description succinte des exercices disponibles dans un tableau JSON.

Exemple :

```json
[
	{
		"id": 153,
		"name": "Manipulation des chaines de caractères",
		"level": 0.5
	},
	{
		"id": 406,
		"name": "Utilisation de CodinSchool",
		"level": 1
	}
]
```

*FIXME : Ajouter une description ?*