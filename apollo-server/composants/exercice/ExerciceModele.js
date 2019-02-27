import Sequelize from 'sequelize'
import bdd from '../bdd'

const Exercice = bdd.define(
  'exercice',
  {
    id: {
      allowNull: false,
      type: Sequelize.STRING(31),
      primaryKey: true
    },

    titre: {
      allowNull: false,
      type: Sequelize.STRING(127)
    },

    enonce: {
      allowNull: false,
      defaultValue: '',
      type: Sequelize.STRING(2000)
    },

    position: {
      allowNull: false,
      type: Sequelize.INTEGER
    },

    correction: {
      allowNull: false,
      defaultValue: '',
      type: Sequelize.STRING(20000)
    }
  },
  {
    timestamps: true,

    createdAt: 'dateCreation',
    updatedAt: false
  }
)

export default Exercice
