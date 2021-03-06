import path from 'path'
import fs from 'fs'
import { parse, Kind, buildASTSchema, print } from 'graphql'

const REGEXP_IMPORT = /^\s*#\s*(?:import\s+(?:\*|([\S]+))\s+from|import)\s+(?:'((?:\\'|[^'])+)'|"((?:\\"|[^"])+)");?\s*$/mg

/**
 * Importe un schéma GraphQL récursivement en fusionant les types de même nom.
 * Supporte les importations cycliques.
 *
 * @param {string} fichier Chemin vers le fichier principal à charger.
 * @param {string} dossier Base du chemin relatif du fichier à importer.
 * @returns {GraphQLSchema} Schéma GraphQL résultant de l'importation et de la fusion des types.
 */
const importerSchema = (fichier, { dossier = __dirname, trier = false } = {}) => {
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
        contenu.replace(REGEXP_IMPORT, '').trim()
      )
      // On charge les importations
      for (let i; (i = REGEXP_IMPORT.exec(contenu)) !== null; null) importer(i[2] || i[3], _dossier)
      REGEXP_IMPORT.lastIndex = 0
    }
  }
  const definitionsParNom = new Map()
  const fusionDirectives = (actuel, nouveau) => {
    actuel.directives = nouveau.directives.reduce((arr, directive) => {
      const nom = directive.name.value
      if (!~arr.findIndex(_directive => _directive.name.value === nom))
        arr.push(directive)
      return arr
    }, actuel.directives)
  }
  const trierParNom = tableau => trier
    ? trier instanceof Function
      ? tableau.sort(trier)
      : tableau.sort((a, b) => a.name.value.localeCompare(b.name.value))
    : undefined
  const fusionChamps = (actuel, nouveau) => {
    actuel.fields.push(...nouveau.fields)
    trierParNom(actuel.fields)
    fusionDirectives(actuel, nouveau)
  }
  const fusionValeurs = (actuel, nouveau) => {
    actuel.values.push(...nouveau.values)
    trierParNom(actuel.values)
    fusionDirectives(actuel, nouveau)
  }
  const aucuneFusion = () => {
    // Ce type ne nécessite pas de fusion.
  }
  const fusions = {
    [Kind.INPUT_OBJECT_TYPE_DEFINITION]: fusionChamps,
    [Kind.INTERFACE_TYPE_DEFINITION]: fusionChamps,
    [Kind.OBJECT_TYPE_DEFINITION]: fusionChamps,
    [Kind.UNION_TYPE_DEFINITION]: fusionChamps,

    [Kind.SCALAR_TYPE_DEFINITION]: aucuneFusion,
    [Kind.DIRECTIVE_DEFINITION]: aucuneFusion,

    [Kind.ENUM_TYPE_DEFINITION]: fusionValeurs
  }
  const regrouperDefinitions = sources => {
    for (let source of sources)
      if (source.length)
        for (let definition of parse(source, { noLocation: true }).definitions)
          if ('name' in definition && definitionsParNom.has(definition.name.value))
            if (definition.kind in fusions)
              fusions[definition.kind](definitionsParNom.get(definition.name.value), definition)
            else
              console.warn(`Le type GraphQL « ${definition.kind} » ne peut être fusionné.`)
          else {
            if ('fields' in definition)
              trierParNom(definition.fields)
            if ('values' in definition)
              trierParNom(definition.values)
            definitionsParNom.set(
              definition.name ? definition.name.value : definition,
              definition
            )
          }
  }
  const recreerDocument = definitions => ({
    kind: 'Document',
    definitions: [
      ...definitions
    ],
    loc: { start: 0, end: 0 }
  })

  importer(fichier, dossier)
  regrouperDefinitions(charge.values())
  const document = recreerDocument([...definitionsParNom.values()])

  return document
}

const document = importerSchema('schema.graphql', { trier: true })

export const schema = buildASTSchema(document)

export default print(document)
