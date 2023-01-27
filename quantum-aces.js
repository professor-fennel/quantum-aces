var w, h;
var game, player, mouse;
var ship_test;

function setup() {
  colorMode(RGB, 255, 255, 255, 1);
  w = windowWidth - 20;
  h = windowHeight - 20;
  var canvas = createCanvas(w, h);
  canvas.parent('script-box');
  game = new Game();
  player = new Player();
  ship_test = new Ship(100, 100);
  mouse = new Mouse();
  noCursor();
}

function draw() {
  clear();
  noStroke();
  fill(0, 0, 0, 1);
  rect(-10, -10, w + 10, h + 10);
  // fill(40, 200, 40, 1);
  // ellipse(mouseX, mouseY, 10, 10);
  ship_test.launch();
  ship_test.move();
  ship_test.illustrate();
  mouse.illustrate();
}

class Ship {
 constructor(x, y) {
   this.position = new Vector(x, y);
   this.inertia = 0.95;
   this.thrust = new Vector(50, 60);
   this.angle = new Vector(0, 0);
   this.inputted_vectors = []
   this.size = 40;
   this.sprite = loadImage("assets/ship-2.png");
   // this.sprite.image = "assets/ship-1.png";
   // this.sprite.diameter = this.size;
 }

 input_new_vector(v) {
   this.inputted_vectors.push(v);
 }

 launch() {
   // average all inputted vectors
   // add to thrust vector
   // BUT FOR A TEMPORARY DEMONSTRATION...
   if(distance(mouseX, mouseY, this.position.x, this.position.y) < this.size/2) {
     let m = new Vector(this.position.x - mouseX, this.position.y - mouseY);
     this.thrust.add(m);
   }
 }

 move() {
   // bounce off walls
   if(this.position.x > w - this.size/2) {
     this.position.x = w - this.size/2;
     this.thrust.x = this.thrust.x * -1;
   }
   if(this.position.x < this.size/2) {
     this.position.x = this.size/2;
     this.thrust.x = this.thrust.x * -1;
   }
   if(this.position.y > h - this.size/2) {
     this.position.y = h - this.size/2;
     this.thrust.y = this.thrust.y * -1;
   }
   if(this.position.y < this.size/2) {
     this.position.y = this.size/2;
     this.thrust.y = this.thrust.y * -1;
   }
   // subtract inertia (is this appropriate in space??? i dunno)
   this.thrust.slow(this.inertia);
   // find angle vector
   this.angle = new Vector(this.thrust.x, this.thrust.y);
   this.angle.normalize();
   // PUNCH IT
   this.position.add(this.thrust);
 }

 stop() {
   this.thrust.zero();
 }

 illustrate() {
   // stroke(150, 250, 210, 1);
   // strokeWeight(8);
   // line(this.position.x, this.position.y,
   //  this.position.x + this.angle.x*30,
   //  this.position.y + this.angle.y*30);
   // noStroke();
   // fill(150, 250, 210, 1);
   // ellipse(this.position.x, this.position.y, this.size, this.size);
   image(this.sprite, this.position.x - 76*1.5, this.position.y - 111*1.5, 76*3, 111*3);
 }
}

class Game {
  constructor() {
    this.state = "GAME_START";
  }

  checkState() {

  }
}

class Player {
  constructor() {
    this.state = "OPEN";
  }

  click() {
  }
}

class Mouse {
  constructor() {
    this.sprites = [
      loadImage("assets/mouse-1.png"),
      loadImage("assets/mouse-2.png"),
      loadImage("assets/mouse-3.png"),
      loadImage("assets/mouse-4.png"),
      loadImage("assets/mouse-3.png"),
      loadImage("assets/mouse-2.png")
    ]
    this.frame = 0;
  }

  illustrate() {
    if(frameCount%8 == 1) {
      if(this.frame >= 5) {
        this.frame = 0;
      } else {
        this.frame++;
      }
    }
    image(this.sprites[this.frame], mouseX - 4, mouseY - 4, 44*2, 69*2);
  }
}

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
  }

  slow(i) {
    // if(abs(this.x) > 0.001 && abs(this.y) > 0.001) {
      this.x = this.x * i;
      this.y = this.y * i;
    // }
  }

  normalize() {
    let mag = sqrt(pow(this.x, 2) + pow(this.y, 2));
    this.x = this.x / mag;
    this.y = this.y / mag;
  }

  zero() {
    this.x = 0;
    this.y = 0;
  }
}

/////////////////////////////////////////// MATH STUFF

function windowResized() {
  // getCanvasMeasurements()
  w = windowWidth - 20;
  h = windowHeight - 20;
  resizeCanvas(windowWidth, windowHeight);
}

function distance(x1, y1, x2, y2) {
  let d = 0;
  d = sqrt(pow(x1 - x2, 2) + pow(y1 - y2, 2));
  return d;
}
