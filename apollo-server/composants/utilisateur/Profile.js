import Sequelize from 'sequelize'
import bdd from '../bdd'

import { recupererRole, Roles } from '../role'

const Profile = bdd.define('utilisateur', {
  id: {
    allowNull: false,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4
  },

  role: {
    allowNull: false,
    type: Sequelize.ENUM,
    values: Roles,
    get() {
      return recupererRole(this.getDataValue('role'))
    },
    set(valeur) {
      this.setDataValue('role', valeur.nom)
    }
  },

  motDePasse: {
    type: Sequelize.STRING,
    allowNull: false
  },

  nom: { type: Sequelize.STRING, allowNull: false },
  prenom: { type: Sequelize.STRING, allowNull: false },
  dateNaissance: { type: Sequelize.INTEGER, allowNull: false },

  adresse: Sequelize.STRING,
  codePostal: Sequelize.STRING,

  emailPrimaire: Sequelize.STRING,
  emailSecondaire: Sequelize.STRING,

  telephonePrimaire: Sequelize.STRING,
  telephoneSecondaire: Sequelize.STRING,

  diplome: Sequelize.STRING,
  anneeDiplome: Sequelize.INTEGER,

  siteWeb: Sequelize.STRING,

  avatar: Sequelize.STRING
}, {
  timestamps: true,

  createdAt: 'dateInscription',
  updatedAt: false
})

Profile.recupererParID = id => Profile.findById(id)

Profile.inscription = ({ email, motDePasse, nom, prenom, dateNaissance }) => Profile.create({
  email,
  motDePasse,
  nom,
  prenom,
  dateNaissance
})

export default Profile
