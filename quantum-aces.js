game = new GameState();

function setup() {
  colorMode(RGB, 255, 255, 255, 1);
  w = 480;
  h = w;
  var canvas = createCanvas(w, h);
  canvas.parent('script-box');
}

function draw() {
  noStroke();
  fill(0, 0, 0, 0.1);
  rect(-10, -10, w + 10, h + 10);
  fill(40, 200, 40, 1);
  ellipse(mouseX, mouseY, 20, 20);
}

class Ship {
 constructor() {

 }
}

class GameState {
  constructor() {
    this.state = "GAME_START";
  }

  checkState() {

  }
}

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(v) {
    added = new Vector(this.x + v.x, this.y + v.y);
    return added
  }
}
