import { promisify } from 'util'
import * as jwt from 'jsonwebtoken'

import { SECRET_JWT, DUREE_VALIDITE_JETON } from '../config'

const sign = promisify(jwt.sign)
const verify = promisify(jwt.verify)

export const creerJeton = ({ id }) => sign({ id }, SECRET_JWT, { expiresIn: DUREE_VALIDITE_JETON })
export const validerJeton = jeton => verify(jeton, SECRET_JWT, { })
