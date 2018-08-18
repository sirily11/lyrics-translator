const player = new MusicPlayer();
const lyricsDisplay = new ScrollLyrics("");
const editor = new TimedLyrics(player, lyricsDisplay);

$("#searchBtn").click(function () {
    var songName = $('#songName').val();
    applemusic.search(songName);
});

$.getJSON(url).done(function (data) {
    $('#loading-bar').fadeOut(1000);
    lyrics = data;
    lines = data['lines'];
    if (deviceWidth > 600) {
        createHTMLCardXL(lines);
        lyricsDisplay.updateMode("xl")
    } else {
        createHTMLCardSm(lines);
        lyricsDisplay.updateMode('sm');
    }
    lyricsDisplay.addLyrics(data);
    editor.updatelyricsDisplay(lyricsDisplay);
});

player.getPlayer().ontimeupdate = function () {
    player.updateProgressbar();
    if(lyricsDisplay.hasTimingInfo() && player.isPlaying()){
        try{
            lyricsDisplay.animate(player.getCurrentPlayInfo().currentTime);
        }catch (e) {
        }
    }
};


$(document).on('click','img',function (e) {
    var id = $(this).attr('id');
    player.updatePlayer(document.getElementById('apple-music-player'));
    applemusic.bindPlayer(player);
    applemusic.bindLyrics(lyricsDisplay);
    applemusic.addID(id);
    applemusic.play();
    player.startPlaying();
    player.play();
    dialog.close();
    player.appleMusic = true;
});
