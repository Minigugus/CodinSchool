/**
 * Tester la validité d'une adresse email.
 *
 * @param {string} email la chaîne à vérifier
 * @returns {boolean} la chaîne est une adresse email valide
 */
const isEmail = email => /^([A-Za-z0-9_\-.+])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,})$/.test(email)

/**
 * Activer/Désactiver l'état d'erreur sur un champs de formulaire.
 * @requires Semantic-Ui
 *
 * @param {boolean} activerErreur l'erreur doit-elle être activée
 * @param  {...any} id les id de DOMElement des inputs visés
 * @returns {void}
 */
const setErreurInput = (activerErreur, ...id) =>
  id.forEach(input => {
    activerErreur
      ? document.getElementById(input).parentElement.classList.add('error')
      : document.getElementById(input).parentElement.classList.remove('error')
  })

/**
 * Vérifier qu'un utilisateur possède les permissions requises par une route
 *
 * @param {string[]} permissions liste des permissions de l'utilisateur
 * @param {string[]} permissionsRequises liste des permissions requises par la route
 * @param {object} router l'objet router Vue (`this.$router` dans un objet Vue)
 * @param {string} routeRedirection la page où rediriger en cas de permissions non satisfaites
 * @returns {void}
 */
const checkPermissions = (permissions, permissionsRequises, router, routeRedirection = 'Connexion') =>
  !permissionsRequises.every(x => permissions.includes(x)) && router.replace({ name: routeRedirection })

export { isEmail, setErreurInput, checkPermissions }
