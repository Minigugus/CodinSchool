import CodinSchoolError from '../erreur'
import { MODE_DEVELOPPEMENT } from '../config'

const probleme = (code, message, emplacement, meta) => ({
  code,
  message,
  emplacement,
  meta
})

export class ValidationError extends CodinSchoolError {
  constructor(...problemes) {
    super('VALIDATION_ECHOUEE', 'Des données invalides ont été passé dans cette requête.', { problemes })
    this.problemes = problemes
  }
}

export const erreurInattendueProbleme = (emplacement, erreurInitiale) => probleme(
  'VALIDATION_ERREUR_INTERNE',
  'Une erreur inattendue est survenue lors de la validation.',
  emplacement,
  MODE_DEVELOPPEMENT ? erreurInitiale : undefined
)

export const egaliteProbleme = (emplacement, attendu, recu) => probleme(
  'VALIDATION_EGALITE',
  `« ${recu} » reçu alors que « ${attendu} » était attendu.`,
  emplacement,
  {
    attendu,
    recu
  }
)

export const typeProbleme = (emplacement, attendu, recu, valeur) => probleme(
  'VALIDATION_TYPE',
  `Type « ${attendu} » attendu, « ${recu} » reçu. Valeur : « ${valeur} ».`,
  emplacement,
  {
    attendu,
    recu,
    valeur
  }
)

export const proprieteManquanteProbleme = (emplacement, nom) => probleme(
  'VALIDATION_PROPRIÉTÉ_MANQUANTE',
  `Propriété « ${nom} » manquante.`,
  emplacement,
  {
    nom
  }
)

export const longueurMaxProbleme = (emplacement, longueur, valeur) => probleme(
  'VALIDATION_LONGUEUR_MAX',
  `Valeur trop longue. Taille maximale: ${longueur} caractère(s) (${valeur.length} reçu(s)).`,
  emplacement,
  {
    max: longueur,
    recu: valeur.length,
    valeur
  }
)

export const longueurMinProbleme = (emplacement, longueur, valeur) => probleme(
  'VALIDATION_LONGUEUR_MIN',
  `Valeur trop courte. Taille minimale: ${longueur} caractère(s) (${valeur.length} reçu(s)).`,
  emplacement,
  {
    min: longueur,
    recu: valeur.length,
    valeur
  }
)
