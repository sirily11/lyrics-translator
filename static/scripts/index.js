let uploaded = false;
let db = new Dexie("transapp_db");
db.version(1).stores({
    projects: "++id,userID, artist,title"
});

function upload(lyrics, userID, title, artist) {
    console.log(lyrics);
    lyrics = lyrics.split(/\r?\n/);
    var newLyrics = "";
    for (var l = 0; l < lyrics.length; l++) {
        newLyrics += lyrics[l] + "*newline*";
    }
    let email = "someeamil";
    $.getJSON(`https://api.mytranshelper.com/api/start-project/${userID}/${username}/${email}/${title}/${artist}/${newLyrics}`).done(function () {
        $('#loading-bar-for-upload').fadeOut(1000)
    }).fail(function () {
        alert("Failed to upload")
    });
    uploaded = true
}

let dialog = document.querySelector('dialog');
if (!dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
}
$('#create-project-btn').click(function () {
    dialog.showModal();
});
//When the user click on the upload button
$('#uploadBtn').click(function () {
    //first get the song name and artist info
    var songName = $('#songName').val();
    var artist = $('#artist').val();
    var lyrics = $('#lyrics').val();
    //Then if the song name hasn't been input
    if (songName == "" || artist == "") {
        //show the error messege
        $('#info').html('<p style="color:red">先输入歌曲名和歌手名</p>')
    } else if (lyrics == "") {
        $('#info').html('<p style="color:red">请输入歌词</p>')
    } else {
        //If not, show the loading bar and upload the file
        $('#loading-bar-for-upload').html('<div class="mdl-spinner mdl-js-spinner is-active" id="loading-bar-for-uploading"></div>');
        upload(lyrics, uid, songName, artist)
    }
});
$('form').on('submit', function (event) {
    event.preventDefault()
    var songName = $('#songName').val()
    var artist = $('#artist').val()
    var lyrics = $('#lyrics').val()
    if (songName == null || artist == "" || !uploaded) {
        $('#info').html('<p style="color:red">请输入歌曲名或者歌手名或上传歌词</p>')
    } else {
        $('#userID').val(uid);
        this.submit();
        dialog.close();
    }
});

$('#close').click(function () {
    dialog.close()
});

function showMusicList(userID) {
    $.getJSON(`https://api.mytranshelper.com/api/get_all_projects_list/${userID}`).done(function (data) {
        // Store the data into the local database
        console.log("Stored the projects into the database");
        $('#musiclist-loadingbar').fadeOut(1000);
        let col = "";
        let text = "";
        if (languageCode.includes('zh')) {
            text = content['zh']['loadProject']
        } else {
            text = content['en']['loadProject']
        }
        for (var i = 0; i < data.length; i++) {
            db.projects.put({
                userID : uid,
                artist: decodeURI(data[i]['artist']).toString(),
                title: decodeURI(data[i]['title']).toString()
            });
            col += `
							<div class="col-sm">
								<div class=" project-card mdc-card">
								  <div class="mdl-card__title mdl-card--expand" style="  background: url('./assets/img/md-img${i % 3 + 1}.jpg') center / cover;">
									<h2 class="mdl-card__title-text">${decodeURI(data[i]['title'])} - ${decodeURI(data[i]['artist'])}</h2>
								  </div>
								<div class="mdl-card__actions mdl-card--border">
									<a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" href="editing-page.html?song_name=${data[i]['title']}&artist=${data[i]['artist']}&userID=${uid}">
									  	${text}
									</a>
								  </div>
								</div>
							</div>
					`;
            if ((i + 1) % 3 === 0) {
                col += "<div class=\"w-100\"></div>"
            }
        }
        row = `<div class="row"> ${col}</div>`;
        $('#listOfMusic').append(row);
        isloaded = true;
    })
}