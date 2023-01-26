// open a terminal, ssh to fee.cool, and go to this folder
// then "js chat-server.js" to open the server
// make sure "ufw allow 1337" is on so the port is open


// http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
"use strict";

// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'boink';

// Port where we'll run the websocket server
var webSocketsServerPort = 8080;

// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');

/**
 * Global variables
 */
// latest 100 messages
// var history = [ ];
// positions of clients
var balls = [ ];
// list of currently connected clients (users)
var clients = [ ];

/**
 * Helper function for escaping input strings
 */
// function htmlEntities(str) {
//     return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
//                       .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// }

// Array with some colors
// var colors = [ 'red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange' ];
// ... in random order
// colors.sort(function(a,b) { return Math.random() > 0.5; } );

/**
 * HTTP server
 */
var server = http.createServer(function(request, response) {
    // Not important for us. We're writing WebSocket server, not HTTP server
});
server.listen(webSocketsServerPort, function() {
    console.log((new Date()) + " boink server is listening on port " + webSocketsServerPort);
});

/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
    // WebSocket server is tied to a HTTP server. WebSocket request is just
    // an enhanced HTTP request. For more info http://tools.ietf.org/html/rfc6455#page-6
    httpServer: server
});

// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) {
    console.log((new Date()) + ' connection from origin ' + request.origin);

    // accept connection - you should check 'request.origin' to make sure that
    // client is connecting from your website
    // (http://en.wikipedia.org/wiki/Same_origin_policy)
    var connection = request.accept(null, request.origin);
    // we need to know client index to remove them on 'close' event
    var index = clients.push(connection) - 1;
    balls[index] = [0, 0];
    // var userName = false;
    // var userColor = false;

    console.log((new Date()) + ' connection accepted');
    // console.log(index);

    // send back chat history
    // if (history.length > 0) {
    //     connection.sendUTF(JSON.stringify( { type: 'history', data: history} ));
    // }

    // user sent some message
    connection.on('message', function(message) {
      if(message.type === 'utf8') {
        let m = message.utf8Data;
        // console.log(pos);
        let pos_string = m.split(",");
        let x = +(pos_string[0]);
        // console.log(x);
        let y = +(pos_string[1]);
        balls[index][0] = x;
        balls[index][1] = y;
        // console.log(balls[index]);
        // var pos = {
        //   x: message.x,
        //   y: message.y
        // };
        var json = JSON.stringify({type:'message', data:balls[index]});
        for (var i=0; i < clients.length; i++) {
          // if(i != index) {
            clients[i].sendUTF(json);
          // }
        }
      }
    });

    // user disconnected
    connection.on('close', function(connection) {
        // if (userName !== false && userColor !== false) {
          console.log((new Date()) + "peer " + connection.remoteAddress + " disconnected.");
          // remove user from the list of connected clients
          clients.splice(index, 1);
            // push back user's color to be reused by another user
            // colors.push(userColor);
        // }
    });

});
