/*jslint devel: true, node: true, rhino: false, passfail: false, white: true, eqeq: true, forin: true, newcap: true, plusplus: true, unparam: true, sloppy: true, vars: true, maxerr: 300*/

var socket = io();
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);



var list;
var tags = [];
var player;

socket.on('list', function (data) {
    list = data.list;
    app.currentList = list;
    for (var i = 0; i < list.length; i++) {
        for (var o = 0; o < list[i].tags.length; o++) {
            if (tags.includes(list[i].tags[o]) === false) {
                tags.push(list[i].tags[o]);
            }
        }
    }
});

socket.emit('list', "list");
 

 
var app = new Vue({
    el: '#app',
    data: {
        currentList: "",
        searchvalue: '',
        popupActive: false,
        menuActive: false,
        newLinkURL: '',
        newLinkTags: '',
        lastSearch: '',
        youtubeReady: false,
        youtubeActive: false,
        iconClasses: {
            youtube: "fa fa-youtube-play",
            unknown: "fa fa-globe",
            facebook: "fa fa-facebook-official",
            soundcloud: "fa fa-soundcloud",
            github: "fa fa-github",
            twitter: "fa fa-twitter-square",
            wikipedia: "fa fa-wikipedia-w",
            dropbox: "fa fa-dropbox",
            steam: "fa fa-steam",
            tripadvisor: "fa fa-tripadvisor",
            spotify: "fa fa-spotify",
            amazon: "fa fa-amazon",
            instagram: "fa fa-instagram"

        },
        colorClasses: {
            youtube: "youtube-back",
            unknown: "unknown-back",
            facebook: "facebook-back",
            soundcloud: "soundcloud-back",
            github: "github-back",
            twitter: "twitter-back",
            wikipedia: "wikipedia-back",
            dropbox: "dropbox-back",
            steam: "steam-back",
            tripadvisor: "tripadvisor-back",
            spotify: "spotify-back",
            amazon: "amazon-back",
            instagram: "instagram-back"

        },
        tagMenuActive: false
    },
    methods: {
        search: function (text) {
            this.menuActive = false;
            var found = false;
            this.currentList = [];
            this.lastSearch = text;
            for (var i = 0; i < list.length; i++) {

                if (list[i].title.toLowerCase().includes(text.toLowerCase()) && text.toLowerCase().length > 2) {
                    found = true;
                    this.currentList.push(list[i]);
                }

                for (var o = 0; o < list[i].tags.length; o++) {
                    if (text.toLowerCase().includes(list[i].tags[o])) {
                        found = true;
                        this.currentList.push(list[i]);
                    }
                }
            }

            if (found === false) {
                this.currentList = list;
            }
        },
        addLink: function () {
            socket.emit("addLink", {
                title: "",
                url: this.newLinkURL,
                tags: this.newLinkTags,
                app: "",
            });

            this.newLinkURL = "";
            this.newLinkTags = "";
            this.popupActive = false;
        },
        activePopup: function () {
            this.popupActive = !this.popupActive;
            document.querySelector('#link-value').focus();
        },
        parseDate: function (date) {
            // published from how many time ago
            var ago = ((Date.now() - date) / 1000 / 60);
            console.log(ago);
            if (ago < 60) {
                //minutes
                var from = Math.ceil(ago).toString() + " min";
                return from;

            } else if (ago > 60 && ago < 1440) {
                //heures
                var from = Math.ceil((ago / 60)).toString() + " heures";
                return from;
            } else if (ago > 1440) {
                var from = Math.ceil(ago / 60 / 24).toString() + " jour(s)";
                return from;
            }


        },
        isImage: function (url) {
            if (url.endsWith(".png")) {
                return true;
            } else if (url.endsWith(".jpg")) {
                return true;
            } else if (url.endsWith(".gif")) {
                return true;
            }
        },
        isVideo: function (url) {
            if (url.endsWith(".webm")) {
                return true;
            } else if (url.endsWith(".mp4")) {
                return true;
            }
        },
        isYoutube: function (url, index) {
            if (url.includes("youtube.com")) {
                return true;
            }
        },
        runYoutube: function (url, index) {

            if (this.youtubeActive === true) {
                this.youtubeActive = false;
            } else {
                 this.youtubeActive = true;
                var newurl = url.replace("https://www.youtube.com/watch?v=", "");
                if (this.youtubeReady === true) {
                    player = new YT.Player('player' + index.toString(), {
                        height: '300',
                        width: '450',
                        videoId: newurl,
                        events: {
                            'onReady': onPlayerReady,
                            'onStateChange': onPlayerStateChange
                        }
                    });
                }
            }
        },
        showTags: function() {
            this.tagMenuActive = !this.tagMenuActive;
        }
    }
});

// 2. This code loads the IFrame Player API code asynchronously.
// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        setTimeout(stopVideo, 6000);
        done = true;
    }
}

function stopVideo() {
    player.stopVideo();
}


function onYouTubeIframeAPIReady() {
    app.youtubeReady = true;
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    //    event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;