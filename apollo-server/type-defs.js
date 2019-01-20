import path from 'path'
import { importSchema } from 'graphql-import'

export default importSchema(path.resolve(__dirname, 'schema.graphql'))
