/*jslint devel: true, node: true, rhino: false, white: true, eqeq: true, newcap: true, plusplus: true, unparam: true, sloppy: true, stupid: true, vars: true*/

var express = require('express');
var app = express();
var http = require('http').Server(app);
var fs = require('fs');
var io = require('socket.io')(http);
var jsonfile = require('jsonfile');
var title = require('url-to-title');

var linkList;
var apps = [
"youtube",
"unknown",
"facebook",
"soundcloud",
"github",
"twitter",
"wikipedia",
"dropbox",
"steam",
"tripadvisor",
"spotify",
"amazon",
"instagram"
];

jsonfile.readFile('links.json', function (err, obj) {
    linkList = obj;
});


app.get('/:filename', function (req, res) {
    res.sendFile(__dirname + "/" + req.params.filename);
});

app.get('', function (req, res) {
    res.sendFile(__dirname + "/index.html");
});


io.on('connection', function (socket) {

    socket.on("list", function () {
        io.emit('list', linkList);
    });

    socket.on("addLink", function (data) {
        var currentLink = data;
        title(data.url, function (err, title) {

            if (err) {
                currentLink.title = "lien";
                currentLink.tags = data.tags.split(" ");
                currentLink.date = Date.now();

                for (var i = 0; i < apps.length; i++) {
                    if (currentLink.url.toLowerCase().includes(apps[i])) {
                        currentLink.app = apps[i];
                    }

                    if (currentLink.app === "") {
                        currentLink.app = "unknown";
                    }
                }


                linkList.list.unshift(currentLink);
                io.emit('list', linkList);
                jsonfile.writeFile('links.json', linkList, function (err) {
                    if (err) {
                        console.error(err);
                    }
                });
            }

            currentLink.title = title;
            currentLink.tags = data.tags.split(" ");
            currentLink.date = Date.now();

            for (var i = 0; i < apps.length; i++) {
                if (currentLink.url.toLowerCase().includes(apps[i])) {
                    currentLink.app = apps[i];
                }

                if (currentLink.app === "") {
                    currentLink.app = "unknown";
                }
            }


            linkList.list.unshift(currentLink);
            io.emit('list', linkList);
            jsonfile.writeFile('links.json', linkList, function (err) {
                if (err) {
                    console.error(err);
                }
            });
        });

    });

});



http.listen('8080', function () {
    console.log('Running Media Center on 8080 port...');
})