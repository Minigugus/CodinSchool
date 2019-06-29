import bdd from '../bdd'

export const recupererTous = (modele, criteres = {}) => transaction => modele.findAll({ ...criteres, transaction })

export const recupererParID = (modele, NonTrouve) => async (id, transaction) => {
  const instance = await modele.findByPk(id, { transaction })
  if (!instance)
    throw new NonTrouve(id)
  return instance
}

const creer = (modele, DejaExistant, transaction) => async instance => {
  try {
    return await modele.create(instance, { transaction })
  }
  catch (err) {
    // FIXME : Trouver une façon plus viable de vérifier le type d'erreur
    if (
      err.name === 'SequelizeUniqueConstraintError' &&
      err.errors.length === 1 &&
      err.errors[0].type === 'unique violation' &&
      err.errors[0].path === modele.primaryKeyAttribute
    )
      throw new DejaExistant(instance[modele.primaryKeyAttribute])
    throw err
  }
}
const editer = (modele, NonTrouve, DejaExistant, transaction) => async (id, instance) => {
  try {
    const affecte = await modele.update(instance, {
      transaction,
      where: {
        [modele.primaryKeyAttribute]: id
      }
    })
    if (!affecte[0])
      throw new NonTrouve(id)
    return modele.findByPk(instance[modele.primaryKeyAttribute] || id)
  }
  catch (err) {
    // FIXME : Trouver une façon plus viable de vérifier le type d'erreur
    if (
      err.name === 'SequelizeUniqueConstraintError' &&
      err.errors.length === 1 &&
      err.errors[0].type === 'unique violation' &&
      err.errors[0].path === modele.primaryKeyAttribute
    )
      throw new DejaExistant(instance[modele.primaryKeyAttribute])
    throw err
  }
}
const supprimer = (modele, NonTrouve, cascade = false) => async (id, transaction) => {
  const affecte = await modele.destroy({
    transaction,
    cascade,
    where: {
      [modele.primaryKeyAttribute]: id
    }
  })
  if (!affecte)
    throw new NonTrouve(id)
  return id
}

export const CRUDLogiqueMixin = ({ modele, NonTrouve, DejaExistant, cascade = false }) => ({
  recupererTous: recupererTous(modele),
  recupererParID: recupererParID(modele, NonTrouve),

  creer: creer(modele, DejaExistant),
  editer: editer(modele, NonTrouve, DejaExistant),
  supprimer: supprimer(modele, NonTrouve, cascade)
})

const creerTransaction = (rappel, validationAuto = true) => async (...args) => {
  const transaction = await bdd.transaction()
  try {
    const result = await rappel(transaction, ...args)
    if (validationAuto)
      await transaction.commit()
    return result
  }
  catch (err) {
    await transaction.rollback()
    throw err
  }
}

export const creerReorganisable = (modele, champTrie, DejaExistant) => creerTransaction(async (transaction, instance) => {
  const derniereInstance = await modele.max(champTrie, { transaction })
  instance[champTrie] = derniereInstance + 1 || 0
  return await creer(modele, DejaExistant, transaction)(instance)
})

export const recupererTousTrie = (modele, champTrie) => recupererTous(modele, [[champTrie, 'ASC']])

export const reorganiser = (modele, champTrie, ListeIDsInvalides, apresTransaction) =>
  creerTransaction(async (transaction, ids) => {
    const idsTous = (await modele.findAll({ attributes: [modele.primaryKeyAttribute], transaction }))
      .map(instance => instance[modele.primaryKeyAttribute])
    const ensembleIds = new Set(ids)
    const ensembleIdsTous = new Set(idsTous)
    const nonTrouves = ids.filter(id => !ensembleIdsTous.has(id))
    const manquants = idsTous.filter(id => !ensembleIds.has(id))
    if (nonTrouves.length || manquants.length)
      throw new ListeIDsInvalides(nonTrouves, manquants, idsTous)
    await Promise.all(
      ids.map((id, position) =>
        modele.update(
          { [champTrie]: position },
          {
            where: {
              [modele.primaryKeyAttribute]: id
            },
            transaction
          },
        )
      )
    )
    await transaction.commit()
    return apresTransaction()
  }, false)

export const ReorganisatableLogiqueMixin = ({ modele, ListeIDsInvalides, DejaExistant, champTrie = 'position' } = {}) => {
  const toutRecuperer = recupererTousTrie(modele, champTrie)
  return ({
    recupererTous: toutRecuperer,

    creer: creerReorganisable(modele, champTrie, DejaExistant),
    reorganiser: reorganiser(modele, champTrie, ListeIDsInvalides, toutRecuperer)
  })
}

export const recupererTousAssociation = (association, parametres) => instance => instance[association.accessors.get](parametres)

export default ({ mixins, ...config }) => Object.assign(...mixins.map(mixin => mixin(config)))
