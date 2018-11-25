////////////////////////////////////////////
// Gestion de la configuration du serveur //
////////////////////////////////////////////

'use strict';

const MODE_DEVELOPPEMENT = (process.env.NODE_ENV !== 'production');

if (!MODE_DEVELOPPEMENT && !process.env.SECRET_JWT)
	throw new Error("En mode production, vous devez spécifier un secret via la variable d'environnement SECRET_JWT.");

module.exports = {
	MODE_DEVELOPPEMENT,

	// Réseau
	PORT: process.env.PORT || (MODE_DEVELOPPEMENT ? 4000 : 80),

	// Jeton de session JWT
	SECRET_JWT: process.env.SECRET_JWT || 'mode_developpement',
	DUREE_VALIDITE_JETON: '1d'
};
