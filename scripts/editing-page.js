const deviceWidth = $(window).width();
const fontSize = 6;
const numberChangeToSave = 6;
const userID = getUrlVars()['userID'];
const title = decodeURI(replaceAll(getUrlVars()['song_name'], "+", " "));
const artist = decodeURI(replaceAll(getUrlVars()['artist'], "+", " "));

var totalChanged = 0;//Only save the changes when this number greater than 6
var url = `https://sa0biepvrj.execute-api.us-east-1.amazonaws.com/api/load-project/${userID}/${title}/${artist}`;
var changesList = [];
var languageCode = navigator.language.substr(0, 2);
var lines = "";
mdc.select.MDCSelect.attachTo(document.querySelector('.mdc-select'));


$('#project-title').html(content[languageCode]['translationProject'] + " " + title);
$("#loading-progressbar").hide();
$("#saving-status").html("--Saved");
$('#artist-name').html(artist);
$(document).on("mousedown touchstart", '#progressbar-for-player',function () {
    player.stop();
});
$(document).on('change','#progressbar-for-player',function () {
    var sliderValue = $(this).val();
    var newTime = (sliderValue / 100) * player.getPlayer().duration;
    player.setTime(newTime);
    lyricsDisplay.setTime(newTime);
    player.play();
    console.log($(this).val())
});
$(document).on('click', '#editBtn', function () {
    editor.addTimeToLine();
});
$(document).on('change','#file',function (e) {
    musicName = $(this).val();
    var music = URL.createObjectURL(this.files[0]);
    var type = musicName.slice(musicName.length - 3, musicName.length);
    console.log(type);
    if (allowType.includes(type)) {
        player.startPlaying();
        player.getPlayer().src = music;
    } else {
        alert("Not supports");
    }
});
$(document).on('click','#play-btn',function () {
    if (player.currentStatus === "playing") {
        player.stop();
    } else {
        player.play();
    }
});
$("select").on('change',function () {
    let str = "";
    $('#lyricsDisplay').empty();
    $("select option:selected").each(function () {
        str += $(this).val();
    });
    if(str === "words"){
        if (deviceWidth > 600) {
            createHTMLCardXL(lines);
        } else {
            createHTMLCardSm(lines)
        }
    }else{
        createHTMLWithNomalText(lines);
    }
});
//Auto saved function
$(document).on('change','input',function () {
    var inputId = $(this).attr('id');
    var newValue = $(this).val();
    changesList.push({id: inputId, value: newValue});
    totalChanged += 1;
    if (totalChanged > numberChangeToSave) {
        autoSaved(userID, title, artist, changesList);
    } else {
        $("#saving-status").html("--Not save");
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
    var returnStr = ""
    for (c in originString) {
        var char = originString[c]
        if (originString[c] == replaceFrom) {
            char = replaceTo
        }
        returnStr += char
    }
    return returnStr
}
//Fill the text for origin text box
//Click on the origin text and highlight the translation
function highlightTranslate(i, j) {
    $(`#translate-${i}-${j}`).animate({
        backgroundColor: "#ffeb3b",
        color: "black"
    }, 500)
    $(`#origin-${i}-${j}`).animate({
        backgroundColor: "#ffeb3b",
        color: "black"
    }, 500)
}

function deselect(i, j) {
    $(`#translate-${i}-${j}`).animate({
        backgroundColor: "white",
        color: "black"
    }, 500)

    $(`#origin-${i}-${j}`).animate({
        backgroundColor: "white",
        color: "black"

    }, 500)
}

function highlightOrigin(i, j) {
    $(`#origin-${i}-${j}`).animate({
        backgroundColor: "#ffeb3b",
        color: "black",
    }, 500)
    $(`#translate-${i}-${j}`).animate({
        backgroundColor: "#ffeb3b",
        color: "black",
    }, 500)
}

function isSelect(target, current) {
    if (target == current) {
        return "selected"
    } else {
        return ""
    }
}

function autoSaved(userID, songName, artist, changes) {
    $("#loading-progressbar").show();
    $("#saving-status").html("--保存中");
    //We need to use utf-8 to trans the data to the server
    var json = encodeURI(JSON.stringify(changes), "utf-8");
    $.getJSON(`https://api.mytranshelper.com/api/auto_save/${userID}/${songName}/${artist}/${json}`).done(function (json) {
        totalChanged = 0;
        changesList = [];
        var d = new Date();
        var time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        $("#loading-progressbar").fadeOut(1000);
        $("#saving-status").html(`--保存于${time}`);
    });
}

function createHTMLCardXL(lines) {

    $('#lyricsDisplay').html(`
								<div class="row">
									<div class="col">
									  <div class="card-wide mdl-card mdl-shadow--2dp">
										<div class="mdl-card__title">
										  <h2 class="mdl-card__title-text lang" id="translation-text">${content[languageCode]['translation-text']}</h2>
										</div>
										<div class="mdl-card__supporting-text">
										  <form id="translate-text">
										  </form>
										</div>
									  </div>
									</div>
									<div class="col">
									  <div class="card-wide mdl-card mdl-shadow--2dp">
										<div class="mdl-card__title"
																style="background-color:#039be5;">
										  <h2 class="mdl-card__title-text lang" id="original-text">${content[languageCode]['original-text']}</h2>
										</div>
										<div class="mdl-card__supporting-text">
										  <form id="origin-text">
										  </form>
										</div>
									  </div>
									</div>
								</div>
								`)
    var lineHtml = "";
    var translateHtml = "";
    for (i in lines) {
        var line = lines[i];
        for (j in line['splited-version']) {
            var word = line['splited-version'][j]
            var wordsLength = word['origin'].length
            var boxLength = (wordsLength + 6) * fontSize
            var translate = ""
            if (word['origin'] == "") {
                continue
            }
            if (word['translated-text'] != null) {
                translate = word['translated-text']
            }
            lineHtml += `
                            <div style="margin:0px">
                                <select id="selector-${i}-${j}" class="hint-number form-control " style="margin:0px;width:100%">
                                        <option ${isSelect(word['length'], 1)}>1</option>
                                        <option ${isSelect(word['length'], 2)}>2</option>
                                        <option ${isSelect(word['length'], 3)}>3</option>
                                        <option ${isSelect(word['length'], 4)}>4</option>
                                        <option ${isSelect(word['length'], 5)}>5</option>
                                        <option ${isSelect(word['length'], 6)}>6</option>
                                        <option ${isSelect(word['length'], 7)}>7</option>
                                        <option ${isSelect(word['length'], 8)}>8</option>
                                        <option ${isSelect(word['length'], 9)}>9</option>
                                        <option ${isSelect(word['length'], 10)}>10</option>
                                </select>
                                <input class="form-control lyrics" id="origin-${i}-${j}" onblur="deselect(${i},${j})" onclick="highlightTranslate(${i},${j})" style="width:${boxLength}px" id="exampleInputEmail1" value="${word['origin']}" title="">
                            </div>
                            `
            translateHtml += `
                            <div style="margin:0px">
                            <select id="selector-${i}-${j}" class="hint-number2 form-control" style="margin:0px">
                                    <option ${isSelect(word['length'], 1)}>1</option>
                                    <option ${isSelect(word['length'], 2)}>2</option>
                                    <option ${isSelect(word['length'], 3)}>3</option>
                                    <option ${isSelect(word['length'], 4)}>4</option>
                                    <option ${isSelect(word['length'], 5)}>5</option>
                                    <option ${isSelect(word['length'], 6)}>6</option>
                                    <option ${isSelect(word['length'], 7)}>7</option>
                                    <option ${isSelect(word['length'], 8)}>8</option>
                                    <option ${isSelect(word['length'], 9)}>9</option>
                                    <option ${isSelect(word['length'], 10)}>10</option>
                            </select>
                                <input class="form-control lyrics" id="translate-${i}-${j}" maxlength="${word['length']}"  onblur="deselect(${i},${j})" onclick="highlightOrigin(${i},${j})" oninput="this.style.width = ((this.value.length + 1) * 20) + 'px';" style="width:${boxLength}px;" id="exampleInputEmail1" value="${translate}">
                            </div>
                            `
            //$(`#selector-${i}-${j} option[value=${word['length']}]`).attr('selected',true)

        }
        $('#origin-text').append(`
                        <div class="row" style="margin-top:20px">
                                ${lineHtml}
                                <div class="custom-control custom-checkbox">
                                        <input type="checkbox" class="custom-control-input" id="customCheck${i}">
                                        <label class="custom-control-label" for="customCheck${i}">押韵</label>
                                </div>
                        
                        </div>
                        `)
        $('#translate-text').append(`
                        <div class="row" style="margin-top:20px">
                                ${translateHtml}
                            </div>
                        `)
        lineHtml = ""
        translateHtml = ""
    }
}

function createHTMLCardSm(lines) {
    var lineHtml = "";
    var translateHtml = "";
    for (let i in lines) {
        var line = lines[i];
        for (j in line['splited-version']) {
            var word = line['splited-version'][j];
            var wordsLength = word['origin'].length;
            var boxLength = (wordsLength + 6) * fontSize;
            var translate = "";
            if (word['origin'] == "") {
                continue;
            }
            if (word['translated-text'] != null) {
                translate = word['translated-text']
            }
            lineHtml += `
							<div class="col" style="margin-top:10px;margin-left:3px;">
								 <div>
								  <div class="input-group-prepend">
									<span class="input-group-text word-length" style="width:${boxLength}px;" id="inputGroup-sizing-default">${word["length"]}</span>
								  </div>
									<input class="form-control lyrics" id="origin-${i}-${j}" onblur="deselect(${i},${j})" onclick="highlightTranslate(${i},${j})" style="width:${boxLength}px" aria-describedby="inputGroup-sizing-default"
									value="${word['origin']}" title="" >
								</div>
									 <input class="form-control lyrics" id="translate-${i}-${j}" maxlength="${word['length']}"  onblur="deselect(${i},${j})" onclick="highlightOrigin(${i},${j})" oninput="this.style.width = ((this.value.length + 1) * 20) + 'px';" style="width:${boxLength}px;margin-top:0px" value="${translate}">
                            </div>`
        }
        $('#lyricsDisplay').append(`

								<div style="margin-top:10px;">
									  <div class="card-wide mdl-card mdl-shadow--4dp" id="row-${i}">

										<div class="mdl-card__supporting-text">
										  <div class="row"> ${lineHtml} </div>
										</div>
	  									</div>
									</div>


						`)
        lineHtml = ""
    }
}

function createHTMLWithNomalText(lines) {
    var lineHtml = "";
    var translateHtml = "";
    for (let i in lines) {
        var line = lines[i];
        var originText = "";
        var translationText = "";
        for (j in line['splited-version']) {
            var word = line['splited-version'][j];
            var wordsLength = word['origin'].length;
            var boxLength = (wordsLength + 6) * fontSize;
            var translate = "";
            if (word['origin'] == "") {
                continue;
            }
            if (word['translated-text'] != null) {
                translate = word['translated-text']
            }
            originText += " " + word['origin'];
            if (word['translated-text'] != null) {
                translationText += " " + word['translated-text'];
            }
        }

        lineHtml = `
         <div">
            <div class="mdc-text-field  text-field mdc-text-field--outlined mdc-text-field--upgraded" data-mdc-auto-init="MDCTextField" style="width: 100%;">
            <input type="text" id="text-field--outlined" class="mdc-text-field__input" value="${translationText}"
            style="font-size: 10px;margin-bottom: 10px">
            <label class="mdc-floating-label" for="text-field--outlined">${originText}</label>
                <div class="mdc-notched-outline">
                    <svg>
                        <path class="mdc-notched-outline__path"></path>
                    </svg>
                </div>
                <div class="mdc-notched-outline__idle"></div>
            </div>
        </div>
        `;
        $('#lyricsDisplay').append(lineHtml);
        //console.log(lineHtml);
        originText = "";
        translationText = "";
    }

}



