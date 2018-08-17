class Applemusic {
    constructor(){
        document.addEventListener('musickitloaded', function() {
            MusicKit.configure({
                developerToken: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjQyVlZLQ0o2TTgifQ.eyJpYXQiOjE1MzQ0Njc1NzMsImV4cCI6MTU1MDAxOTU3MywiaXNzIjoiUDlLSzQ1Mks4UCJ9.wYlP9vG4KQwmT3fq7Ohledoe_PppgqqHCN9DornwzUFosaBaNMKCqGAarNpDiPOuM7ngDgENAMpZz7EfYsWEag',
                app: {
                    name: 'My Cool Web App',
                    build: '1978.4.1'
                }
            });
        });
        this.player = "";

    }

    search(songName){
            var music = MusicKit.getInstance();
            music.authorize().then(async function () {
                let result = await music.api.search(songName, {limit: 10, types: 'songs'});
                console.log(result);
                var data = result['songs']['data'];
                for (var i = 0; i < data.length; i++) {
                    var attributes = data[i]['attributes'];
                    var artwork = MusicKit.formatArtworkURL(attributes['artwork'], 300, 300);
                    var songID = data[i]['id'];
                    var albumName = attributes['albumName'];
                    var artistName = attributes['artistName'];

                    $('#results').append(`
                        <div class="row" style="margin-bottom: 10px">
                            <div class="col">
                                <img id="${songID}" src=${artwork} height="100px" width="100px">
                            </div>
                            <div class="col">
                                <p>${albumName}</p>
                                <p>${artistName}</p>
                                <p>${songID}</p>
                                <div id="time${songID}"></div>
                            </div>
                        </div>

                    `)
                }
            });
    }

    createHTML(){
        $('#applemusic').html(`

        <div id="results"></div>

        `)
    }

    bindPlayer(newplayer){
        this.player = newplayer;
    }

     play(songID){
        let music = MusicKit.getInstance();
         var p = this.player;
        music.setQueue({ song: songID }).then(function(queue) {
            music.play();
            music.addEventListener('playbackTimeDidChange',function (event) {
                p.updateProgressbar(event.currentPlaybackDuration,event.currentPlaybackTime)
            })
        });
    }

    static stop(){
        let music = MusicKit.getInstance();
        music.stop();
    }
}
