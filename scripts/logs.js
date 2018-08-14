const versionList = [0.2,0.1,0.05];
for(var i = 0; i < versionList.length;i++) {
    $('#logs').append(`
<div class="list-group">
                    <a href="#" class="list-group-item list-group-item-action flex-column align-items-start">
                        <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1 lang" id="header-${versionList[i]}"></h5>
                            <small class="lang" id="time-${versionList[i]}"></small>
                        </div>
                        <p class="mb-1 lang" id="content-${versionList[i]}"></p>
                    </a>
                </div>

`);
}