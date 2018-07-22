const translations = {
  'invalid_email_password': {
    fr: `Adresse email ou mot de passe incorrect.`,
    en: `Invalid email or password.`
  },
  'bad_email_format': {
    fr: `Le format de l'adresse email renseignée est invalide.`,
    en: `The email address format is invalid.`
  },
  'unexpected_server_error': {
    fr: `Une erreur inattendue est survenue.`,
    en: `Unexpected error.`
  },
  'email_already_in_use': {
    fr: `Adresse email déjà utilisée.`,
    en: `Email address already in use.`
  },
  'not_same_password': {
    fr: `Les mots de passe ne correspondent pas.`,
    en: `Passwords don't match`
  },
  'all_fields_mandatory': {
    fr: `Tous les champs sont obligatoires.`,
    en: `All the fields are mandatory`
  }
}

const emptyServerMessage = {
  fr: `Le serveur a retourné un message vide.`,
  en: `The server returned an empty message.`
}

const unknownErrorTranslation = {
  fr: `Erreur inconnue.`,
  en: `Unknown error`
}

const getEmptyServerMessage = neededlanguage =>
  emptyServerMessage.hasOwnProperty(neededlanguage)
    ? emptyServerMessage[neededlanguage]
    : 'Undefined server message'

const getUnknownMessage = neededlanguage =>
  unknownErrorTranslation.hasOwnProperty(neededlanguage)
    ? unknownErrorTranslation[neededlanguage]
    : 'Undefined message'

const getTranslation = (neededlanguage, content) => {
  // is content not empty nor null
  if (content) {
    // is translation in the list
    if (translations.hasOwnProperty(content) && translations[content].hasOwnProperty(neededlanguage)) {
      return translations[content][neededlanguage]
    } else {
      return getUnknownMessage(neededlanguage)
    }
  }
  return getEmptyServerMessage(neededlanguage)
}

export {
  getTranslation,
  getUnknownMessage
}
