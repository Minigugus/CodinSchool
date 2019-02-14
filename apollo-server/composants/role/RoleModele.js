import Sequelize from 'sequelize'
import bdd from '../bdd'

import permissions from './PermissionModele'

export default bdd.define(
  'utilisateur',
  {
    id: {
      primaryKey: true,
      allowNull: false,
      type: Sequelize.INTEGER,
      autoIncrement: true
    },
    nom: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    permissions: {
      type: Sequelize.ARRAY(Sequelize.ENUM),
      values: permissions
    }
  },
  {
    timestamps: true,

    createdAt: false,
    updatedAt: false
  }
)
