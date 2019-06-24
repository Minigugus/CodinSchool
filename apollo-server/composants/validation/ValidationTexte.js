import { ValidationError, typeProbleme, longueurMaxProbleme, longueurMinProbleme } from './ValidationErreurs'
import validateurVersDirective from './Directive'

/**
 * Convertir une chaîne en kebab case sans accent ni symboles interdits.
 *
 * @param {string} chaineAConvertir la chaîne à convertir
 * @returns {string} la chaîne en kebab case
 */
export const casseKebab = chaineAConvertir => chaineAConvertir
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/\s+]/gi, '-')
  .replace(/\-+/g, '-')
  .replace(/^\-|\-$/g, '')
  .toLowerCase()

export const estCasseKebab = chaineATester => /^(?:(?:[a-z0-9]+)-)*(?:[a-z0-9]+)$/.test(chaineATester)

export const estTexteValidateur = (valeurAValider, emplacement = '') => {
  if (typeof valeurAValider !== 'string')
    throw new ValidationError(
      typeProbleme(emplacement, 'string', typeof valeurAValider, valeurAValider)
    )
  return valeurAValider
}

export const longueurMinValidateur = longueurMin => (valeurAValider, emplacement = '') => {
  if (typeof valeurAValider !== 'string' || (valeurAValider.length < longueurMin))
    throw new ValidationError(
      longueurMinProbleme(emplacement, longueurMin, valeurAValider)
    )
  return valeurAValider
}

export const longueurMaxValidateur = longueurMax => (valeurAValider, emplacement = '') => {
  if (typeof valeurAValider !== 'string' || (valeurAValider.length > longueurMax))
    throw new ValidationError(
      longueurMaxProbleme(emplacement, longueurMax, valeurAValider)
    )
  return valeurAValider
}

export const directives = {
  min: validateurVersDirective(({ longueur }) => longueurMinValidateur(longueur)),
  max: validateurVersDirective(({ longueur }) => longueurMaxValidateur(longueur))
}
