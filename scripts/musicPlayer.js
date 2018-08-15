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
                    <h6 id="song-info"></h6>
                </div>
                <div id="someclass">
                <input class="mdl-slider mdl-js-slider" type="range"
                       min="0" max="100" value="0" tabindex="0" step="0.01" id="progressbar-for-player">
                 </div>
                <audio hidden controls loop id="player">
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

    createFloatBtn() {
        $('#floatBtn').html(`  
              <div class="btn-group dropup">
                    <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--colored float" style="background-color:#d50000 " id="menuBtn">
                        <i class="material-icons" id="editBtnIcon">edit</i>
                    </button>
                    <ul class="mdl-menu mdl-menu--top-right mdl-js-menu mdl-js-ripple-effect"
                        data-mdl-for="menuBtn">
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

    static switchToAddedTimeMode() {
        $('#floatBtn').html(
            `
            <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--colored float" id="editBtn">
                        <i class="material-icons" id="editBtnIcon">add</i>
            </button>
            `
        )


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
    constructor(lyrics) {
        this.lyrics = lyrics;
        this.currentLine = 0;
        //this.createLyricsDisplay();
        this.currentLine = 0;
        this.currentword = 0;
    }

    createLyricsDisplay() {
        for (var i = 0; i < this.lyrics['lines'].length; i++) {
            var html = ""
            for (var j = 0; j < this.lyrics['lines'][i]['splited-version'].length; j++) {
                html += `<div class="col-2" id="row-${i}-col-${j}">${this.lyrics['lines'][i]['splited-version'][j]['origin']}</div>`
            }
            $('#lyricsDisplay').append(`<div class="row" id="row-${i}" style="font-size: 20px;margin-bottom: 80px">${html}</div>`);
            html = "";
        }
    }

    addLyrics(lyrics){
        this.lyrics = lyrics;
    }

    animate(time) {
        var line = this.lyrics['lines'][this.currentLine];
        //console.log(time)
        if (time >= line["starttime"] && time <= line['endtime']) {
            var words = line['splited-version'];
            this.scrollTo(this.currentLine);
            try {
                if (time >= words[this.currentword]['starttime']) {
                    this.highlight(this.currentLine, this.currentword);
                    this.currentword += 1;
                }
            } catch (e) {

            }
            //this.highlight(this.currentLine,this.currentword);
        } else if (time > line['endtime'] && time < this.lyrics['lines'][this.currentLine + 1]['endtime']) {
            //this.highlight(this.currentLine,this.currentword);
            this.currentLine += 1;
            this.currentword = 0;
            console.log("Dehighlight");
            this.dehighlightAll()
            //need to fix
        }
    }

    setTime(newtime) {
        this.dehighlightAll();
        for (var i = 0; i < this.lyrics['lines'].length; i++) {
            var starttime = this.lyrics['lines'][i]['starttime'];
            var endtime = this.lyrics['lines'][i]['endtime'];
            if (newtime > endtime) {
                continue;
            } else {
                this.currentLine = i;
                for (var j = 0; j < this.lyrics['lines'][i]['splited-version'].length; j++) {
                    var starttime_word = this.lyrics['lines'][i]['splited-version'][j]['starttime'];
                    var endtime_word = this.lyrics['lines'][i]['splited-version'][j]['endtime'];
                    if (newtime > endtime_word) {
                        continue;
                    } else {
                        this.currentword = j;
                        break;
                    }
                }
                break;
            }
        }
        //console.log(this.lyrics['lines'][this.currentLine]['line-content']);
        this.highlightTo(this.currentLine, this.currentword);
    }

    dehighlightAll(linenum = "") {
        if (linenum === "") {
            for (var i = 0; i < this.lyrics['lines'].length; i++) {
                for (var j = 0; j < this.lyrics['lines'][i]['splited-version'].length; j++) {
                    this.dehighlight(i, j);
                }
            }
        }
    }

    highlightTo(currentline,toword){
        for(var i = 0; i < toword;i++){
            this.highlight(currentline,i);
        }
    }

    scrollTo(position) {
        $('#row-' + position).scrollintoview({
            duration: 300, direction: "y", complete: function () {
            }
        })
    }

    highlight(positionofline, positionofword) {
        //console.log($('#col-'+positionofword).html());
        console.log("Changing")
        $(`#row-${positionofline}`).addClass('highlight-card');
        //$(`#row-${positionofline}-col-${positionofword}`).css('color', "red");
        highlightOrigin(positionofline,positionofword);
        highlightTranslate(positionofline,positionofword);

    }

    dehighlight(positionofline, positionofword) {
        $(`#row-${positionofline}`).css('background-color', "white");
        $(`#row-${positionofline}-col-${positionofword}`).css('color', "black");
    }
}

class TimedLyrics {
    constructor(player, lyricsDisplay) {
        //music player
        this.player = player;
        //Lyrics display
        this.lyricsDisplay = lyricsDisplay;
        //Lyrics object from server
        this.lyrics = this.getLyrics();
        //total time list for each individual line
        this.times = [];
        //total line for each individual words in each line
        this.timeForLine = [];
        //the current line
        this.currentLineNum = 0;
        //if player not playing any music, then alert the user
        if (player.getPlayer().src == null) {
            alert("Not playing music")
        }
    }

    updatelyricsDisplay(newDisplay){
        this.lyricsDisplay = newDisplay;
        this.lyrics = newDisplay.lyrics;
    }

    getLyrics() {
        //console.log(this.lyricsDisplay.lyrics);
        return this.lyricsDisplay.lyrics;
    }

    addTimeToLine() {
        var currentTime = player.getCurrentPlayInfo().currentTime;
        var lengthOftheLine = this.lyrics['lines'][this.currentLineNum]['splited-version'].length;
        lyricsDisplay.scrollTo(this.currentLineNum);
        lyricsDisplay.highlight(this.currentLineNum, this.timeForLine.length)
        this.timeForLine.push(currentTime);
        if (this.timeForLine.length === lengthOftheLine) {
            this.addTimeToLyrics();
            this.currentLineNum += 1;
        }
    }

    addTimeToLyrics() {
        this.times.push(this.timeForLine);
        this.timeForLine = [];
        if (this.currentLineNum + 1 === this.lyrics['lines'].length) {
            var jsonData = JSON.stringify({"time_data": this.times});
            $.getJSON(`http://127.0.0.1:8000/add_timed_lyrics/asoijdiasojd/Call it what you want/Taylor Swift/${jsonData}`).done(

            )
        }
    }
}

