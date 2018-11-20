//////////////////////////////////////////////////////////////////
// Couche d'abstraction faisant les appels à la base de données //
//////////////////////////////////////////////////////////////////

'use strict';

// A CHANGER //
let utilisateurs_id = 0;
const utilisateurs = new Map();

let roles_id = 0;
const roles = new Map();

module.exports = {
	get utilisateurs() { return Array.from(utilisateurs.values()); },
	get roles() { return Array.from(roles.values()); },

	recuperer_utilisateur(id) {
		return utilisateurs.get(id);
	},
	creer_utilisateur(donnees_creation) {
		if (this.utilisateurs.find(u => u.pseudo === donnees_creation.pseudo || u.email_primaire === donnees_creation.email || u.email_secondaire === donnees_creation.email))
			throw new Error('Pseudo et/ou adresse email déjà utilisé(s).');
		const utilisateur = {
			id: utilisateurs_id++,
			pseudo: donnees_creation.pseudo,
			mot_de_passe: donnees_creation.mot_de_passe,
			incrit_depuis: Date.now(),
			nom: donnees_creation.nom,
			prenom: donnees_creation.prenom,
			date_naissance: donnees_creation.date_naissance,
			adresse: null,
			code_postal: null,
			email_primaire: donnees_creation.email,
			email_secondaire: null,
			email_visible: false,
			telephone_primaire: null,
			telephone_secondaire: null,
			telephone_visible: false,
			diplome: null,
			annee_diplome: null,
			site_web: null,
			avatar: null
		};
		utilisateurs.set(utilisateur.id, utilisateur);
		return utilisateur;
	},
	editer_utilisateur(id, nouvelles_donnees) {
		let utilisateur = this.recuperer_utilisateur(id);
		if (!utilisateur)
			throw new Error('Utilisateur introuvable.');
		utilisateur = Object.assign(utilisateur, nouvelles_donnees);
		utilisateurs.set(utilisateur.id, utilisateur);
		return utilisateur;
	},
	supprimer_utilisateur(id) {
		const utilisateur = this.recuperer_utilisateur(id);
		if (!utilisateur)
			throw new Error('Utilisateur introuvable.');
		utilisateurs.delete(id);
		return utilisateur;
	},

	authentifier(email, mot_de_passe) {
		const utilisateur = this.utilisateurs.find(u => u.email === email);
		if (!utilisateur || utilisateur.mot_de_passe !== mot_de_passe)
			throw new Error('Email ou mot de passe incorrect.');
		return utilisateur;
	},

	recuperer_role(id) {
		return roles.get(id);
	},
	creer_role(donnees_creation) {
		const role = {
			id: roles_id++,
			membres: [],
			...donnees_creation
		};
		roles.set(role.id, role);
		return role;
	},
	editer_role(id, nouvelles_donnees) {
		let role = this.recuperer_role(id);
		if (!role)
			throw new Error('Rôle introuvable.');
		role = Object.assign(role, nouvelles_donnees);
		roles.set(role.id, role);
		return role;
	},
	supprimer_role(id) {
		const role = this.recuperer_role(id);
		if (!role)
			throw new Error('Rôle introuvable.');
		roles.delete(id);
		return role;
	},

	recuperer_roles_utilisateur(utilisateur) {
		return this.roles
			.filter(r => r.membres.includes(utilisateur.id));
	},
	recuperer_utilisateurs_role(role) {
		return this.recuperer_role(role.id).membres.map(u => this.recuperer_utilisateur(u));
	},

	recuperer_permissions(utilisateur) {
		(utilisateur.roles || this.recuperer_roles_utilisateur(utilisateur.id))
			.reduce((permissions, role) => {
				for (let p in role.permissions)
					permissions[p] = permissions[p] || role.permissions[p];
			}, {});
	}

	ajouter_role(id_utilisateur, id_role) {
		const role = this.recuperer_role(id_role);
		if (!role)
			throw new Error(`Rôle ${id_role} introuvable.`);
		if (!this.recuperer_utilisateur(id_utilisateur))
			throw new Error(`Utilisateur ${id_utilisateur} introuvable.`);
		if (!role.membres.includes(i => i === id_utilisateur))
			role.membres.push(id_utilisateur);
	}

};
