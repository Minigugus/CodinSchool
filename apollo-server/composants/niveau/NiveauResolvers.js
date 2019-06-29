import LogiqueNiveau, { recupererExercices } from './NiveauLogique'

import MixinResolvers, { CRUDResolversMixin, TypeResolverMixin, RequeteResolverMixin, ReorganisableResolversMixin } from '../mixins/MixinsResolvers'

export default MixinResolvers(
  CRUDResolversMixin('Niveau', LogiqueNiveau),
  ReorganisableResolversMixin('Niveaux', LogiqueNiveau),
  TypeResolverMixin('Niveau', 'exercices', recupererExercices),
  RequeteResolverMixin('niveaux', LogiqueNiveau.recupererTous)
)
