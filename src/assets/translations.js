const translations = [
  {
    en: 'Invalid email or password',
    fr: 'Adresse email ou mot de passe incorrect.'
  }
]

export const getTranslation = (content, neededlanguage) => {
  for (const x in translations) {
    if (translations[x].hasOwnProperty(neededlanguage) && translations[x][neededlanguage]) {
      const keys = Object.keys(translations[x])
      for (const y of keys) {
        if (translations[x][y] === content) {
          return translations[x][neededlanguage]
        }
      }
    }
  }
}
