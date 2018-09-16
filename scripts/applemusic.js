class Applemusic {
    constructor() {
        document.addEventListener('musickitloaded', function () {
            MusicKit.configure({
                developerToken: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjQyVlZLQ0o2TTgifQ.eyJpYXQiOjE1MzQ0Njc1NzMsImV4cCI6MTU1MDAxOTU3MywiaXNzIjoiUDlLSzQ1Mks4UCJ9.wYlP9vG4KQwmT3fq7Ohledoe_PppgqqHCN9DornwzUFosaBaNMKCqGAarNpDiPOuM7ngDgENAMpZz7EfYsWEag',
                app: {
                    name: 'My Cool Web App',
                    build: '1978.4.1'
                }
            });
        });
        this.player = "";
        this.songID = "";
        this.currentTime = 0;
        this.music = "";
        this.lyricsDisplay = "";
        this.content = [];
    }

    search(songName) {
        var music = MusicKit.getInstance();
        this.music = music;
        music.authorize().then(async function () {
            let result = await music.api.search(songName, {limit: 10, types: 'songs'});
            console.log(result);
            let data = result['songs']['data'];
            let item = "";
            let tabs = "";
            let tagIndex = 1;
            let c = [];

            for (let i = 0; i < data.length; i++) {
                let attributes = data[i]['attributes'];
                let artwork = MusicKit.formatArtworkURL(attributes['artwork'], 300, 300);
                let songID = data[i]['id'];
                let albumName = attributes['albumName'];
                let artistName = attributes['artistName'];
                item += `
                    <div class="row" style="margin-bottom: 10px">
                        <div class="col">
                            <img id="${songID}" src=${artwork} height="100px" width="100px">
                        </div>
                        <div class="col">
                            <p>${albumName}</p>
                            <p>${artistName}</p>
                        </div>
                    </div>
                    `;

                if ((i + 1) % 3 === 0 || i + 1 === data.length) {
                    $("#tags").append(`<a class="page-link">${tagIndex}</a>`);
                    tabs += `<div class="tab-result" id="tabs-${tagIndex}">
                                    ${item}
                            </div>`;
                    c.push(tabs);
                    tabs = "";
                    item = "";
                    tagIndex += 1;
                }
            }
            $("#results").html(c[0]);
            $(document).on("click",".page-link",function () {
                let index= $(this).html();
                let html = c[index];
                $("#results").html(html);
            });
        });
    }

    createHTML() {
        let c = this.content;
        $("#applemusic").html(`
            <div id="tabs">
                <ul id="tags" class="pagination pagination-lg"></ul>
                <div id="results"></div>
            </div>
        `)
    }

    getMusic() {
        return this.music;
    }

    bindPlayer(newplayer) {
        this.player = newplayer;
    }

    addID(id) {
        this.songID = id;
    }

    bindLyrics(lyricsDisplay) {
        this.lyricsDisplay = lyricsDisplay;
    }

    play() {
        let music = MusicKit.getInstance();
        var p = this.player;
        var l = this.lyricsDisplay;
        var time = this.currentTime;
        console.log("play");

        music.setQueue({song: this.songID}).then(function (queue) {
            music.play();
            applemusic.getMusic().addEventListener('playbackTimeDidChange', function (event) {
                p.updateProgressbar(event.currentPlaybackDuration, event.currentPlaybackTime);
                time = event.currentPlaybackTime;
                if (l.hasTimingInfo() && p.isPlaying()) {
                    try {
                        l.animate(time);
                    } catch (e) {
                    }
                }
            });
            console.log(music);
        });
    }

    pause() {

    }
}
