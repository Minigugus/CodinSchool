import Niveau, { niveauVersExercice } from './NiveauModele'
import { NiveauExistantError, NiveauNonTrouveError, ListeIDsNiveauxInvalideError } from './NiveauErreurs'

import MixinLogique, { CRUDLogiqueMixin, ReorganisatableLogiqueMixin, recupererTousAssociation } from '../mixins/MixinsLogique'

const logique = MixinLogique({
  // Modèle
  modele: Niveau,
  champTrie: 'position',
  cascade: true,

  // Erreurs
  NonTrouve: NiveauNonTrouveError,
  DejaExistant: NiveauExistantError,
  ListeIDsInvalides: ListeIDsNiveauxInvalideError,

  // Mixins
  mixins: [
    CRUDLogiqueMixin,
    ReorganisatableLogiqueMixin
  ]
})

export const recupererExercices = recupererTousAssociation(niveauVersExercice)

export default logique
// export const { recupererTous, recupererParID, creer, editer, supprimer, reorganiser } = logique
