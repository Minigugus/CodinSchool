/********** UTILITIES / CONFIG **********/

//Api url
let apiBaseUrl = "/api/"

//DataTables french translation
let dataTableSettings = {
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
}

let log = (...el) => {
    for (let arg of el)
        console.log(arg)
}

//Assign the id properties as array key
const toObj = (array) => {
    let obj = {}
    array.forEach(x => obj[x.id] = x)
    return obj
}


//Fetch anything (Promise)
const getPromiseAPI = (apiUrl, httpMethod) => {
    return new Promise((resolve, reject) => {
        let request = $.ajax({
            url: apiBaseUrl + apiUrl,
            method: httpMethod || "GET",
            dataType: "json"
        })
        request.done(response => {
            log("Success fetching " + apiUrl + ".")
            resolve(toObj(response))
        })
        request.fail((jqXHR, textStatus) => {
            reject(new Error("Fail fetching " + apiUrl + " : " + jqXHR.status))
        })
    })
}

//Get cookie string by name
const getCookie = sKey => {
    if (!sKey) {
        return null
    }
    let reg = new RegExp("(?:(?:^|.*;)\\s*" +
        encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") +
        "\\s*\\=\\s*([^;]*).*$)|^.*$")
    return decodeURIComponent(document.cookie.replace(reg, "$1")) || null
}

//Get cookie object if cookie is json
const getCookieObj = cname => {
    let json
    try {
        json = JSON.parse(getCookie(cname))
    } catch (e) {
        return null
    }
    return json
}

const getSessionStorageObj = key => JSON.parse(sessionStorage.getItem(key))
const setSessionStorageObj = (key, obj) => sessionStorage.setItem(key, JSON.stringify(obj))
const clearSessionStorage = () => sessionStorage.clear()

const getUrlParameters = () => {
    let parts = window.location.search.substr(1).split("&"),
        data = {}
    for (let i = 0, c = parts.length; i < c; i++) {
        let temp = parts[i].split("=")
        data[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1])
    }
    return data
}


/********** Main functions **********/

const fetchToSessionStorage = () => {
    if (!getSessionStorageObj("user") || !getSessionStorageObj("skills") || !getSessionStorageObj("languages")) {
        //Fetch asynchronously
        (async () => {
            try {
                const res = await Promise.all([
                    getPromiseAPI("user"),
                    getPromiseAPI("skills"),
                    getPromiseAPI("languages")
                ])
                //blabla
            } catch (err) {
                console.error(e)
                return false
            }
        })()
    }
}

//Fetch exercices 
const getExercices = dataTable => {
    let request = $.ajax({
        url: "/api/exercices",
        method: "GET",
        dataType: "json"
    })
    request.done(response => {
        log("Success fetching exercices. Fetching skills and languages...")
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
    dataTable.clear().draw()
    setToTable(res[0], res[1])
    //Set everything to the table
    const setToTable = (fetchedSkills, fetchedLanguages) => {
        let skillsString = ""
        for (let work of exercices) {
            for (let skill_id of work.skills_unlocked) {
                if (fetchedSkills) {
                    skillsString += (fetchedSkills[skill_id]) ? "[" + fetchedSkills[skill_id].name + "]<br>" : ""
                }
            }
            work.language = (fetchedLanguages) ? fetchedLanguages[work.language].name : ""
            work.skills_unlocked = skillsString
        }
        let count = 0
        dataTable.rows.add(
            exercices.map(x => [
                ++count,
                x.name,
                x.description,
                x.score,
                x.skills_unlocked,
                x.language
            ])
        ).draw(false)
    }
}

//Check login form
const checkLogin = () => {
    $("form").submit(() => {
        let formData = {}

        formData.email = {
            obj: $('#inputEmail4'),
            val: $('#inputEmail4').val()
        }
        formData.password = {
            obj: $('#inputPassword4'),
            val: $('#inputPassword4').val()
        }

        let count = 0
        //Check if input is empty
        for (let data in formData) {
            if (formData[data].val === '') {
                //Red input
                formData[data].obj.addClass("is-invalid")
                formData[data].obj.removeClass("is-valid")
            } else {
                //Green input
                formData[data].obj.addClass("is-valid")
                formData[data].obj.removeClass("is-invalid")
                count++
            }
        }

        if (!(count === Object.keys(formData).length)) {
            //Some fields are empty, don't send form
            //Show error message
            $("#formError").html("Tous les champs sont obligatoires.")
            $("#formError").fadeIn()
        } else {
            //Send form
            login(formData)
        }
        return false
    })
}


//login 
const login = formData => {
    let formParam = {}
    for (let data in formData)
        formParam[data] = formData[data].val

    //Loading message on login button
    $("#submitButton").html("<i class='fa fa-spinner fa-spin'></i> Connexion en cours")

    let request = $.ajax({
        url: "/api/login",
        method: "POST",
        data: formParam,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8"
    })
    request.done(response => {
        log("Success logging in.")
        window.location.href = "work.html"
    })
    request.fail((jqXHR, textStatus) => {
        log("Fail logging in : " + jqXHR.status)

        //Show red on inputs
        for (let data in formData) {
            formData[data].obj.addClass("is-invalid")
        }
        //Show error message
        $("#formError").html("Nom d'utilisateur ou mot de passe incorrect.")
        $("#formError").fadeIn()
    })
    request.always(() => {
        //Reset button message
        //Fake timeout pour test !
        setTimeout(() => {
            $("#submitButton").html("Connexion")
        }, 1000)
    })
}

//logout
const logout = () => {
    let request = $.ajax({
        url: "/api/logout",
        method: "GET"
    })
    request.done(response => {
        window.location.href = "login.html"
    })
    request.fail((jqXHR, textStatus) => {
        log("Failed to disconnect : " + jqXHR.status)
        //doSomething
    })
}



//how to check if session valid ?
const checkLoggedIn = () => {
    const isLoggedIn = () => {
        let cookie = getCookie("codingschool_session")
        if (cookie === "fake") {
            return true
        } else {
            return false
        }
    }
    if (!isLoggedIn()) {
        alert("Not logged in.\nCookies : " + document.cookie)
        throw new Error("User is not logged in !")
    }
}