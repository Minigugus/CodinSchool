import deepmerge from 'deepmerge'

import Role from './composants/role/RoleResolvers'
import Niveau from './composants/niveau/NiveauResolvers'
import Test from './composants/exercice/test/TestResolvers'
import Exercice from './composants/exercice/ExerciceResolvers'
import Utilisateur from './composants/utilisateur/ProfileResolvers'
import Permissions from './composants/permissions/PermissionResolvers'

export default deepmerge.all([{ Query: {}, Mutation: {} }, Niveau, Exercice, Test, Utilisateur, Role, Permissions])
