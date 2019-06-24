import { GraphQLNonNull, GraphQLList } from 'graphql'
import { SchemaDirectiveVisitor } from 'graphql-tools'
import { ValidationError, erreurInattendueProbleme } from './ValidationErreurs'

const VALIDATIONS = Symbol()
const DEJA_PROTEGE = Symbol()

const decapsuler = (type, classe = null) =>
  (classe ? type instanceof classe : 'ofType' in type)
    ? decapsuler(type.ofType, classe)
    : type

const gererErreurValidation = async (promesse, problemes, emplacement) => {
  try {
    await promesse()
  }
  catch (err) {
    if (err instanceof ValidationError)
      err.problemes.forEach(x => problemes.push(x))
    else
      problemes.push(erreurInattendueProbleme(emplacement, err))
  }
}

const validerToutes = async (promesses) => {
  let problemes = []
  for (let [promesse, emplacement] of promesses)
    await gererErreurValidation(() => promesse, problemes, emplacement)
  if (problemes.length)
    throw new ValidationError(...problemes)
}

// eslint-ignore no-use-before-define
const validerArgument = async (validations, valeur, type, emplacement, problemes) => {
  const shouldThrow = problemes === null
  if (shouldThrow)
    problemes = []
  if (validations)
    for (let validation of validations)
      await gererErreurValidation(() => validation(valeur, emplacement), problemes, emplacement)
  if (type instanceof GraphQLList) {
    type = decapsuler(type.ofType, GraphQLNonNull)
    for (let i = 0; i < valeur.length; i++)
      await validerArgument(null, valeur[i], type, `${emplacement}[${i}]`, problemes)
  }
  else
    // eslint-disable-next-line
    await gererErreurValidation(() => validerTypeEtArguments(type, valeur, emplacement), problemes, emplacement)
  if (shouldThrow && problemes.length)
    throw new ValidationError(...problemes)
}

async function validerTypeEtArguments(type, args, emplacement) {
  if (type[VALIDATIONS])
    for (let validation of type[VALIDATIONS])
      await validation(args, emplacement)
  if ('getFields' in type) {
    /** @type {import('graphql').GraphQLField<any, any>} */
    let champ
    const problemes = []
    for (champ of Object.values(type.getFields()))
      if (champ.name in args)
        await validerArgument(champ[VALIDATIONS], args[champ.name], decapsuler(champ.type, GraphQLNonNull), `${emplacement}.${champ.name}`, problemes)
    if (problemes.length)
      throw new ValidationError(...problemes)
  }
}

const assurerSchemaProteges = schema => {
  if (!schema[DEJA_PROTEGE]) {
    schema[DEJA_PROTEGE] = true
    for (let objetType of Object.values(schema.getTypeMap()))
      if ('getFields' in objetType && !objetType.name.startsWith('__')) {
        /** @type {import('graphql').GraphQLField<any, any>} */
        let champAProteger
        for (champAProteger of Object.values(objetType.getFields()))
          if (champAProteger.resolve && champAProteger.args && champAProteger.args.length && !champAProteger.name.startsWith('__')) {
            const resoudre = champAProteger.resolve
            /** @type {Map<string, [import('graphql').GraphQLInputType, import('graphql').GraphQLArgument]>} */
            const argsMap = champAProteger.args.reduce((map, cour) => map.set(cour.name, [decapsuler(cour.type, GraphQLNonNull), cour]), new Map())
            // eslint-disable-next-line
            champAProteger.resolve = function (_, args, __, info) {
              const pending = []
              if (argsMap.size) {
                for (let arg of Object.keys(args)) {
                  if (argsMap.has(arg)) {
                    const [type, argDef] = argsMap.get(arg)
                    pending.push([validerArgument(argDef[VALIDATIONS], args[arg], type, `${info.path.key}:${argDef.name}`, null), `${info.path.key}:${argDef.name}`])
                  }
                }
                if (pending.length)
                  return validerToutes(pending).then(() => resoudre.apply(this, arguments))
              }
              else
                champAProteger.resolve = resoudre
              return resoudre.apply(this, arguments)
            }
          }
      }
  }
}

export default validateur => class DirectiveValidation extends SchemaDirectiveVisitor {
  visitArgumentDefinition(arg) {
    assurerSchemaProteges(this.schema)
    if (!arg[VALIDATIONS])
      arg[VALIDATIONS] = []
    arg[VALIDATIONS].push(validateur(this.args))
  }
  visitInputObject(objet) {
    assurerSchemaProteges(this.schema)
    if (!objet[VALIDATIONS])
      objet[VALIDATIONS] = []
    objet[VALIDATIONS].push(validateur(this.args))
  }
  visitInputFieldDefinition(champ) {
    assurerSchemaProteges(this.schema)
    if (!champ[VALIDATIONS])
      champ[VALIDATIONS] = []
    champ[VALIDATIONS].push(validateur(this.args))
  }
}
