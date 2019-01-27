/**
 * Template de mail d'activation de compte.
 *
 * @param {string} nomUtilisateur `Prénom nom` de l'utilisateur
 * @param {string} lienReset lien de réinitialisation de mot de passe
 *
 * @returns {string} le template modifié
 */
export default (nomUtilisateur, lienReset) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Codinschool</title>
</head>
<body>
  <h1>CodinSchool</h1>
  <h2>Réinitialisation du mot de passe</h2>
  <p>
    Bonjour ${nomUtilisateur}. Vous avez demandé la réinitialisation votre mot de passe de compte CodinSchool.
  </p>
  <p>
    Naviguer vers le lien suivant afin de réinitialiser le mot de passe de votre compte.
  </p>
  <p>
    <a href="${lienReset}" target="_blank" rel="noopener noreferrer">${lienReset}</a>
  </p>

  <p>Merci et à bientôt sur notre plateforme.</p>
  <p><strong>CodinSchool.</strong></p>
</body>
</html>
`
