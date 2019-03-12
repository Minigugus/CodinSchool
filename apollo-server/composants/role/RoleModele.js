import Sequelize from 'sequelize'
import bdd from '../bdd'

import { Permission } from '.'

export default bdd.define(
  'role',
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
      type: Sequelize.ARRAY(Sequelize.ENUM(Permission)),
      allowNull: false
    },
    parDefaut: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      default: false
    }
  },
  {
    timestamps: true,

    createdAt: false,
    updatedAt: false
  }
)
