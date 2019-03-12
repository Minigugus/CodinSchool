/**
 * Faire attendre le programme
 * @param {Number} ms nombre de millisecondes à attendre
 * @returns {Promise<void>} Une promesse vide résolvée après `ms` millisecondes
 */
const delay = ms => new Promise(res => setTimeout(res, ms))

/**
 * Tester la validité d'une adresse email.
 *
 * @param {string} email la chaîne à vérifier
 * @returns {boolean} la chaîne est une adresse email valide
 */
const isEmail = email => /^([A-Za-z0-9_\-.+])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,})$/.test(email)

/**
 * Echapper de manière succinte du HTML
 *
 * /!\ Attention : Utiliser uniquement en cas d'obligation de render du HTML (XSS prone) /!\
 * @param {string} content le contenu à échapper
 * @returns {string} la chaine échapée
 */
// prettier-ignore
const escapeHtml = content => {
  [
    [/<\s*script\s*>/gi, '_<_script>'], [/<\s*\/\s*script\s*>/gi, '_<_/script>'], [/<\s*style\s*>/gi, '_<_style>'], [/<\s*\/\s*style\s*>/gi, '_<_/style>'], [/<\s*embed\s*>/gi, '_<_embed>'], [/<\s*\/\s*embed\s*>/gi, '_<_/embed>'], [/<\s*applet\s*>/gi, '_<_applet>'], [/<\s*\/\s*applet\s*>/gi, '_<_/applet>'], [/onload=/gi, '_onload_='], [/onblur=/gi, '_onblur_='], [/onfocus=/gi, '_onfocus_='], [/onchange=/gi, '_onchange_='], [/onclick=/gi, '_onclick_='], [/onmouseover=/gi, '_onmouseover_='], [/onmouseout=/gi, '_onmouseout_=']
  ].forEach(x => (content = content.replace(x[0], x[1])))
  return content
}

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
 * @param {string[]} permissionsRequises liste des permissions requises par la route
 * @param {string?} routeRedirection la page où rediriger en cas de permissions non satisfaites
 * @returns {function} la fonction chargée par le composant Vue
 */
const checkPermissions = (permissionsRequises, routeRedirection = 'Profil') =>
  function ({ loading, data }) {
    if (!loading && !permissionsRequises.every(x => data.moi.permissions.includes(x)))
      this.$router.replace({ name: routeRedirection })
  }

/**
 * Copier une string vers le presse-papier.
 * Fait apparaître une textearea invisible, injecte le contenu dedans,
 * le copie et supprime la textarea.
 *
 * @param {string} content le texte à sauvegager dans le presse-papier
 * @returns {void}
 */
const copierVersPressePapier = content => {
  let el = document.createElement('textarea')
  el.value = content
  el.setAttribute('readonly', '')
  el.style = { position: 'absolute', left: '-9999px' }
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
}

/**
 * Copier le contenu d'un élément du DOM vers le presse-papier.
 *
 * @param {Element} ele l'élément du DOM à copier
 * @returns {void}
 */
const copierDOMVersPressePapier = ele => {
  if (!ele) return
  let range = document.createRange()
  range.selectNode(ele)
  window.getSelection().removeAllRanges()
  window.getSelection().addRange(range)
  document.execCommand('copy')
  window.getSelection().removeAllRanges()
}

export {
  delay,
  isEmail,
  escapeHtml,
  setErreurInput,
  checkPermissions,
  copierVersPressePapier,
  copierDOMVersPressePapier
}
