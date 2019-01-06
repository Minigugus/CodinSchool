import { hash, compare } from 'bcrypt'

import { BCRYPT_ROUND } from '../config'

export const hasher = async motdepasse => await hash(motdepasse, BCRYPT_ROUND)
export const comparer = async (mdpATester, mdpCrypte) => await compare(mdpATester, mdpCrypte)
