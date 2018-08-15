const player = new MusicPlayer();
const lyricsDisplay = new ScrollLyrics("");
const editor = new TimedLyrics(player, lyricsDisplay);
$.getJSON(url).done(function (data) {
    $('#loading-bar').fadeOut(1000);
    lyrics = data;
    lines = data['lines'];
    if (deviceWidth > 600) {
        createHTMLCardXL(lines);
    } else {
        createHTMLCardSm(lines)
        //createHTMLWithNomalText(lines);
    }
    lyricsDisplay.addLyrics(data);

    editor.updatelyricsDisplay(lyricsDisplay);
});

player.getPlayer().ontimeupdate = function () {
    player.updateProgressbar();
    //lyricsDisplay.animate(player.getCurrentPlayInfo().currentTime);
};

