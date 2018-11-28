// ////////////////////////////////////////////////////////////////
// Couche d'abstraction faisant les appels à la base de données //
// ////////////////////////////////////////////////////////////////

import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'

const adapteur = new FileSync('bdd.json')
const bdd = low(adapteur)

bdd.defaults({ utilisateurs: [], roles: [] }).write()

let utilisateurs_id = 0,
  roles_id = 0

export default {
  utilisateurs() {
    return bdd.get('utilisateurs').value()
  },
  roles() {
    return bdd.get('roles').value()
  },

  recuperer_utilisateur(id) {
    return bdd
      .get('utilisateurs')
      .find({ id })
      .value()
  },
  creer_utilisateur(donnees_creation) {
    if (
      bdd
        .get('utilisateurs')
        .find({ pseudo: donnees_creation.pseudo })
        .value()
    )
      throw new Error('Pseudo déjà utilisé.')
    if (
      bdd
        .get('utilisateurs')
        .find({ email: donnees_creation.email })
        .value()
    )
      throw new Error('Adresse email déjà utilisée.')
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
  editer_utilisateur(id, nouvelles_donnees) {
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
      .assign(nouvelles_donnees)
      .write()
  },
  supprimer_utilisateur(id) {
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

  authentifier(email, mot_de_passe) {
    const utilisateur = bdd
      .get('utilisateurs')
      .find({ email_primaire: email })
      .value()
    if (!utilisateur || utilisateur.mot_de_passe !== mot_de_passe) throw new Error('Email ou mot de passe incorrect.')
    return utilisateur
  },

  recuperer_role(id) {
    return bdd
      .get('roles')
      .find({ id })
      .value()
  },
  creer_role(donnees_creation) {
    const role = {
      id: roles_id++,
      membres: [],
      ...donnees_creation
    }
    bdd
      .get('roles')
      .push(role)
      .write()
    return role
  },
  editer_role(id, nouvelles_donnees) {
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
      .assign(nouvelles_donnees)
      .write()
  },
  supprimer_role(id) {
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

  recuperer_roles_utilisateur(utilisateur) {
    const roles = bdd
      .get('roles')
      .filter(r => r.membres.includes(utilisateur.id))
      .value()
    return roles
  },
  recuperer_utilisateurs_role(role) {
    role = this.recuperer_role(role.id)
    return bdd
      .get('utilisateurs')
      .filter(u => role.membres.includes(u.id))
      .value()
  },

  recuperer_permissions(utilisateur) {
    const roles = utilisateur.roles || this.recuperer_roles_utilisateur(utilisateur)
    return roles.reduce((permissions, role) => {
      for (let p of role.permissions) permissions.add(p)
      return permissions
    }, new Set())
  },

  ajouter_role(id_utilisateur, id_role) {
    if (
      !bdd
        .get('roles')
        .find({ id: id_role })
        .value()
    )
      throw new Error(`Rôle ${id_role} introuvable.`)
    if (
      !bdd
        .get('utilisateurs')
        .find({ id: id_utilisateur })
        .value()
    )
      throw new Error(`Utilisateur ${id_utilisateur} introuvable.`)
    return bdd
      .get('roles')
      .find({ id: id_role })
      .tap(r => r.membres.push(id_utilisateur))
      .write()
  }
}
