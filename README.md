# CodinSchool

## Lancement avec Docker et Docker Compose

### Mode Développement

Utilisé en interne par les équipes de développement.

```sh
docker-compose -f docker-compose.dev.yml up # Ajoutez -d pour lancer le serveur en arrière-plan.
```

### Mode Production

Utilisé sur le serveur qui héberge le projet.

```sh
# Ce « secret » est une chaine de caractères utilisée pour le système d'autentification.
# Il ne doit être partagé sous aucun prétexte puisqu'il pourrait permettre à des pirates
# d'usurper l'identité d'utilisateurs sans avoir besoin de leur identifiants.
export SECRET_JWT=votre_secret_ici

# Décomentez la ligne suivante si vous voulez utiliser un autre port que le port 80.
#export PORT=8080

docker-compose -f docker-compose.prod.yml up # Ajoutez -d pour lancer le serveur en arrière-plan.
```


<!-- ## Project setup -->
## Mise en place du projet sans passer par Docker

> Cette partie de la documentation a été auto-générée par VueCLI.

```
npm install
```

<!-- ### Compiles and hot-reloads for development -->
### Compilation et Rechargement à Chaud pour le Développement

```
npm run serve
```

<!-- ### Compiles and minifies for production -->
### Compile et Minifie le Code pour la Production

```
npm run build
```

<!-- ### Run your tests -->
### Éxécute les Tests Automatisés

```
npm run test
```

<!-- ### Lints and fixes files -->
### Lint et Corrige les Fichiers Source

```
npm run lint
```

<!-- ### Customize configuration -->
### Personalisation de la configuration

<!-- See [Configuration Reference](https://cli.vuejs.org/config/). -->
Voir [Référence de la Configuration](https://cli.vuejs.org/config/).
