// ////////////////////////////////////////////////////////////////
// Couche d'abstraction faisant les appels à la base de données //
// ////////////////////////////////////////////////////////////////

import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'

const adapteur = new FileSync('bdd.json')
const bdd = low(adapteur)

bdd.defaults({ utilisateurs: [], roles: [] }).write()

let utilisateursId = 0,
  rolesId = 0

export default {
  utilisateurs() {
    return bdd.get('utilisateurs').value()
  },
  roles() {
    return bdd.get('roles').value()
  },

  recupererUtilisateur(id) {
    return bdd
      .get('utilisateurs')
      .find({ id })
      .value()
  },
  creerUtilisateur(donneesCreation) {
    if (
      bdd
        .get('utilisateurs')
        .find({ pseudo: donneesCreation.pseudo })
        .value()
    )
      throw new Error('Pseudo déjà utilisé.')
    if (
      bdd
        .get('utilisateurs')
        .find({ email: donneesCreation.email })
        .value()
    )
      throw new Error('Adresse email déjà utilisée.')
    const utilisateur = {
      id: utilisateursId++,
      pseudo: donneesCreation.pseudo,
      motDePasse: donneesCreation.motDePasse,
      incritDepuis: Date.now(),
      nom: donneesCreation.nom,
      prenom: donneesCreation.prenom,
      dateNaissance: donneesCreation.dateNaissance,
      adresse: null,
      codePostal: null,
      emailPrimaire: donneesCreation.email,
      emailSecondaire: null,
      emailVisible: false,
      telephonePrimaire: null,
      telephoneSecondaire: null,
      telephoneVisible: false,
      diplome: null,
      anneeDiplome: null,
      siteWeb: null,
      avatar: null
    }
    bdd
      .get('utilisateurs')
      .push(utilisateur)
      .write()
    return bdd
      .get('utilisateurs')
      .find({ id: utilisateur.id })
      .value()
  },
  editerUtilisateur(id, nouvellesDonnees) {
    if (
      !bdd
        .get('utilisateurs')
        .find({ id })
        .value()
    )
      throw new Error('Utilisateur introuvable.')
    return bdd
      .get('utilisateurs')
      .find({ id })
      .assign(nouvellesDonnees)
      .write()
  },
  supprimerUtilisateur(id) {
    if (
      !bdd
        .get('utilisateurs')
        .find({ id })
        .value()
    )
      throw new Error('Utilisateur introuvable.')
    return bdd
      .get('utilisateurs')
      .remove({ id })
      .write()
  },

  authentifier(email, motDePasse) {
    const utilisateur = bdd
      .get('utilisateurs')
      .find({ emailPrimaire: email })
      .value()
    if (!utilisateur || utilisateur.motDePasse !== motDePasse)
      throw new Error('Email ou mot de passe incorrect.')
    return utilisateur
  },

  recupererRole(id) {
    return bdd
      .get('roles')
      .find({ id })
      .value()
  },
  creerRole(donneesCreation) {
    const role = {
      id: rolesId++,
      membres: [],
      ...donneesCreation
    }
    bdd
      .get('roles')
      .push(role)
      .write()
    return role
  },
  editerRole(id, nouvellesDonnees) {
    if (
      !bdd
        .get('roles')
        .find({ id })
        .value()
    )
      throw new Error('Rôle introuvable.')
    return bdd
      .get('roles')
      .find({ id })
      .assign(nouvellesDonnees)
      .write()
  },
  supprimerRole(id) {
    if (
      !bdd
        .get('roles')
        .find({ id })
        .value()
    )
      throw new Error('Rôle introuvable.')
    return bdd
      .get('roles')
      .remove({ id })
      .write()
  },

  recupererRolesUtilisateur(utilisateur) {
    const roles = bdd
      .get('roles')
      .filter(r => r.membres.includes(utilisateur.id))
      .value()
    return roles
  },
  recupererUtilisateursRole(role) {
    role = this.recupererRole(role.id)
    return bdd
      .get('utilisateurs')
      .filter(u => role.membres.includes(u.id))
      .value()
  },

  recupererPermissions(utilisateur) {
    const roles = (utilisateur.roles = (utilisateur.roles || this.recupererRolesUtilisateur(utilisateur)))
    return roles.reduce((permissions, role) => {
      for (let p of role.permissions) permissions.add(p)
      return permissions
    }, new Set())
  },

  ajouterRole(idUtilisateur, idRole) {
    if (
      !bdd
        .get('roles')
        .find({ id: idRole })
        .value()
    )
      throw new Error(`Rôle ${idRole} introuvable.`)
    if (
      !bdd
        .get('utilisateurs')
        .find({ id: idUtilisateur })
        .value()
    )
      throw new Error(`Utilisateur ${idUtilisateur} introuvable.`)
    return bdd
      .get('roles')
      .find({ id: idRole })
      .tap(r => r.membres.push(idUtilisateur))
      .write()
  }
}
