#!/bin/bash
# set -e

shopt -s extglob

echo Lancement de CodinSchool...

if [[ "$0" == '/docker-lancer.sh' ]]; then

	echo Synchronisation du projet...

	mkdir -p /app
	rm -rf /app/!(package.json|node_modules) /app/.[a-zA-Z]* 2>/dev/null
	cp -rf /usr/src/app/!(package.json|node_modules) /usr/src/app/.[a-zA-Z]* /app

	VERSION_ACTUELLE=$(stat -c %Y /app/package.json 2>/dev/null)
	NOUVELLE_VERSION=$(stat -c %Y /usr/src/app/package.json)

	VERSION_ACTUELLE=${VERSION_ACTUELLE:0}

	cd /app

	# `package.json` modifié -> on met à jour les dépendences locales
	if [[ $VERSION_ACTUELLE -lt $NOUVELLE_VERSION ]]; then
		echo Fichier « package.json » modifié. Mise à jour des dépendences...
		cp /usr/src/app/package.json /app/package.json
		npm i -D
	fi
fi

exec "$@"
