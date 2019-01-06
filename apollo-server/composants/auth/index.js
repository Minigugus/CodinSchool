import _DirectiveAcces from './DirectiveAcces';
import { Profile, recupererParID } from '../utilisateur';
import { hasher as _hasher, comparer as _comparer } from './motdepasse';
import { JetonInvalideError, IdentifiantsNonReconnusError, EmailDejaUtiliseError } from './erreurs';
import { validerJeton, creerJeton as _creerJeton } from './jwt';
import CodinSchoolError, { ErreurInattendueError } from '../erreur';
import { recupererParEmail } from '../utilisateur/index';

export const DirectiveAcces = _DirectiveAcces;
export const creerJeton = _creerJeton;

export const hasher = _hasher;
export const comparer = _comparer;

export const authentifier = async (email, motDePasse) => {
  const utilisateur = await recupererParEmail(email);
  if (utilisateur && (await comparer(motDePasse, utilisateur.motDePasse)))
      return utilisateur;
  throw new IdentifiantsNonReconnusError(email);
};

export const inscrire = async ({ email, motDePasse, nom, prenom, dateNaissance }) => {
  try
  {
    return await Profile.create({
      emailPrimaire: email.toLowerCase(),
      motDePasse: await hasher(motDePasse),
      nom,
      prenom,
      dateNaissance
    });
  }
  catch (err)
  {
    if (
      err.name === 'SequelizeUniqueConstraintError' &&
      err.errors.length == 1 &&
      err.errors[0].type === 'unique violation' &&
      err.errors[0].path === 'emailPrimaire'
    )
      throw new EmailDejaUtiliseError(email);
    throw new ErreurInattendueError('AUTH_INSCRIRE', { err });
  }
}

export default async jeton => {
  if (!jeton) return null;
  // TODO : Ajouter une liste noire pour bloquer les jetons mal utilisés (anti-piratage).
  try
  {
    if (!/Bearer /.test(jeton))
      throw new JetonInvalideError(jeton, 'Méthode `Bearer` requise.');
    jeton = jeton.slice(7);
    const decode = await validerJeton(jeton);
    if (decode && !('id' in decode))
      throw new JetonInvalideError(jeton, '`id` non trouvé');
    const utilisateur = await recupererParID(decode.id);
    if (!utilisateur)
      throw new JetonInvalideError(jeton, `Utilisateur '${decode.id}' non trouvé`);
    return utilisateur;
  }
  catch (err)
  {
    if (err instanceof CodinSchoolError)
      throw err;
    else if (err.name === 'JsonWebTokenError')
      throw new JetonInvalideError(jeton, `Jeton de connexion invalide.`, err);

    throw new ErreurInattendueError('AUTH_VALIDER_JETON', { jeton, err });
  }
};
