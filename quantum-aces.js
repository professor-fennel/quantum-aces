var w, h;
var game, player, mouse;
var ship_test;

function setup() {
  colorMode(RGB, 255, 255, 255, 1);
  angleMode(DEGREES);
  w = windowWidth - 20;
  h = windowHeight - 20;
  var canvas = createCanvas(w, h);
  canvas.parent('script-box');
  game = new Game();
  player = new Player();
  ship_test = new Ship(w/2, h/2);
  mouse = new Mouse();
  noCursor();
}

function draw() {
  clear();
  noStroke();
  fill(0, 0, 0, 1);
  rect(-10, -10, w + 10, h + 10);
  // fill(40, 200, 40, 1);
  // ellipse(mouse.x, mouse.y, 10, 10);
  // ship_test.launch();
  ship_test.move();
  ship_test.illustrate();
  mouse.illustrate();
}

function mousePressed() {
  ship_test.launch();
}

class Ship {
 constructor(x, y) {
   this.position = new Vector(x, y);
   this.inertia = 0.95;
   this.thrust = new Vector(0, 0);
   this.moving = true;
   this.state = "aiming"; // stopped, hovered, selected, aiming, firing
   this.angle = new Vector(0, 0);
   this.inputted_vectors = []
   this.size = 40;
   this.sprite = loadImage("assets/ship-A4.png");
   this.sprite_top = loadImage("assets/ship-A4-top.png");
   this.sprite_bottom = loadImage("assets/ship-A4-bottom.png");
   this.sprite_sproing = loadImage("assets/sproing-v2.svg");
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
   // if(this.state = "aiming") {
     // if(distance(mouse.x, mouse.y, this.position.x, this.position.y) < this.size/2) {
     //   let m = new Vector(this.position.x - mouse.x, this.position.y - mouse.y);
     //   this.thrust.add(m);
     // }
   // }
   if(this.state == "aiming") {
     this.thrust.x = this.position.x - mouse.x;
     this.thrust.y = this.position.y - mouse.y;
     this.thrust.slow(0.1);
     this.state = "moving";
   }
 }

 move() {
   if(abs(this.thrust.x) + abs(this.thrust.y) > 0.1) {
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
     // this.thrust.zero();
     this.position.add(this.thrust);
     this.state = "moving";
   } else {
     // this.thrust.zero();
     this.state = "aiming";
   }
 }

 stop() {
   this.thrust.zero();
 }

 illustrate() {
   if(this.state == "moving") {
     push();
     translate(this.position.x, this.position.y);
     rotate(xyToAngle(this.thrust.x, this.thrust.y));
     // image(this.sprite, this.position.x - 30, this.position.y - 45, 60, 90);
     // image(this.sprite, -30, -45, 60, 90);
     image(this.sprite_top, -30, -30, 60, 50);
     image(this.sprite_bottom, -30, 20, 60, 40);
     pop();
   } else if(this.state == "aiming") {

     push();
     translate(this.position.x, this.position.y);
     rotate(xyToAngle((this.position.x) - mouse.x, (this.position.y) - mouse.y));
     // image(this.sprite, this.position.x - 30, this.position.y - 45, 60, 90);
     // image(this.sprite, -30, -45, 60, 90);
     image(this.sprite_top, -30, -30, 60, 50);
     image(this.sprite_bottom, -30, distance(this.position.x, this.position.y, mouse.x, mouse.y), 60, 40);
     image(this.sprite_sproing, -27, 20, 50, distance(this.position.x, this.position.y, mouse.x, mouse.y) - 20)
     pop();
   }
   if(distance(this.position.x, this.position.y, mouse.x, mouse.y) < 50) {
     noFill();
     stroke(255);
     text("MOUSEOVER", 20, 20);
   }
   noFill();
   stroke(255);
   text(this.state, 20, 40);
   // text("THRUST X:" + this.thrust.x, 20, 60)
   // text("THRUST Y:" + this.thrust.y, 20, 70)
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
    this.x = mouseX;
    this.y = mouseY;
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
    // get mouse coordinates
    this.x = mouseX;
    this.y = mouseY;
    // animate
    if(frameCount%8 == 1) {
      if(this.frame >= 5) {
        this.frame = 0;
      } else {
        this.frame++;
      }
    }
    // wobble
    if(ship_test.state == "aiming") {
      let d = distance(ship_test.position.x, ship_test.position.y, mouse.x, mouse.y);
      d = pow((d / 20), 1.5);
      let wobble_x = random(-d, d);
      let wobble_y = random(-d, d);
      mouse.x += wobble_x;
      mouse.y += wobble_y;
    }
    image(this.sprites[this.frame], mouse.x - 4, mouse.y - 4, 44*2, 69*2);
    // noStroke();
    // fill(150, 255, 150, 1);
    // ellipse(mouse.x, mouse.y, 20, 20);
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

function xyToAngle(x, y) {
  // https://www.khanacademy.org/math/precalculus/x9e81a4f98389efdf:vectors/x9e81a4f98389efdf:component-form/a/vector-magnitude-and-direction-review
  let angle = 0;
  let additive = 0; // Q1
  if(x < 0) { // Q2 + Q3
    additive = 180;
  } else if (x >= 0 && y < 0) { // Q4
    additive = 360;
  }
  angle = atan(y / x) + additive + 90;
  if(angle > 360) {
    angle -= 360;
  }
  return angle;
}
