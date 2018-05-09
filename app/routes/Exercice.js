'use strict';

const express = require('express');

const util = require('../util');

const router = express.Router();


router.get('/', util.check, (req, res) => {
	res.status(200).json([
		{
			id: "hello-world",
			name: "Hello World !",
			description: "Le premier programme que tout developpeur doit connaître !",
			score: 1,
			skills_unlocked: [ 153, 406 ],
			language: "c"
		},
		{
			id: "somme-nombres",
			name: "Somme de Nombres",
			description: "Additionner 2 nombres choisis par l'utilisateur. C'est aussi simple que ça !",
			score: 0.42,
			skills_unlocked: [ 75, 153, 241 ],
			language: "java"
		}
	]);
});
router.get('/:id', util.check, (req, res) => {
	res.status(200).json({
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

module.exports = router;