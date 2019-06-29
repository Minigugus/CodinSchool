import Sequelize from 'sequelize'
import bdd from '../bdd'

import Exercice from '../exercice/ExerciceModele'

const Niveau = bdd.define(
  'niveau',
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

    introduction: {
      allowNull: false,
      defaultValue: '',
      type: Sequelize.STRING(5000)
    },

    position: {
      allowNull: false,
      type: Sequelize.INTEGER // ,
      // unique: true
    }
  },
  {
    timestamps: true,

    createdAt: 'dateCreation',
    updatedAt: false,

    name: {
      singular: 'niveau',
      plural: 'niveaux'
    },

    tableName: 'niveaux'
  }
)

export default Niveau

export const niveauVersExercice = Niveau.hasMany(Exercice, { onDelete: 'CASCADE' })
export const exerciceVersNiveau = Exercice.belongsTo(Niveau, { onDelete: 'CASCADE' })
