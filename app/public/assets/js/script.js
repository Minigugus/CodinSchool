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

const api_errors = {
    0: [200, undefined],
    1: [400, 'Bad request'],
    2: [404, 'Not found'],
    10: [401, 'You must be authentificated to use this operation'],
    11: [403, 'Invalid username or password'],
    12: [403, 'Wrong old password'],
    13: [403, 'Access denied'],
    14: [403, 'Username already registered'],
    255: [505, 'Internal server error']
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

//Show green around input
const setInputGreen = (...ele) => {
    for (let arg of ele) {
        arg.addClass("is-valid")
        arg.removeClass("is-invalid")
    }
}

//Show red around input
const setInputRed = (...ele) => {
    for (let arg of ele) {
        arg.addClass("is-invalid")
        arg.removeClass("is-valid")
    }
}

//Change the form error message and show it
const setFormError = msg => {
    error = $("#formError")
    error.html(msg)
    error.fadeIn()
}

//Loading message on a button (true = load/false = normal)
const buttonLoading = (ele, msg, loadBool) => (loadBool) ? ele.html("<i class='fa fa-spinner fa-spin'></i> " + msg) : ele.html(msg)


/********** Main functions **********/
//Fetch anything async (Promise)
const getPromiseAPI = (apiUrl, httpMethod, formParam) => {
    return new Promise((resolve, reject) => {
        let request = $.ajax({
            url: apiBaseUrl + apiUrl,
            method: httpMethod || "GET",
            dataType: "json",
            data: formParam || null,
        })
        request.done(response => resolve(response))
        request.fail(jqXHR => reject(jqXHR.responseJSON))
    })
}

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
        url: apiBaseUrl + "exercices",
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

//Send login request
const login = (username, password) => getPromiseAPI("login", "POST", {
    username,
    password
})

//Send register request
const register = (username, password, name) => getPromiseAPI("register", "POST", {
    username,
    password,
    name
})

//send login form 
const checkLogin = event => {
    event.preventDefault()
    const formData = {
        username: $('#inputUsername'),
        password: $('#inputPassword')
    }

    let count = 0
    let send = true

    const checkEmpty = ele => {
        if (ele.val() === '') {
            setInputRed(ele)
            send = false
        }
    }
    //Check if input is empty
    checkEmpty(formData.username)
    checkEmpty(formData.password)

    if (!send)
        setFormError("Tous les champs sont obligatoires.")

    //Everything is ok, we can send the request
    if (send) {
        const submitButton = $("#submitButton")
        buttonLoading(submitButton, "Connexion en cours", true)

        login(formData.username.val(), formData.password.val())
            .catch(e => e)
            .then(result => {
                buttonLoading(submitButton, "Connexion")
                switch (result.code) {
                    case "0":
                        log("Ok logging in")
                        window.location.href = "work.html"
                        break;
                    case "11":
                        log("Fail logging in", result)
                        setInputRed(formData.username)
                        setInputRed(formData.password)
                        setFormError("Nom d'utilisateur ou mot de pass incorrect.")
                        break;
                    default:
                        setFormError("Erreur serveur inconnue.")
                        break;
                }
            })
    }
}


//Check register form
const checkRegister = (event) => {
    event.preventDefault()
    const formData = {
        lastName: $('#inputLastName'),
        firstName: $('#inputFirstName'),
        username: $('#inputUsername'),
        password1: $('#inputPassword1'),
        password2: $('#inputPassword2')
    }

    let count = 0
    let send = true

    //Check if input is empty
    for (let data in formData) {
        if (formData[data].val() === '') {
            setInputRed(formData[data])
        } else {
            setInputGreen(formData[data])
            count++
        }
    }

    //Check if inputs are not empty
    if (!(count === Object.keys(formData).length)) {
        setFormError("Tous les champs sont obligatoires.")
        send = false
    }
    //Check if password is 8 chars min
    if (send && formData.password1.val().length < 8) {
        setInputRed(formData.password1, formData.password2)
        setFormError("Le mot de passe doit être de 8 caractères minimum.")
        send = false
    }
    //Check if the password confirmation is the same as the original one
    if (send && formData.password1.val() !== formData.password2.val()) {
        setInputRed(formData.password1, formData.password2)
        setFormError("Les mots de passe ne correspondent pas.")
        send = false
    }
    //Everything is ok, we can send the request
    if (send) {
        const submitButton = $("#submitButton")
        buttonLoading(submitButton, "Inscription en cours", true)

        const name = formData.firstName.val() + " " + formData.lastName.val()
        register(formData.username.val(), formData.password1.val(), name)
            .catch(e => e)
            .then(result => {
                buttonLoading(submitButton, "Inscription")
                switch (result.code) {
                    case "0":
                        log("Ok registering")
                        window.location.href = "work.html"
                        break;
                    case "14":
                        log("Fail registering", result)
                        setInputRed(formData.username)
                        setFormError("Ce nom d'utilisateur est déjà enregistré.")
                        break;
                    default:
                        setFormError("Erreur serveur inconnue.")
                        break;
                }
            })
    }
}



//logout
const logout = () => {
    let request = $.ajax({
        url: apiBaseUrl + "logout",
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