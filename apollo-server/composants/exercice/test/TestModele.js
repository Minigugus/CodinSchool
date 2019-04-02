import Sequelize from 'sequelize'
import bdd from '../../bdd'

const Test = bdd.define(
  'test',
  {
    id: {
      allowNull: false,
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    nom: {
      allowNull: false,
      type: Sequelize.STRING(256)
    },

    entree: {
      allowNull: false,
      type: Sequelize.STRING(20000)
    },

    sortie: {
      allowNull: false,
      defaultValue: '',
      type: Sequelize.STRING(20000)
    }
  },
  {
    timestamps: false
  }
)

export default Test
