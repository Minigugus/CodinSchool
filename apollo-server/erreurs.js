import CodinSchoolError, { ErreurInattendueError } from './composants/erreur'
import { log_erreur } from './composants/log'

export default erreur => {
	// TODO : Améliorer la structure des erreurs pour mieux gérer les erreurs internes et externes.

	// if (!(erreur instanceof CodinSchoolError))
	// {
	// 	log_erreur('Erreur non gérée', erreur);
	// 	erreur = new ErreurInattendueError('ERREUR_NON_GEREE');
	// }
	return erreur;
};