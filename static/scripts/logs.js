const versionList =
    [{
        version: 0.05,
        time: "2018-08-06",
        eng: "Added the basic look of what the app's looking.",
        zh: "制作了主app外观",
    }, {
        version: 0.1,
        time: "2018-08-08",
        eng: "Added the show music list function and improve the ui design",
        zh: "改进了歌曲制作UI，以及增加了歌曲列表功能"
    },
    {
        version: 0.2,
        time: "2018-08-11",
        eng: "Added the local music player and also be able to make a timed lyrics",
        zh: "增加了本地歌曲播放器，同时允许用户制作自己的同步歌词"
    }, {
        version: 0.3,
        time: "2018-08-17",
        eng: "Embedded the Apple Music into the app",
        zh: "集成了Apple Music"
    }, {
        version: 0.4,
        time: "2018-09-16",
        eng: "Added normal text's auto saving function. Fixed the displaying bug on the home screen as well as improved the editing page's ui.",
        zh: "增加了全文本编辑时的自动保存功能，修复了主页显示Bug。同时还改善了编辑界面。"
    }, {
        version: 0.43,
        time: "2018-09-23",
        eng: "Moved from firebase login to custom login page.",
        zh: "从firebase login转到自制login页面。"
    }
    ];

for (var i = versionList.length - 1; i >= 0; i--) {
    $('#logs-display').append(`
<div class="list-group">
                    <a href="#" class="list-group-item list-group-item-action flex-column align-items-start">
                        <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1 lang" id="header">${versionList[i].version}</h5>
                            <small class="lang" id="time">${versionList[i].time}</small>
                        </div>
                        <p class="mb-1 lang" id="content">${versionList[i][languageCode]}</p>
                    </a>
                </div>

`);
}