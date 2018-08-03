function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function replaceAll(originString,replaceFrom,replaceTo){
    var returnStr = ""
    for(c in originString){
        var char = originString[c]
        if(originString[c] == replaceFrom){
            char = replaceTo
        }
        returnStr += char
    }
    return returnStr
}