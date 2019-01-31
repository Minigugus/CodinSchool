import Sequelize from 'sequelize'
import Niveau from './Niveau'
import bdd from '../bdd'

export default {
  Query: {
    niveaux() {
      return Niveau.findAll({ order: [['position', 'ASC']] })
    },
    async niveau(_, { id }) {
      const niveau = Niveau.findByPk(id)
      if (!niveau)
        throw new Error(`Le Niveau « ${id} » n'existe pas.`)
      return niveau
    }
  },
  Mutation: {
    creerNiveau(_, { niveau }) {
      return bdd.transaction(async transaction => {
        const dernierNiveau = await Niveau.max('position', { transaction })
        niveau.position = dernierNiveau + 1 || 0
        return Niveau.create(niveau, { transaction })
      })
    },
    async editerNiveau(_, { id, niveau }) {
      const affecte = await Niveau.update(niveau, { where: { id } })
      if (!affecte) throw new Error(`Le Niveau « ${id} » n'existe pas.`)
      return await Niveau.findByPk(id)
    },
    async reorganiserNiveaux(_, { niveaux }) {
      await bdd.transaction(async transaction => {
        const nombreNiveaux = await Niveau.count({ transaction })
        if (niveaux.length < nombreNiveaux)
          throw new Error('Vous devez réordoner tous les niveaux.')
        else if (niveaux.length > nombreNiveaux) throw new Error('Au moins un Niveau n\'existe pas.')
        return Promise.all(
          niveaux.map((id, position) => Niveau.update({ position }, { where: { id }, transaction }))
        )
      })
      // await Niveau.update(niveaux.map((id, position) => ({ id, position })), { where: { } });
      return await Niveau.findAll({
        where: {
          id: { [Sequelize.Op.in]: niveaux }
        },
        order: [['position', 'ASC']]
      })
    },
    async supprimerNiveau(_, { id }) {
      const affecte = await Niveau.destroy({ where: { id } })
      if (!affecte) throw new Error(`Le Niveau « ${id} » n'existe pas.`)
      return id
    }
  },

  Niveau: {
    exercices(niveau) {
      // TODO : Cacher les exercices aux étudiants qui n'ont pas débloqué le niveau précédent.
      return niveau.getExercices({ order: [['position', 'ASC']] })
    }
  }
}
