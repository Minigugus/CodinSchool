# Sert à créer une image Docker.

# Un image Docker est immuable, c'est-à-dire qu'elle ne peut être modifiée après création.
# Pour la mettre à jour, il faut donc en créer une nouvelle.

# Les images Docker servent de « base » à tout container Docker.
# En effet, tous les containers créé avec la même image auront les mêmes fichiers lors de leur premier lancement.
# En pratique, lorsqu'un container est créé, il fait une copie de l'image initiale, permettant à plusieurs
# containers avec la même image initiale d'avoir leurs propres fichiers.

# Pour chaque ligne d'un Dockerfile, Docker crée un container avec comme image initiale, l'image résultant
# de l'éxécution du container associé à la ligne précédente.

# L'image retournée par la dernière ligne est la nouvelle image créée.

# On indique que l'image que l'on est en train de construire reprend les
# fichiers et la configuration de l'image « node:10-alpine ».
# NOTE : Il s'agit d'une version allégée d'un système d'exploitation Linux.
FROM node:10-alpine

# On se déplace dans le dosiser « /usr/src/app » de l'image.
WORKDIR /usr/src/app

# On copie le contenu du répertoire courant DE L'HÔTE dans le répertoire courant DE L'IMAGE.
COPY . .

# On éxécute les commande suivantes dans un terminal (/bin/sh par défaut) dans le container.
RUN npm i -D && NODE_ENV=production npm run build

# Active le mode production
ENV NODE_ENV=production

# On indique quelle commande devra être lancée lorsque l'on lancera un container avec cette image.
# NOTE : Il est possible d'utiliser une autre commande au moment de la création du container.
CMD [ "npm", "run", "servir" ]
