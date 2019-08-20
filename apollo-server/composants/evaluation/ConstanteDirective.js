import { SchemaDirectiveVisitor } from 'graphql-tools'

const CONFIGURATION = Symbol()

const nouveauResolveType = (ancienResolveType, configurationChamps) => function (aValider) {
  let typeValide = null
  for (let [nom, valeurs] of Object.entries(configurationChamps)) {
    const typeAssocieALaValeur = valeurs.get(aValider[nom])
    if (typeValide && (typeValide !== typeAssocieALaValeur))
      break // Impossible de déterminer le type à partir de constantes.
    else if (!typeValide)
      typeValide = typeAssocieALaValeur
  }
  return typeValide
    ? typeValide
    : typeof ancienResolveType === 'function'
      ? ancienResolveType.apply(this, arguments)
      : ancienResolveType
}

export default class ConstanteDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(champ, { objectType: typeAssocie }) {
    const
      NOM_CHAMP = champ.name,
      NOM_TYPE = typeAssocie.name,
      VALEUR = this.args.valeur
    for (const typeImplementes of typeAssocie.getInterfaces()) {
      const champAVerifier = typeImplementes.getFields()[NOM_CHAMP]
      if (champAVerifier) { // Cette instance de « valeur » affecte le type « type »
        let configurationChamps = typeImplementes[CONFIGURATION]
        if (!configurationChamps) { // Première visite du type
          typeImplementes[CONFIGURATION] = (configurationChamps = Object.create(null))
          typeImplementes.resolveType = nouveauResolveType(typeImplementes.resolveType, configurationChamps)
        }
        (configurationChamps[NOM_CHAMP] || (configurationChamps[NOM_CHAMP] = new Map()))
          .set(VALEUR, NOM_TYPE)
      }
    }
  }
}
