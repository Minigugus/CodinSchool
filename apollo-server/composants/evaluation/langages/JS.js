export default {
  configurer(source) {
    return {
      source,
      compile: null
    }
  },
  nettoyer() { /* Vide */ },

  compiler(instance) {
    let stdout = '', stderr = ''
    const debut = Date.now()
    try {
      // eslint-disable-next-line no-new-func
      instance.compile = new Function('console', 'prompt', instance.source)
    }
    catch (err) {
      stderr += err.message
    }
    return {
      reussie: !!instance.compile,
      duree: Date.now() - debut,
      code: instance.compile ? 0 : 1,
      stdout,
      stderr
    }
  },
  async tester({ compile }, { entree }) {
    let lignesEntree = entree.split('\n')
    let code = 0, stdout = [], stderr = [], i = 0
    const prompt = () => lignesEntree[i++]
    const console = {
      debug: (...args) => console.log(...args),
      info: (...args) => console.log(...args),
      log: (...args) => {
        stdout.push(...args)
      },
      error: (...args) => {
        stderr.push(...args)
      }
    }
    const debut = Date.now()
    try {
      const result = await compile(console, prompt)
      if (typeof result === 'number')
        code = result | 0
    }
    catch (err) {
      console.error(err.message)
      code = 130
    }
    return {
      code,
      duree: Date.now() - debut,
      stdout: stdout.join('\n'),
      stderr: stderr.join('\n')
    }
  }
}
