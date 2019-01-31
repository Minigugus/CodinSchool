import Niveau from './Niveau'

export const recupererParId = id => Niveau.findByPk(id)
export const reorganiser = ids => Niveau.update(ids.map((id, no) => ({ id, position: no })))
