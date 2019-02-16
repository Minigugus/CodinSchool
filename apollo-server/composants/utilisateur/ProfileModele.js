import Sequelize from 'sequelize'
import bdd from '../bdd'

import { Role } from '../role'

const Profile = bdd.define(
  'utilisateur',
  {
    id: {
      primaryKey: true,
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
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
        isEmail: {
          msg: 'Ce champ doit être une adresse e-mail valide.'
        }
      }
    },

    nom: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /(?:\w|[\- ])+/gi,
          msg:
            'Ce champ ne peut contenir que des lettres minuscules ou majuscules, des tirets (-) et des espaces.'
        },
        len: {
          args: [2, 50],
          msg: 'Ce champ doit contenir entre 2 et 20 caractères.'
        }
      }
    },
    prenom: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /(?:\w|[\- ])+/gi,
          msg:
            'Ce champ ne peut contenir que des lettres minuscules ou majuscules, des tirets (-) et des espaces.'
        },
        len: {
          args: [2, 50],
          msg: 'Ce champ doit contenir entre 2 et 20 caractères.'
        }
      }
    },
    dateNaissance: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        estDatePassee(valeur) {
          if (new Date(Date.parse(valeur)).getFullYear() >= new Date().getFullYear())
            throw new Error('Une date de naissance doit être passée.')
        }
      }
    },

    adresse: Sequelize.STRING,
    codePostal: Sequelize.STRING,
    emailSecondaire: {
      type: Sequelize.STRING,
      validate: {
        isEmail: {
          msg: 'Ce champ doit être une adresse e-mail valide.'
        }
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
    updatedAt: false,

    scopes: {
      avecRoles: {
        include: [ { model: Role, as: 'role' } ]
      }
    }
  }
)

Profile.belongsToMany(Role, { as: 'role', through: 'utilisateur_role', timestamps: false })
Role.belongsToMany(Profile, { as: 'membre', through: 'utilisateur_role', timestamps: false })

Object.defineProperty(Profile.prototype, 'roles', {
  configurable: false,
  enumerable: true,
  get() {
    return this.role
  }
})

Object.defineProperty(Profile.prototype, 'permissions', {
  configurable: false,
  enumerable: true,
  // eslint-ignore no-underscore-dangle
  get() {
    if (!this._permissions && this.role)
      this._permissions = this.role.reduce((set, role) => {
        role.permissions.forEach(set.add, set)
        return set
      }, new Set())
    return this._permissions
  }
})

export default Profile
export const ProfileAvecRoles = Profile.scope('avecRoles')
