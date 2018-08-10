import {
	MDCTextField
} from '@material/textfield';

var $ = require("jquery");
const username_field = new MDCTextField(document.querySelector('.mdc-text-field--textarea'));

const testURL = "127.0.0.1:8000";
const serverURL = "https://sa0biepvrj.execute-api.us-east-1.amazonaws.com/api";
const usingURL = testURL;

var uploaded = false;

function upload(lyrics, userID, title, artist) {
	console.log(lyrics);
	lyrics = lyrics.split(/\r?\n/);
	var newLyrics = "";
	for (var l = 0; l < lyrics.length;l++) {
		newLyrics += lyrics[l] + "*newline*";
	}
	$.getJSON(`https://sa0biepvrj.execute-api.us-east-1.amazonaws.com/api/start-project/${userID}/${username}/${emailAddress}/${title}/${artist}/${newLyrics}`).done(function () {
		$('#loading-bar-for-upload').fadeOut(1000)
	}).fail(function () {
		alert("Failed to upload")
	})
	uploaded = true
}
var dialog = document.querySelector('dialog');
if (!dialog.showModal) {
	dialogPolyfill.registerDialog(dialog);
}
$('#create-new-project').click(function () {
	dialog.showModal();
})

//When the user click on the upload button
$('#uploadBtn').click(function () {
	//first get the song name and artist info
	var songName = $('#songName').val()
	var artist = $('#artist').val()
	var lyrics = $('#lyrics').val()
		//Then if the song name hasn't been input
	if (songName == "" || artist == "") {
		//show the error messege
		$('#info').html('<p style="color:red">先输入歌曲名和歌手名</p>')
	} else if (lyrics == "") {
		$('#info').html('<p style="color:red">请输入歌词</p>')
	} else {
		//If not, show the loading bar and upload the file
		$('#loading-bar-for-upload').html('<div class="mdl-spinner mdl-js-spinner is-active" id="loading-bar-for-uploading"></div>')
		upload(lyrics, uid, songName,artist)
	}
})
$('form').on('submit', function (event) {
	event.preventDefault()
	var songName = $('#songName').val()
	var artist = $('#artist').val()
	var lyrics = $('#lyrics').val()
	if (songName == null || artist == "" || !uploaded) {
		$('#info').html('<p style="color:red">请输入歌曲名或者歌手名或上传歌词</p>')
	} else {
		$('#userID').val(uid)
		this.submit()
		dialog.close()
	}
})
$('#close').click(function () {
	dialog.close()
})
