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

//Convert html to unicode (ex : < = &#60;)
const stripHtml = str => str.replace(/[\u00A0-\u9999<>\&]/gim, i => '&#' + i.charCodeAt(0) + ';')

//SessionStorage2obj
const getSessionStorageObj = key => JSON.parse(sessionStorage.getItem(key))
const setSessionStorageObj = (key, obj) => sessionStorage.setItem(key, JSON.stringify(obj))
const clearSessionStorage = () => sessionStorage.clear()


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

//Redirect the user to a page with notification in url
const redirectWithMsg = (url, msg, type) => window.location.href = url + "?msg=" + encodeURI(msg) + "&msgType=" + encodeURI(type)

//Show a notification from url (bootstrap alert), non xss vulnerable
const loadUrlMsgNotification = () => {
    const params = getUrlParameters()
    if (!params || !params.msg || !params.msgType)
        return

    let setNotification = false
    //Notification start message
    const colors = {
        "primary": "",
        "secondary": "",
        "success": "Succès !",
        "danger": "Erreur !",
        "warning": "Attention !",
        "info": "Information !",
        "light": "",
        "dark": ""
    }
    for (let type in colors) {
        if (type === params.msgType) {
            setNotification = true
            break;
        }
    }
    if (setNotification) {
        notification = `<div class="alert alert-${stripHtml(params.msgType)} alert-dismissible fade show" role="alert">
        <strong>${stripHtml(colors[params.msgType])}</strong> ${stripHtml(params.msg)}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
        </button></div>`
        $("#notification").html(notification)
        $("#notification").fadeIn()
    }
}

//Get a object containing the parameters or undefined if empty
const getUrlParameters = () => {
    let parts = window.location.search.substr(1).split("&"),
        data = {}
    for (let i = 0, c = parts.length; i < c; i++) {
        let temp = parts[i].split("=")
        data[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1])
    }
    //If there is nothing in url params, return undefined
    if (Object.keys(data).length === 1 && data[""] == "undefined")
        return
    return data
}

//Return if the current window is in an iframe
const isInIframe = () => (!window.frameElement) ? false : true

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

//If isn't set yet, set all needed data to sessionStorage
//if we never fetched or yes but more than 10 minutes ago, fetch all
//redirUrl : set = url to redirect to, undefined don't redirect
const fetchToSessionStorage = redirUrl => {
    const currentTime = Math.trunc(Date.now() / 1000)
    if (!getSessionStorageObj("exercices") ||
        !getSessionStorageObj("login") ||
        !getSessionStorageObj("skills") ||
        !getSessionStorageObj("languages") ||
        !getSessionStorageObj("lastFetch") ||
        (getSessionStorageObj("lastFetch") && getSessionStorageObj("lastFetch").time < currentTime - 600)
    ) {
        clearSessionStorage()
        Promise.all([
                getPromiseAPI("exercices"),
                getPromiseAPI("login"),
                getPromiseAPI("skills"),
                getPromiseAPI("languages")
            ])
            .catch(e => e)
            .then(res => {
                setSessionStorageObj("exercices", res[0].data)
                setSessionStorageObj("login", res[1].data)
                setSessionStorageObj("skills", res[2].data)
                setSessionStorageObj("languages", res[3].data)
                setSessionStorageObj("lastFetch", {
                    time: currentTime
                })

                //Reload page (after 100ms to be sure sessionStorage is set)
                if (redirUrl)
                    setTimeout(() => location.href = redirUrl, 100)
            })
    } else {
        return false
    }
}

//how to check if session valid ?
const checkLoggedIn = () => {
    getPromiseAPI("login")
        .catch(e => e)
        .then(res => {
            switch (res.code) {
                case "0":
                    //User is logged in
                    break;
                case "10":
                    redirectWithMsg("login.html", "Vous n'êtes pas connecté.", "danger")
                    break;
                default:
                    redirectWithMsg("login.html", "Erreur serveur inconnue.", "danger")
                    break;
            }
        })
}


//Set exercices to the table
const setExercices = dataTable => {
    let exercices = getSessionStorageObj("exercices")
    let skills = getSessionStorageObj("skills")
    let languages = getSessionStorageObj("languages")

    if (!exercices || !skills || !languages)
        return //redirect?doSomething

    dataTable.clear().draw()

    //Affect the id to be the object key
    languages = toObj(languages)
    skills = toObj(skills)


    let str_skills_unlocked = ""
    for (let anExercice of exercices) {
        //Set the language
        anExercice.language = languages[anExercice.language].name || ""

        //Set the skills
        for (let aSkillId of anExercice.skills_unlocked)
            str_skills_unlocked += (skills[aSkillId]) ? skills[aSkillId] + ", " : ""

        if (str_skills_unlocked !== "") //Delete the last comma
            str_skills_unlocked = str_skills_unlocked.slice(0, -2)
        anExercice.skills_unlocked = str_skills_unlocked
        str_skills_unlocked = ""
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

//Send login request
const reqLogin = (username, password) => getPromiseAPI("login", "POST", {
    username,
    password
})

//Send register request
const reqRegister = (username, password, name) => getPromiseAPI("register", "POST", {
    username,
    password,
    name
})

//Check login form 
const checkLoginForm = event => {
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

        reqLogin(formData.username.val(), formData.password.val())
            .catch(e => e)
            .then(result => {
                buttonLoading(submitButton, "Connexion")
                switch (result.code) {
                    case "0":
                        log("Ok logging in")
                        window.location.href = "landing.html"
                        break;
                    case "11":
                        log("Fail logging in", result)
                        setInputRed(formData.username)
                        setInputRed(formData.password)
                        setFormError("Nom d'utilisateur ou mot de passe incorrect.")
                        break;
                    default:
                        setFormError("Erreur serveur inconnue.")
                        break;
                }
            })
    }
}


//Check register form
const checkRegisterForm = (event) => {
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
        reqRegister(formData.username.val(), formData.password1.val(), name)
            .catch(e => e)
            .then(result => {
                buttonLoading(submitButton, "Inscription")
                switch (result.code) {
                    case "0":
                        log("Ok registering")
                        redirectWithMsg("login.html", "Votre compte a été créé.", "success")
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
        clearSessionStorage()
        redirectWithMsg("login.html", "Vous avez été déconnecté.", "success")
    })
    request.fail((jqXHR, textStatus) => {
        log("Failed to disconnect : ", jqXHR.status)
        jqXHR.responseJSON
        //doSomething
    })
}