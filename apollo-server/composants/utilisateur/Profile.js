import Sequelize from 'sequelize'
import bdd from '../bdd'

import roles from '../role'

const Profile = bdd.define(
  'utilisateur',
  {
    id: {
      primaryKey: true,
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
    },

    role: {
      allowNull: false,
      type: Sequelize.ENUM,
      defaultValue: roles[0],
      values: roles
    },

    validationInscription: {
      allowNull: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
    },

    motDePasse: {
      allowNull: false,
      type: Sequelize.STRING
    },

    emailPrimaire: {
      allowNull: false,
      type: Sequelize.STRING,
      unique: true
    },

    nom: { type: Sequelize.STRING, allowNull: false },
    prenom: { type: Sequelize.STRING, allowNull: false },
    dateNaissance: { type: Sequelize.INTEGER, allowNull: false },

    adresse: Sequelize.STRING,
    codePostal: Sequelize.STRING,
    emailSecondaire: Sequelize.STRING,

    telephonePrimaire: Sequelize.STRING,
    telephoneSecondaire: Sequelize.STRING,

    diplome: Sequelize.STRING,
    anneeDiplome: Sequelize.INTEGER,

    siteWeb: Sequelize.STRING,

    avatar: Sequelize.STRING
  },
  {
    timestamps: true,

    createdAt: 'dateInscription',
    updatedAt: false
  }
)

export default Profile
