'use strict';

const express = require('express');

const db = require('../db');
const api = require('../api.js');

const USER = express.Router(), ADMIN = express.Router();

USER.get('/', api.check, (req, res) =>
	db.queryAll('SELECT E.exe_id, E.exe_name, E.exe_description, ES.exe_test_passed, E.exe_nb_tests, E.exe_language AS exe_score FROM exercice_description E, exercice_score ES WHERE E.exe_id=ES.exe_id AND ES.acc_id=$1;', [ req.session.account_id ])
		.then(rows => rows.map(x => (
			{
				id: x.exe_id,
				name: x.exe_name,
				description: x.exe_description,
				score: Number((x.exe_test_passed / x.exe_nb_tests).toFixed(2)),
				language: x.exe_language
			})))
		.then(exercices => api.reply(res, 0, exercices))
		.catch(err => api.error(res, 'Get Exercices failed', err))
);
USER.get('/:id', api.check, (req, res) => {
	api.reply(res, 0, {
		id: "hello-world",
		name: "Hello World !",
		description: "Le premier programme que tout developpeur doit connaître !",
		score: 1,
		skills_unlocked: [ 153, 406 ],
		language: "java",
		nb_tests: 2,
		best_code: "class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println(\"Hello World!\"); }\n\t}\n}",
		exemples: [
			{
				input: "",
				output: "Hello World!\n",
				description: "Très compliqué..."
			}
		]
	});
});
// router.post('/:id', (req, res) => { });

module.exports = {
	user: USER,
	admin: ADMIN
};