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

export default async function* (preparer, code, entrees, _utilisateur) {
  let compile, stdout = '', stderr = ''
  yield preparer('DEBUT_COMPILATION')
  const debut = Date.now()
  try {
    // eslint-disable-next-line no-new-func
    compile = new Function('console', 'prompt', code)
  }
  catch (err) {
    stderr += err.message
    compile = null
  }
  const compilation = {
    reussie: !!compile,
    duree: Date.now() - debut,
    code: compile ? 0 : 1,
    stdout,
    stderr
  }
  yield preparer('FIN_COMPILATION', { compilation })
  let tests = null
  if (compile) {
    yield* asyncIteratorFromCb(async cb =>
      tests = await Promise.all(entrees.map(async (entree, id) => {
        let testCode = 0
        let lignesEntree = entree.split('\n')
        let testStdout = []
        let testStderr = []
        let i = 0
        const prompt = () => lignesEntree[i++]
        const console = {
          debug: (...args) => this.log(...args),
          info: (...args) => this.log(...args),
          log: (...args) => {
            testStdout.push(...args)
          },
          error: (...args) => {
            testStderr.push(...args)
          }
        }
        const debutTest = Date.now()
        cb(preparer('DEBUT_EXECUTION_TEST', { id }))
        try {
          const result = await compile(console, prompt)
          if (typeof result === 'number')
            testCode = result | 0
        }
        catch (err) {
          console.error(err.message)
          testCode = 130
        }
        const test = {
          id,
          code: testCode,
          duree: Date.now() - debutTest,
          entree,
          stdout: testStdout.join('\n'),
          stderr: testStderr.join('\n')
        }
        cb(preparer('FIN_EXECUTION_TEST', { id, test }))
        return test
      }))
    )
  }
  yield preparer('FIN_EVALUATION', {
    id: Math.random().toString(36).slice(2),
    compilation,
    tests
  })
}
