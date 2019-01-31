import Sequelize from 'sequelize'
import Exercice from './Exercice'

export default {
  Query: {
    exercice(_, { id }) {
      // TODO : Cacher les exercices aux étudiants qui n'ont pas débloqué le niveau précédent.
      return Exercice.findByPk(id)
    }
  },
  Mutation: {
    creerExercice(_, { exercice }) {
      return Exercice.create(exercice)
    },
    async editerExercice(_, { id, exercice }) {
      const affecte = await Exercice.update(exercice, { where: { id } });
      if (!affecte)
        throw new Error(`L'Exercice « ${id} » n'existe pas.`);
      return await Exercice.findByPk(id);
    },
    async reorganiserExercices(_, { niveau, exercices }) {
      await bdd.transaction(async transaction => {
        return Promise.all(exercices.map((id, position) => Exercice.update({ niveau, position }, { where: { id }, transaction })));
      });
      // await Exercice.update(exercices.map((id, position) => ({ id, position })), { where: { } });
      return await Exercice.findAll({
        where: {
          id: { [Sequelize.Op.in]: exercices }
        },
        order: [[ 'position', 'ASC' ]]
      });
    },
    async supprimerExercice(_, { id }) {
      const affecte = await Exercice.destroy({ where: { id }})
      if (!affecte)
        throw new Error(`L'Exercice « ${id} » n'existe pas.`);
      return id;
    }
  },

  Exercice: {
    niveau(exercice) {
      return exercice.getNiveau()
    }
  }
};