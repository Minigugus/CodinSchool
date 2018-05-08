//DataTables french translation
var dataTableFrench = {
	language: {
		sProcessing: "Traitement en cours...",
		sSearch: "Rechercher&nbsp;:",
		sLengthMenu: "Afficher _MENU_ &eacute;l&eacute;ments",
		sInfo: "Affichage de l'&eacute;l&eacute;ment _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
		sInfoEmpty: "Affichage de l'&eacute;l&eacute;ment 0 &agrave; 0 sur 0 &eacute;l&eacute;ment",
		sInfoFiltered: "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
		sInfoPostFix: "",
		sLoadingRecords: "Chargement en cours...",
		sZeroRecords: "Aucun &eacute;l&eacute;ment &agrave; afficher",
		sEmptyTable: "Aucune donn&eacute;e disponible dans le tableau",
		oPaginate: {
			sFirst: "Premier",
			sPrevious: "Pr&eacute;c&eacute;dent",
			sNext: "Suivant",
			sLast: "Dernier"
		},
		oAria: {
			sSortAscending: ": activer pour trier la colonne par ordre croissant",
			sSortDescending: ": activer pour trier la colonne par ordre d&eacute;croissant"
		}
	}
};

let log = (el) => {
	console.log(el)
}

//Assign the id properties as array key
const toObj = (array) => {
	let obj = {}
	array.forEach(x => obj[x.id] = x)
	return obj
};

let skills

//Fetch skills
const getSkills = () => {
	return new Promise((resolve, reject) => {
		let request = $.ajax({
			url: "/api/skills",
			method: "GET",
			dataType: "json"
		})
		request.done(response => {
			log("Success fetching skills.")
			resolve(toObj(response))
		})
		request.fail((jqXHR, textStatus) => {
			//doSomething
			reject(new Error("Fail fetching skills : " + jqXHR.status))
		})
	})
}

const skillsPromise = getSkills()
	.then(resolve => {
		skills = resolve
	})
	.catch(reject => {
		log(reject.message)
	})

log(skills)

//Fetch exercices and append them to table 
const getExercices = dataTable => {
	let request = $.ajax({
		url: "/api/exercices",
		method: "GET",
		dataType: "json"
	})
	request.done(response => {
		log("Success fetching exercices.")
		dataTable.clear().draw() //Emptying the table (loading message)
		setExercices(dataTable, response)
	})
	request.fail((jqXHR, textStatus) => {
		log("Fail fetching exercices : " + jqXHR.status)
		dataTable.clear().draw()
		//doSomething
	})
}

//Set exercices to the table
const setExercices = (dataTable, exercices) => {
	let count = 0
	dataTable.rows.add(
		exercices.map(x => [
			++count,
			x.id,
			x.name,
			x.description,
			x.score,
			x.skills_unlocked,
			x.language
		])
	).draw(false)
}