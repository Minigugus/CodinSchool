/********** UTILITIES / CONFIG **********/

//Api url
let apiBaseUrl = "/api/"

//Section pages
const pages = {
    listExercices: $("#listExercices"),
    doExercice: $("#doExercice")
}

//DataTables settings
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
    },
    columnDefs: [{
        className: "text-center",
        targets: [0, 3, 4, 5, 6]
    }],
    dom: "<'row'<'col-md-6'l><'col-md-6'f>>" +
        "<'row'<'col-md-12'tr>>" +
        "<'row'<'col-md-12 text-center pb-2'i><'col-md-12'p>>",
    aLengthMenu: [
        [10, 25, 50, 75, -1],
        [10, 25, 50, 75, "Tous"]
    ],
    iDisplayLength: 25,
    responsive: true
}

//The main exercice table
const dataTable = $('#exercices').DataTable(dataTableSettings)

//Animate.css JQuery extension
$.fn.extend({
    animateCss: function(animationName, callback) {
        var animationEnd = (function(el) {
            var animations = {
                animation: 'animationend',
                OAnimation: 'oAnimationEnd',
                MozAnimation: 'mozAnimationEnd',
                WebkitAnimation: 'webkitAnimationEnd',
            };

            for (var t in animations) {
                if (el.style[t] !== undefined) {
                    return animations[t];
                }
            }
        })(document.createElement('div'));

        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);

            if (typeof callback === 'function') callback();
        });

        return this;
    },
});


let log = (...el) => el.forEach(x => console.log(x))


//Assign the id properties as array key
const toObj = (array) => {
    let obj = {}
    array.forEach(x => obj[x.id] = x)
    return obj
}


//Convert html to unicode (ex : < = &#60;)
const stripHtml = str => str.replace(/[\u00A0-\u9999<>\&]/gim, i => '&#' + i.charCodeAt(0) + ';')

//SessionStorage2obj
const getSessionStorageObj = key => JSON.parse(sessionStorage.getItem(key))
const setSessionStorageObj = (key, obj) => sessionStorage.setItem(key, JSON.stringify(obj))
const delSessionStorageObj = key => sessionStorage.removeItem(key)
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


//Show a notification. Don't need to redirect. set url to redirect
const showNotification = (msg, type, url) => {
    setSessionStorageObj("notification", {
        message: msg,
        messageType: type
    })
    if (url)
        location.href = url
    else
        loadNotification()
}

//Show a notification from sessionStorage
const loadNotification = () => {
    let notification = getSessionStorageObj("notification")
    if (!notification)
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
        if (type === notification.messageType) {
            setNotification = true
            break;
        }
    }
    if (setNotification) {
        notification = `<div class="alert alert-${stripHtml(notification.messageType)} show animated" role="alert">
        <strong>${stripHtml(colors[notification.messageType])}</strong> ${stripHtml(notification.message)}
        <button type="button" class="close" aria-label="Close">
        <span aria-hidden="true">&times;</span>
        </button></div>`

        //Show the notification animation and set its close animation
        const notifEle = $("#notificationLocation")
        notifEle.html(notification)

        //Show animation
        notifEle.css("display", "block")
        notifEle.animateCss("lightSpeedIn", () => delSessionStorageObj('notification'))

        //Close animation
        notifEle.children("div").children("button").click(event => {
            notifEle.animateCss("fadeOutUp", () => notifEle.css("display", "none"))
        })
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
const fetchToSessionStorage = () => {
    const currentTime = Math.trunc(Date.now() / 1000)
    if (!getSessionStorageObj("exercices") ||
        !getSessionStorageObj("login") ||
        !getSessionStorageObj("skills") ||
        !getSessionStorageObj("languages") ||
        !getSessionStorageObj("lastFetch") ||
        (getSessionStorageObj("lastFetch") && getSessionStorageObj("lastFetch").time < currentTime - 600)
    ) {
        //Clear everything (not notification)
        delSessionStorageObj("exercices")
        delSessionStorageObj("exercices_parsed")
        delSessionStorageObj("login")
        delSessionStorageObj("skills")
        delSessionStorageObj("languages")
        delSessionStorageObj("lastFetch")
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
                setUsername()
                parseExercices(res[0].data, res[2].data, res[3].data)
                    .then(() => setExercices())
            })
    } else {
        return false
    }
}


//Append the hash to the url
const setHash = urlHash => location.hash = urlHash

const setUsername = () => {
    const user = getSessionStorageObj("login")
    if (user)
        $("[role=username]").html(stripHtml(user.name) || "")
}

