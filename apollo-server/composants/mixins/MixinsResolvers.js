import deepmerge from 'deepmerge'

const extraireArguments = (parametres, rappel) => (argThis, args) =>
  rappel.apply(argThis, parametres.map(parametre => args[parametre]))

export const recupererParIDResolver = (recupererParID, id) =>
  extraireArguments([ id ], recupererParID)
export const creerResolver = (creer, instance) =>
  extraireArguments([ instance ], creer)
export const editerResolver = (editer, id, instance) =>
  extraireArguments([ id, instance ], editer)
export const supprimerResolver = (supprimer, id) =>
  extraireArguments([ id ], supprimer)

export const CRUDResolversMixin = (
  nomType,
  { recupererParID, creer, editer, supprimer },
  {
    id = 'id',
    instance = nomType.toLowerCase()
  } = {}
) => ({
  Query: {
    [nomType.toLowerCase()]: recupererParIDResolver(recupererParID, id)
  },
  Mutation: {
    [`creer${nomType}`]: creerResolver(creer, instance),
    [`editer${nomType}`]: editerResolver(editer, id, instance),
    [`supprimer${nomType}`]: supprimerResolver(supprimer, id)
  }
})

export const reorganiserResolver = (reorganiser, ids) =>
  extraireArguments([ ids ], reorganiser)

export const ReorganisableResolversMixin = (nom, { reorganiser }) => ({
  Mutation: {
    [`reorganiser${nom}`]: reorganiserResolver(reorganiser, nom.toLowerCase())
  }
})

export const TypeResolverMixin = (nomType, champ, resolver) => ({
  [nomType]: {
    [champ]: resolver
  }
})

export const RequeteResolverMixin = (champ, resolver) => TypeResolverMixin('Query', champ, resolver)
export const MutationResolverMixin = (champ, resolver) => TypeResolverMixin('Mutation', champ, resolver)

export default (...mixins) => mixins.length < 2 ? mixins[0] : deepmerge.all(mixins)
