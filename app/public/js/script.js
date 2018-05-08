let log = (el) => {
	console.log(el)
}

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