# Exercice

## Structure

 - `id` (`string`) : ID de l'exercice.
 - `name` (`string`) : Nom de l'exercice.
 - `description` (`string`) : Description de l'exercice.
 - `score` (`float`) : Meilleur score obtenu sur cet exercice par l'utilisateur connecté.
 - `skills_unlocked` (`integer[]`) : Compétences débloquées une fois cet exercice résolu.
 - `language` (`string`) : Langage de programmation de cet exercice.

## Opérations

### GET `/exercices`

Authentification requise.
Retourne la liste des exercices visible par l'utilisateur connecté.

#### Requête

Aucun paramètre requis.

#### Réponse

Status :
 - Succès : `200 OK`
 - Exercice introuvable : `404 Not Found`

Retourne une description succinte des exercices disponibles dans un tableau JSON.

Exemple :

```json
[
	{
		"id": "hello-world",
		"name": "Hello World !",
		"description": "Le premier programme que tout developpeur doit connaître !"
		"score": 1,
		"skills_unlocked": [ 153, 406 ],
		"language": "c"
	},
	{
		"id": "somme-nombres",
		"name": "Somme de Nombres",
		"description": "Additionner 2 nombres choisis par l'utilisateur. C'est aussi simple que ça !"
		"score": 0.42,
		"skills_unlocked": [ 75, 153, 241 ],
		"language": "java"
	}
]
```

NOTES :
 - `score` est compris entre 0 et 1 inclus, 2 chiffres significatifs max.

*FIXME : ajouter un champ « skills_required » pour bloquer l'accès à un exercice aux utilisateurs qui n'auraient pas fait assez d'exercices débloquant la/les compétences requise ?*


### GET `/exercices/{exercice.id}`

Authentification requise.
Retourne une description plus détaillé d'un exercice.

#### Requête

Dans l'url :
 - `exercice.id` : ID de l'exercice à obtenir.

#### Réponse

Status : `200 OK`

Retourne une description succinte des exercices disponibles dans un tableau JSON.

Exemple :

```json
{
	"id": "hello-world",
	"name": "Hello World !",
	"description": "Le premier programme que tout developpeur doit connaître !"
	"score": 1,
	"skills_unlocked": [ 153, 406 ],
	"language": "java",
	"nb_tests": 2,
	"best_code": "class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println(\"Hello World!\"); }\n\t}\n}"
	"exemples": [
		{
			"input": "",
			"output": "Hello World!\n",
			"description": "Très compliqué..."
		}
	]
}
```

*NOTE : `best_code` est le code par défaut si l'exercice n'a pas encore était évalué au moins fois.*

### POST `/exercices/{exercice.id}`

Authentification requise.
Évalue un code source sur les tests 

#### Requête

Corps de type MIME `text/plain` : code source à évaluer (1 seul fichier).

#### Réponse

Status : `200 OK`

Retourne un flux de type MIME `text/event-stream` (voir [la documentation MDN](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)).

Une évaluation peut être placé dans une file d'attente si le serveur est surchagé.

Exemple:

```
: CodingSchool - Evaluation in progress

event: queued
data: { position: 1, total: 2 }

event: compilation_started
data: { timestamp: 1525050061 }

event: compilation_done
data: { timestamp: 1525050161, passed: true }

event: test_started
data: { timestamp: 1525050168, id: 0 }

event: test_started
data: { timestamp: 1525050170, id: 1 }

event: test_done
data: { timestamp: 1525050178, id: 0, passed: false, code: 127, expected: "Hello World!", output: "Hello World !" }

event: test_done
data: { timestamp: 1525050181, id: 1, passed: true }

```

Description des évènements (par ordre d'apparition):
 - `queued` : L'évaluation est dans une file d'attente. L'évènement est renvoyé toutes 3 secondes environ tant que l'évaluation est dans la file.
 - `compilation_started` : La compilation a commencé.
 - `compilation_done` : La compilation est terminée.
 - `test_started` : Un test à commencé.
 - `test_done` : Un test est terminé.

*FIXME : Limiter le nombre de tentatives par minute ?*