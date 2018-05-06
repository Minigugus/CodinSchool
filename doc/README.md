# CodinSchool - API

Adresse de base : `/api`

## Réponses possibles du serveur

Codes HTTP qui peuvent être retournés par le serveur dans certains cas :
 - `400 Bad Request` : Requête mal formée.
 - `401 Unauthorized` : L'opération demandée requière une authentification.

Les autres codes sont spécifiques à chaque route (spécifié leur documentation).

## Fonctionnement de l'API

Un [Utilisateur](./User.md) (`User`) peut résoudre des exercices.

Un [Exercice](./Exercice.md) (`Exercice`) est disponible dans un seul [Langage de programmation](./Language.md) (`Language`).

Un [Exercice](./Exercice.md) est « résolu » lorsqu'un [Utilisateur](./User.md) passe tous les tests de celui-ci.

Un score est attribué à chaque [Exercice](./Exercice.md) en fonction du nombre de tests passés, de 0 à 1 inclu.
Il est calculé ainsi : `[NOMBRE_TESTS_PASSÉS] / [NOMBRE_TESTS_DE_L_EXERCICE]`.

Un [Exercice](./Exercice.md) « résolu » apporte 1 point dans chaque compétence qu'il met en pratique.

Une [Compétence](./Skill.md) (`Skill`) est évaluée grâce au nombre de points que l'[Utilisateur](./User.md) a acqui en résolvant des exercices, de 0 à 1 inclu.
Elle est calculée ainsi : `[NOMBRE_D_EXERCICES_RÉSOLUS_APPORTANT_CETTE_COMPÉTENCE] / [NOMBRE_TOTAL_D_EXERCICES_APPORTANT_CETTE_COMPÉTENCE]`

## Améliorations possibles

 - Séparer les Utilisateurs dans des Groupes. Chaque Exercice pourrait ainsi être accessible à certains groupes uniquement.
 - Proposer plusieurs Langages pour un même Exercice.