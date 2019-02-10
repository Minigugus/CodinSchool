import path from 'path'
import fs from 'fs'
import { mergeTypes } from 'merge-graphql-schemas'

/**
 * Importe un schéma GraphQL récursivement en fusionant les types de même nom.
 * Supporte les importations cycliques.
 *
 * @param {string} fichier Chemin vers le fichier principal à charger.
 * @param {string} dossier Base du chemin relatif du fichier à importer.
 * @returns {string} Schéma GraphQL résultant de l'importation et de la fusion des types.
 */
const importerSchema = (fichier, dossier = __dirname) => {
  const charge = new Map()
  const importer = (_fichier, _dossier) => {
    const chemin = path.resolve(_dossier, _fichier)
    // On quitte si le fichier est déjà importé
    if (!charge.has(chemin)) {
      // On se place dans le dossier relatif au fichier
      _dossier = path.dirname(chemin)
      // On charge le fichier
      const contenu = fs.readFileSync(chemin, 'utf8')
      // On stocke son contenu
      charge.set(
        chemin,
        contenu.replace(/# ?import (\*|(.*)) from ('|")([^"']+)('|");?/g, '').trim()
      )
      // On charge les importations
      const regex = /# ?import (\*|(.*)) from ('|")([^"']+)('|");?/g
      for (let i; (i = regex.exec(contenu)) !== null; null) importer(i[4], _dossier)
    }
  }
  importer(fichier, dossier)
  // Fusion des schémas
  return mergeTypes(
    // On récupère le contenu des schémas dans un tableau en excluant les schémas vides
    [...charge].filter(partie => partie[1].length).map(partie => partie[1])
  )
}

export default importerSchema('schema.graphql')
