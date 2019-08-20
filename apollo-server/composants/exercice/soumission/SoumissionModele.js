import Sequelize from 'sequelize'
import bdd from '../../bdd'
import ResultatTest from './test/ResultatTestModele'

const Soumission = bdd.define(
  'soumission',
  {
    id: {
      allowNull: false,
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    duree: {
      allowNull: false,
      type: Sequelize.INTEGER
    },

    passe: {
      allowNull: false,
      type: Sequelize.BOOLEAN
    },

    code: {
      allowNull: false,
      type: Sequelize.STRING(20000)
    },

    nbTests: {
      allowNull: false,
      type: Sequelize.INTEGER
    },

    nbPasses: {
      allowNull: false,
      type: Sequelize.INTEGER
    },

    compilationReussie: {
      allowNull: false,
      type: Sequelize.BOOLEAN
    },

    compilationDuree: {
      allowNull: false,
      type: Sequelize.INTEGER
    },

    compilationCode: {
      allowNull: false,
      type: Sequelize.INTEGER
    },

    compilationStdout: {
      allowNull: false,
      defaultValue: '',
      type: Sequelize.STRING(20000)
    },
    compilationStderr: {
      allowNull: false,
      defaultValue: '',
      type: Sequelize.STRING(20000)
    }
  },
  {
    timestamps: true,

    createdAt: 'date',
    updatedAt: false,

    scopes: {
      default: {
        include: [{ model: ResultatTest, as: 'tests' }]
      }
    }
  }
)

export default Soumission

Soumission.hasMany(ResultatTest, { onDelete: 'CASCADE' })
ResultatTest.belongsTo(Soumission, { onDelete: 'CASCADE' })
