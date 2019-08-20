import Sequelize from 'sequelize'
import bdd from '../../../bdd'

const ResultatTest = bdd.define(
  'resultat_test',
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

    duree: {
      allowNull: false,
      type: Sequelize.INTEGER
    },

    code: {
      allowNull: false,
      type: Sequelize.INTEGER
    },

    passe: {
      allowNull: false,
      type: Sequelize.BOOLEAN
    },

    entree: {
      allowNull: false,
      type: Sequelize.STRING(20000)
    },
    attendu: {
      allowNull: false,
      type: Sequelize.STRING(20000)
    },

    stdout: {
      allowNull: false,
      defaultValue: '',
      type: Sequelize.STRING(20000)
    },
    stderr: {
      allowNull: false,
      defaultValue: '',
      type: Sequelize.STRING(20000)
    }
  },
  {
    timestamps: true,

    createdAt: 'date',
    updatedAt: false
  }
)

export default ResultatTest
