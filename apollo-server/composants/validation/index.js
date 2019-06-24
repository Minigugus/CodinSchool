import { ValidationError, egaliteProbleme } from './ValidationErreurs'
import { directives as texteDirectives } from './ValidationTexte'

export * from './ValidationTexte'

export const egaliteValidateur = valeurAttendue => (valeurAValider, emplacement = '') => {
  if (valeurAValider !== valeurAttendue)
    throw new ValidationError(
      egaliteProbleme(emplacement, valeurAttendue, valeurAValider)
    )
  return valeurAValider
}
export const parallelValidateur = (...validateurs) => async (valeurAValider, emplacement = '') => {
  const erreursRencontree = []
  for (let validateur of validateurs)
    try {
      await validateur(valeurAValider, emplacement)
    }
    catch (err) {
      erreursRencontree.push(err)
    }
  if (erreursRencontree.length)
    throw new ValidationError(...erreursRencontree.map(v => v.problemes))
  return valeurAValider
}
export const objetValidateur = definition => async (objAValider, emplacement = '') => {
  // const objetSain = Object.create(null)
  const erreursRencontree = []
  const objetSain = {}
  for (let [cle, validateur] of definition) {
    try {
      const valeurInitiale = objAValider[cle]
      const nouvelleValeur = await validateur(objAValider[cle], `${emplacement}.${cle}`)
      objetSain[cle] = nouvelleValeur === undefined
        ? valeurInitiale
        : nouvelleValeur
    }
    catch (err) {
      erreursRencontree.push(err)
    }
  }
  if (erreursRencontree.length)
    throw new ValidationError(...erreursRencontree.map(v => v.problemes))
  return objetSain
}

const VISITE_EN_COURS = Symbol()

export default function construireValidation(definition) {
  if (definition instanceof Function)
    return definition
  else if (Array.isArray(definition))
    return parallelValidateur(...definition.map(construireValidation))
  else if (typeof definition === 'object')
    try {
      if (VISITE_EN_COURS in definition)
        return
      definition[VISITE_EN_COURS] = true
      return objetValidateur(Object
        .entries(definition)
        .map(([cle, valeur]) => [cle, construireValidation(valeur)])
      )
    }
    finally {
      delete definition[VISITE_EN_COURS]
    }
  else
    return egaliteValidateur(definition)
}

export const sequenceValidateur = (...validateurs) => {
  validateurs = validateurs.map(construireValidation)
  return async (valeurAValider, emplacement = '') => {
    let valeurActuelle = valeurAValider
    for (let validateur of validateurs) {
      const nouvelleValeur = await validateur(valeurActuelle, emplacement)
      if (nouvelleValeur !== undefined)
        valeurActuelle = nouvelleValeur
    }
    return valeurActuelle
  }
}

export const optionnelValidateur = definition => {
  definition = construireValidation(definition)
  return async (valeurAValider, emplacement = '') =>
    valeurAValider !== undefined
      ? definition(valeurAValider, emplacement)
      : undefined
}

export const directives = {
  ...texteDirectives
}
