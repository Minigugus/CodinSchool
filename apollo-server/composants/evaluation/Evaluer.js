const asyncIteratorFromCb = cb => {
  const pendingCb = [], pendingNext = []
  const next = (done, value) => {
    value = { done, value }
    if (pendingCb.length)
      pendingCb.shift()(value)
    else
      pendingNext.push(value)
  }
  cb(next.bind(null, false)).finally(() => next(true))
  return {
    [Symbol.asyncIterator]: () => ({
      next: () => new Promise(res => {
        if (pendingNext.length)
          res(pendingNext.shift())
        else
          pendingCb.push(res)
      }),
      throw: () => Promise.resolve(),
      return: () => Promise.resolve()
    })
  }
}

const mettreAJour = (etat, aChanger, aRetourner = aChanger) => {
  aChanger.etat = etat
  return aRetourner
}

const preparer = (aChanger, aRetourner) => mettreAJour('EN_ATTENTE', aChanger, aRetourner)
const commencer = (aChanger, aRetourner) => mettreAJour('EN_COURS', aChanger, aRetourner)
const terminer = (aChanger, aRetourner) => mettreAJour('TERMINE', aChanger, aRetourner)

export default async function* (moteurCode, source, tests) {
  const soumission = commencer({
    compilation: preparer({
      reussie: null,
      duree: null,
      stdout: null,
      stderr: null,
      code: null
    }),
    tests: null
  })
  const instance = await moteurCode.configurer(source)
  yield commencer(soumission.compilation, soumission)
  soumission.compilation = Object.assign(
    soumission.compilation,
    await moteurCode.compiler(instance)
  )
  if (soumission.compilation.reussie)
    soumission.tests = tests.map(({ nom, entree, sortie }, id) => preparer({
      id,
      nom,
      entree,
      attendu: sortie,

      code: null,
      duree: null,
      passe: null,
      stdout: null,
      stderr: null
    }))
  yield terminer(soumission.compilation, soumission)
  if (soumission.compilation.reussie)
    yield* asyncIteratorFromCb(async cb =>
      await Promise.all(soumission.tests.map(async test => {
        cb(commencer(test, soumission))
        test = Object.assign(
          test,
          await moteurCode.tester(instance, test)
        )
        test.passe = (test.attendu === test.stdout)
        cb(terminer(test, soumission))
      }))
    )
  await moteurCode.nettoyer(instance)
  yield terminer(soumission)
}
