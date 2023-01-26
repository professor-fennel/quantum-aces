var x, y, Dx, Dy, h1, h2, inertia;
// var connection = new WebSocket('wss://fee.cool:8080/bored/boink-server.js');
// var connection = new WebSocket('wss://fee.cool/fireflyserver/bored/boink-server.js');
var connection = new WebSocket('wss://fee.cool/fireflyserver');
var friends = [ ];
var connected = false;

function setup() {
  if(windowWidth < 480) {
    var canvas = createCanvas(windowWidth - 20, windowWidth - 20);
  } else {
    var canvas = createCanvas(480, 480);
  }
  colorMode(HSB, 360, 100, 100, 1);
  canvas.parent('script-box');
  x = width / 2;
  y = width /2;
  Dx = 1 + random(0, 3);
  Dy = 1 + random(0, 3);
  inertia = 1;
  noStroke();
  websocket_setup();
}

function draw() {
  h1 = map(x, 0, width, 0, 360);
  if(h1 < 180) {
    h2 = h1 + 180;
  } else {
    h2 = h1 - 180;
  }
  background(h1, 50, 100, 1);
  // fill(h2, 50, 100, 1);
  // ellipse(x, y, 20, 20);
  // fill(h2, 50, 100, 0.5);
  // ellipse(x, y, 40, 40);
  // fill(h2, 50, 100, 0.2);
  // ellipse(x, y, 60, 60);

  for(let i=0; i < friends.length; i++) {
    fill(0, 0, 100, 0.9);
    ellipse(friends[i][0], friends[i][1], 20, 20);
    fill(0, 0, 100, 0.4);
    ellipse(friends[i][0], friends[i][1], 40, 40);
    fill(0, 0, 100, 0.1);
    ellipse(friends[i][0], friends[i][1], 60, 60);
  }
  friends = [ ];

  if(mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    Dx += (mouseX - x) / 100;
    Dy += (mouseY - y) / 100;
    inertia = 0.95;
  } else {
    inertia = 1;
  }
  if(x < 10 || x > width - 10) {
    Dx = Dx * -1;
  }
  if(y < 10 || y > height - 10) {
    Dy = Dy * -1;
  }

  Dx = constrain(Dx * inertia, -16, 16);
  Dy = constrain(Dy * inertia, -16, 16);

  if(x < 10) {x = 10;}
  if(x > width - 10) {x = width - 10;}
  if(y < 10) {y = 10;}
  if(y > height - 10) {y = height - 10;}

  x += Dx;
  y += Dy;

  if(connected) {
    let pos = [x, y];
    // var json = JSON.stringify({type:'message', data:pos});
    connection.send(pos);
    // console.log(pos);
  }
}

function websocket_setup() {
  // if user is running mozilla then use it's built-in WebSocket
  window.WebSocket = window.WebSocket || window.MozWebSocket;
  // if browser doesn't support WebSocket, just show some notification and exit
  if (!window.WebSocket) {
      console.log("sorry, but your browser doesn't support websockets")
      return;
  }
}

connection.onopen = function () {
  console.log("connected to websocket")
  connected = true;
};

connection.onmessage = function (message) {
  // console.log(message);
  try {
      var json = JSON.parse(message.data);
  } catch (e) {
      console.log('This doesn\'t look like a valid JSON: ', message.data);
      return;
  }
  let friend = json.data;
  // console.log(friend[0]);
  friends.push(friend);
  // fill(255, 255, 255);
  // noStroke();
  // ellipse(friend[0], friend[1], 20, 20);
};

connection.onerror = function (error) {
  console.log("big time problems, chief")
    // just in there were some problems with conenction...
    // chat_log.html($('<p>', { text: 'Sorry, but there\'s some problem with your connection or the server is down.' } ));
};
