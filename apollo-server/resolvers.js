import deepmerge from 'deepmerge'

import Niveau from './composants/niveau/NiveauResolvers'
import Exercice from './composants/exercice/ExerciceResolvers'
import Utilisateur from './composants/utilisateur/ProfileResolvers'

export default deepmerge.all([{ Query: {}, Mutation: {} }, Niveau, Exercice, Utilisateur])
