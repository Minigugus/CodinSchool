/*
Données modifiables :
  - nomUtilisateur: Pseudo de l'utilisateur
  - lienActivation: Lien d'activation de mot de passe
*/

export default (nomUtilisateur, lienActivation) => `
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
  <h2>Activation de votre Compte</h2>
  <p>
    Bonjour ${nomUtilisateur}. Vous venez de vous créer un compte sur CodinSchool.
  </p>
  <p>
    Naviguer vers le lien suivant activer votre compte.
  </p>
  <p>
    <a href="${lienActivation}" target="_blank" rel="noopener noreferrer">${lienActivation}</a>
  </p>

  <p>Merci et à bientôt sur notre plateforme.</p>
  <p><strong>CodinSchool.</strong></p>
</body>
</html>
`
