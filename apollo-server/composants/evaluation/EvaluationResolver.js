import executer from './EvaluationLogique'

export default {
  Subscription: {
    executer: {
      async subscribe(_, { code, entrees }, { utilisateur }, { fieldName: nomChamp }) {
        return executer((etape, parametres = {}) => ({ [nomChamp]: { ...parametres, etape } }), code, entrees, utilisateur)
      }
    }
  }
}