//Parse the exercices and cache them in sessionStorage
const parseExercices = (exercices, skills, languages) => {
    if (!exercices || !skills || !languages)
        return
    return new Promise((resolve, reject) => {
        //Affect the id to be the object key
        languages = toObj(languages)
        skills = toObj(skills)
        const skill_template = `<button type="button" class="btn btn-secondary btn-sm mr-1"
        data-toggle="tooltip" data-placement="top" data-html="true" data-title="{{skill}}">
        <i class="fas fa-trophy fa-xs"></i>
        </button>`

        let str_skills_unlocked
        let template_modif
        for (let anExercice of exercices) {
            //Strip bad chars
            anExercice.name = stripHtml(anExercice.name)
            anExercice.description = stripHtml(anExercice.description)
            //Set the language
            if (languages[anExercice.language])
                anExercice.language = stripHtml(languages[anExercice.language].name || "")

            //Set the skills
            str_skills_unlocked = ""
            for (let aSkillId of anExercice.skills_unlocked) {
                template_modif = skill_template
                if (skills[aSkillId]) {
                    if (skills[aSkillId].level == 1) { //Skill unlocked
                        template_modif = template_modif.replace("{{skill}}", `<i class='fas fa-trophy fa-xs'></i> ${stripHtml(skills[aSkillId].name)} <i class='fas fa-check'></i>`)
                        template_modif = template_modif.replace("secondary", "success")
                    } else { //Skill not unlocked
                        template_modif = template_modif.replace("{{skill}}", stripHtml(skills[aSkillId].name))
                    }
                    str_skills_unlocked += template_modif
                } else
                    str_skills_unlocked += ""
            }
            anExercice.skills_unlocked = str_skills_unlocked
        }
        //Save parsed data
        setSessionStorageObj("exercices_parsed", exercices)
        resolve()
    })
}

//Set exercices to the table
const setExercices = () => {
    const exercices = getSessionStorageObj("exercices_parsed")
    if (!exercices)
        return
    dataTable.clear().draw()
    let count = 0
    for (let ex of exercices) {
        let newRow = [
            ++count,
            ex.name,
            ex.description,
            ex.score,
            ex.skills_unlocked,
            ex.language,
            `<button type="button" rel="${stripHtml(ex.id)}" class="btn btn-secondary btn-sm" data-toggle="startExercice" alt="Commencer">Commencer</button>`
        ]
        let row = dataTable.row.add(newRow).draw(false)
        //If the exercice is done, highlight it
        if (ex.score === 1)
            row.nodes().to$().addClass('table-success')
    }

    dataTable.columns.adjust().draw()
    $('[data-toggle="tooltip"]').tooltip()
    $('[data-toggle="startExercice"]').click(function() {
        startExercice($(this).attr('rel'))
    })
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
                        showNotification("Connexion réussie. Bienvenue sur CodinSchool !", "success", "/")
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
                        showNotification("Votre compte a été créé.", "success", "/admin/register")
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
    })
    request.fail((jqXHR, textStatus) => {
        log("Failed to disconnect : ", jqXHR.status)
        jqXHR.responseJSON
    })
    request.always(() => {
        clearSessionStorage()
        showNotification("Vous avez été déconnecté.", "success", "/login")
    })
}

//Clean sessionStorage and reload data without reloading the page
const refreshData = (msg, msgType) => {
    dataTable.clear().draw()
    delSessionStorageObj("exercices")
    delSessionStorageObj("exercices_parsed")
    delSessionStorageObj("login")
    delSessionStorageObj("skills")
    delSessionStorageObj("languages")
    delSessionStorageObj("lastFetch")
    fetchToSessionStorage()
    if (msg && msgType)
        showNotification(msg, msgType)
    else
        showNotification("La liste des exercices a été rechargée.", "success")
}


//Change the page to the "eleSection" section with an animation
const switchPage = (eleSection) => {
    const animation = {
        enter: "fadeInUp",
        exit: "fadeOutLeft"
    }
    const pages = $('section')
    pages.animateCss(animation.exit, () => {
        pages.css("display", "none")
        pages.removeClass(animation.exit)

        eleSection.css("display", "block")
        eleSection.animateCss(animation.enter)
    })
}

//Triggered to start an exercice
const startExercice = exercice_id => {
    if (!exercice_id || exercice_id === "")
        return

    setTimeout(() => {
        let exercices = toObj(getSessionStorageObj("exercices_parsed"))

        if (!exercices) {
            log("2")
            refreshData("Il y a eu une erreur inconnue. Les exercices ont été rechargés.", "warning")
            return
        }
        if (!exercices[exercice_id]) {
            log("3")
            showNotification("L'exercice demandé n'existe pas.", "info")
            return
        }

        setHash(exercice_id)
        const startedExercice = exercices[exercice_id]

        //Change the visible section to the start exercice page
        switchPage(pages.doExercice)

        //Set the exercice data
        $("#exerciceName").html(startedExercice.name)
        $("#exerciceLanguage").html(startedExercice.language)
        $("#exerciceDescription").html(startedExercice.description)
        $("#exerciceSkill").html(startedExercice.skills_unlocked)

        //Activate skills tooltip
        $('[data-toggle="tooltip"]').tooltip()
    }, 200)
}

//Load an exercice from the url
const loadExercice = () => startExercice(location.hash.slice(1))