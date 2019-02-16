import { schema } from '../../type-defs'

export default schema
  .getType('Permission')
  .getValues()
  .map(permission => permission.name)
