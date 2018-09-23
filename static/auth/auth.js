let username;
let uid;

window.addEventListener('load', function () {
    let authdata = localStorage.getItem("auth");
    authdata = JSON.parse(authdata);

    username = decodeURI(replaceAll(getUrlVars()['user_name'], "+", " "));
    uid = decodeURI(replaceAll(getUrlVars()['user_id'], "+", " "));

    if (authdata === null && username === "") {
        //not login
        $("#login-btn").show();
        $("#logout-btn").hide();
    } else if (authdata !== null) {
        //already login
        username = authdata.user_name;
        uid = authdata.user_id;
        showMusicList(uid);
        $("#welcomeTextDrawer").append(authdata.user_name);
        $("#login-btn").hide();
        $("#logout-btn").show();
    } else if (username !== "") {
        showMusicList(uid);
        $("#welcomeTextDrawer").append(username);
        $("#login-btn").hide();
        $("#logout-btn").show();
        let put = {
            user_id: uid,
            user_name: username
        };
        localStorage.setItem("auth", JSON.stringify(put));
    }
});

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function replaceAll(originString, replaceFrom, replaceTo) {
    var returnStr = "";
    for (c in originString) {
        var char = originString[c];
        if (originString[c] == replaceFrom) {
            char = replaceTo
        }
        returnStr += char
    }
    return returnStr
}

function logOut() {
    let url = window.location.origin;
    +window.location.pathname;
    localStorage.removeItem("auth");
    document.location.replace(url)
}

function login() {
    window.location.href = "https://auth.sirileepage.com";
}