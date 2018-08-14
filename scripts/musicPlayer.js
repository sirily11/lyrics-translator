var musicName = "";
const allowType = ['mp3', 'm4a'];


class MusicPlayer {
    constructor() {
        this.allowType = ['mp3', 'm4a'];
        this.currentStatus = "stop";
        this.createPlayer();
        this.createFloatBtn();
        this.player = document.getElementById('player');
    }

    createPlayer() {
        console.log("Creating the player");
        $('#music-player').html(`
        <nav class="fixed-bottom navbar-light bg-light">
            <div class="container" width="100%" style="margin-bottom: 10px">
                <div class="row">
                    <input hidden type="file" name="file" id="file" class="inputfile"/>
                    <label for="file">
                        <i class="material-icons">arrow_upward</i>
                    </label>
                </div>
                <div class="row" style="margin-left: 5%">
                    <h6 id="song-info">Taylor swift</h6>
                </div>
                <div id="someclass">
                <input class="mdl-slider mdl-js-slider" type="range"
                       min="0" max="100" value="0" tabindex="0" step="0.01" id="progressbar-for-player">
                 </div>
                <audio hidden controls id="player">
                </audio>
                <div class="row justify-content-md-center">
                
                        <button class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect " id="prev-btn">
                            <i class="material-icons">skip_previous</i>
                        </button>
                        
                        <button class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect " disabled
                                id="play-btn">
                            <i class="material-icons" id="play-btn-icon">play_arrow</i>
                        </button>
                        
                        <button class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect " id="next-btn">
                            <i class="material-icons">skip_next</i>
                        </button>
                        
                </div>
            </div>
        </nav>
        `)
    }

    createFloatBtn(){
        $('#floatBtn').html(`  
              <div class="btn-group dropup">
                    <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--colored float" id="editButton">
                        <i class="material-icons" id="editButtonIcon">edit</i>
                    </button>
                    <ul class="mdl-menu mdl-menu--top-right mdl-js-menu mdl-js-ripple-effect"
                        data-mdl-for="editButton">
                        <a onclick="MusicPlayer.switchToAddedTimeMode()" class="mdl-menu__item lang" id="createTimedLyrics"></a>
                        <a class="mdl-menu__item lang" id="usingApplemusic"></a>
                    </ul>
                </div>`
        )
    }
    startPlaying() {
        $('#play-btn').addClass('mdl-button--colored').attr('disabled', false).css("background-color", "#3f51b5").css("color", 'white');
        $('#next-btn').addClass('mdl-button--colored');
        $('#prev-btn').addClass('mdl-button--colored');
        $('#song-info').html();
    }

    static switchToAddedTimeMode(){
        $('#editButtonIcon').html('add').fadeIn(1000).attr('onclick',"");
        $('.mdl-menu').hide();
    }
    getCurrentPlayInfo() {
        var currentTime = this.player.currentTime;

        return {
            currentTime: currentTime
        }
    }

    play() {
        this.player.play();
        $('#play-btn-icon').html("stop");
        this.currentStatus = "playing";
    }

    stop() {
        this.player.pause();
        $('#play-btn-icon').html("play_arrow");
        this.currentStatus = "stop";
    }

    getPlayer() {
        return this.player;
    }


    setTime(newTime) {
        this.player.currentTime = newTime;
    }

    updateProgressbar() {
        var totalLength = this.player.duration;
        var value = (this.getCurrentPlayInfo().currentTime / totalLength) * 100;
        document.getElementById('progressbar-for-player').MaterialSlider.change(value)
    }


}

class ScrollLyrics {
    constructor() {
        this.lyrics = "";
        this.currentLine = 0;
        this.createLyricsDisplay()
    }

    createLyricsDisplay() {
        for (var i = 0; i < 100; i++) {
            $('#lyricsDisplay').append(`<div id="${i}" style="font-size: 40px;margin-bottom: 80px"> 第${i}句 </div>`)
        }
    }

    animate(time) {
        if (time >= this.currentLine * 2 && time < (this.currentLine + 1) * 2) {
            this.highlight(this.currentLine);
            this.scrollTo(this.currentLine);
            if (this.currentLine > 0) {
                this.dehighlight(this.currentLine - 1);
            }
            this.currentLine += 1;
        }
    }

    scrollTo(position) {
        // var container = $('#lyricsDisplay'),
        //     // scrollTo = $(`#${position}`);
        $('#' + position).scrollintoview({
            duration: "slow", direction: "y", complete: function () {
            }
        })
        // console.log(scrollTo.offset().top);
        // container.animate({
        //     scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
        // });
    }

    highlight(positionofline,positionofword) {
        $(`#${positionofline}`).css('color', "red");
    }

    dehighlight(positionofline,positionofword) {
        $(`#${positionofline}`).css('color', "black");
    }
}

class TimedLyrics {
    constructor(lyricsJson,player,lyricsDisplay){
        //Lyrics object from server
        this.lyrics = this.getLyrics(lyricsJson);
        //total time list for each individual line
        this.times = [];
        //total line for each individual words in each line
        this.timeForLine = [];
        //music player
        this.player = player;
        //Lyrics display
        this.lyricsDisplay = lyricsDisplay;
        //the current line
        this.currentLineNum = 0;
        //if player not playing any music, then alert the user
        if(player.getPlayer().src == null){
            alert("Not playing music")
        }
    }
    startCreating(){
        $('#editButtonIcon').html('add')
    }

    getLyrics(lyricsJson){

    }

    addTimeToLine(){
        var currentTime = player.getCurrentPlayInfo().currentTime;
        var lengthOftheLine = this.lyrics['lines'][this.currentLineNum]['splited-version'].length;
        if(this.timeForLine.length <= lengthOftheLine){
            this.timeForLine.push(currentTime)
            lyricsDisplay.highlight(this.currentLineNum,this.timeForLine.length)
        }else{
            this.addTimeToLyrics();
            this.currentLineNum += 1;
        }
    }

    addTimeToLyrics(){
        this.times.push(this.timeForLine);
        this.timeForLine = [];
    }
}

const player = new MusicPlayer();
const lyricsDisplay = new ScrollLyrics();

$('#file').change(function (e) {
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

$('#play-btn').click(function () {
    if (player.currentStatus === "playing") {
        player.stop();
    } else {
        player.play();
    }
});

player.getPlayer().ontimeupdate = function () {
    //console.log(getCurrentPlayInfo())
    lyricsDisplay.animate(player.getCurrentPlayInfo().currentTime);
    player.updateProgressbar();
};


$('#progressbar-for-player').on("mousedown touchstart",function () {
    player.stop();
}).change(function () {
    var sliderValue = $(this).val();
    var newTime = (sliderValue / 100) * player.getPlayer().duration;
    player.setTime(newTime);
    player.play();
    console.log($(this).val())
});
