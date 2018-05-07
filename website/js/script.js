//Get exercices and append them to table 
function getExercices(dataTable) {
	var request = $.ajax({
		//url: "/exercices",
		url: "php_test_api/exercices.php",
		method: "GET",
		dataType: "json",
	});
	request.done(function(response) {
		console.log("Success fetching exercices.");
		dataTable.clear().draw(); //Emptying the table (loading message)
		setExercices(dataTable, response);
	});
	request.fail(function(jqXHR, textStatus) {
		console.log("Fail fetching exercices : " + jqXHR.status);
	});
}

//Set exercices to the table
function setExercices(dataTable, exercices) {
	var tr, id, name, description, score, skills_unlocked, language;
	var rowsToAdd = [];

	for (var work in exercices) {
		id = parseInt(work) + 1;
		name = exercices[work].name;
		description = exercices[work].description;
		score = exercices[work].score;
		skills_unlocked = exercices[work].skills_unlocked;
		language = exercices[work].language;

		rowsToAdd[work] = [id, name, description, score, "skills_unlocked", language];
	}
	dataTable.rows.add(rowsToAdd).draw(false);
}