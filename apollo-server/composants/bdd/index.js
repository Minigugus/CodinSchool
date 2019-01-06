import Sequelize from 'sequelize'
import { BDD_URI } from '../config'

// TODO : Passer plus de paramètres.
export default new Sequelize(BDD_URI)
