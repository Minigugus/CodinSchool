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
      defaultValue: Sequelize.UUIDV4,
      unique: true
    },
    reinitialisationMdp: {
      allowNull: true,
      type: Sequelize.UUID
    },

    motDePasse: {
      allowNull: false,
      type: Sequelize.STRING
    },

    emailPrimaire: {
      allowNull: false,
      type: Sequelize.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },

    nom: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isAlpha: true
      }
    },
    prenom: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isAlpha: true
      }
    },
    dateNaissance: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        datePassee(valeur) {
          if (new Date(Date.parse(valeur)).getFullYear() >= new Date().getFullYear())
            throw new Error('Date impossible')
        }
      }
    },

    adresse: Sequelize.STRING,
    codePostal: Sequelize.STRING,
    emailSecondaire: {
      type: Sequelize.STRING,
      validate: {
        isEmail: true
      }
    },

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
