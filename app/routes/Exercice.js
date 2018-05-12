'use strict';

const express = require('express');

const db = require('../db');
const api = require('../api.js');

const USER = express.Router(), ADMIN = express.Router();

USER.get('/', api.check, (req, res) =>
	db.queryAll('SELECT E.exe_id, E.exe_name, E.exe_description, ES.exe_test_passed, E.exe_nb_tests, SU.exe_skills, E.exe_language FROM exercice_description E, exercice_score ES, (SELECT exe_id, ARRAY_AGG(ski_id) AS exe_skills FROM exercice_skill_unlockable GROUP BY exe_id) SU WHERE E.exe_id=SU.exe_id AND E.exe_id=ES.exe_id AND ES.acc_id=$1;', [ req.session.account_id ])
		.then(rows => rows.map(x => (
			{
				id: x.exe_id,
				name: x.exe_name,
				description: x.exe_description,
				score: Number((x.exe_test_passed / x.exe_nb_tests).toFixed(2)),
				nb_tests: parseInt(x.exe_test_passed, 10),
				nb_tests_passed: parseInt(x.exe_test_passed, 10),
				skills_unlocked: x.exe_skills,
				language: x.exe_language
			})))
		.then(exercices => api.reply(res, 0, exercices))
		.catch(err => api.error(res, 'Get Exercices failed', err))
);
USER.get('/:id', api.check, api.validate('params', 'id'), (req, res) =>
	db.queryFirst('SELECT E.exe_id, E.exe_name, E.exe_description, ES.exe_test_passed, E.exe_nb_tests, SU.exe_skills, E.exe_language, E.exe_default_code, (SELECT sco_code FROM exercice_best_eval WHERE exe_id=E.exe_id AND acc_id=ES.acc_id) AS sco_code FROM exercice_description E, exercice_score ES, (SELECT exe_id, ARRAY_AGG(ski_id) AS exe_skills FROM exercice_skill_unlockable GROUP BY exe_id) SU WHERE E.exe_id=SU.exe_id AND E.exe_id=ES.exe_id AND E.exe_id = $2 AND ES.acc_id = $1;', [ req.session.account_id, req.params.id ])
		.then(e => (!e ? e : db.queryAll('SELECT * FROM exercice_test WHERE tes_exemple AND exe_id = $1;', [ e.exe_id ])
			.then(rows => rows.map(x => ({ input: x.tes_input, output: x.tes_output, description: x.tes_description })))
			.then(exemples => (
				{
					id: e.exe_id,
					name: e.exe_name,
					description: e.exe_description,
					score: Number((e.exe_test_passed / e.exe_nb_tests).toFixed(2)),
					nb_tests: parseInt(e.exe_test_passed, 10),
					nb_tests_passed: parseInt(e.exe_test_passed, 10),
					skills_unlocked: e.exe_skills,
					language: e.exe_language,
					best_code: e.sco_code || e.exe_default_code,
					exemples: exemples
				}))))
		.then(exercice => exercice ? api.reply(res, 0, exercice) : api.reply(res, 20, { id: req.params.id }))
		.catch(err => api.error(res, `Get Exercice '${req.params.id}' failed`, err))
);
// router.post('/:id', (req, res) => { });

module.exports = {
	user: USER,
	admin: ADMIN
};