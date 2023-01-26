var yin = [];
var yang = [];
var friction = 0.99;
var pieceSize = 20;
var framesPerTurn = 90;
var frameCounter = framesPerTurn;
var playerTurn = 1;
var pieceSelector = 0;
var jetSelector = 0;
var paused = false;

function setup() {
  // console.log(pow(5, 2));
  colorMode(RGB, 255, 255, 255, 1);
  w = 480;
  h = w;
  var canvas = createCanvas(w, h);
  canvas.parent('script-box');
  // background(20);
  for(let q=0; q<8; q++) {
    yang.push(new Piece('pawn', 1, q*60 + 30, h - 100, yang.length));
    yin.push(new Piece('pawn', -1, q*60 + 30, 100, yin.length));
  }
  yang.push(new Piece('rook', 1, 30, h - 30,  yang.length));
  yang.push(new Piece('bishop', 1, 150, h - 30, yang.length));
  yang.push(new Piece('queen', 1, 240, h - 30, yang.length));
  yang.push(new Piece('bishop', 1, 330, h - 30, yang.length));
  yang.push(new Piece('rook', 1, 450, h - 30, yang.length));
  yin.push(new Piece('rook', -1, 30, 30,  yin.length));
  yin.push(new Piece('bishop', -1, 150, 30, yin.length));
  yin.push(new Piece('queen', -1, 240, 30, yin.length));
  yin.push(new Piece('bishop', -1, 330, 30, yin.length));
  yin.push(new Piece('rook', -1, 450, 30, yin.length));
  background(200);
}

function draw() {
  // background(20);
  if(frameCounter > 0) {
    paused = false;
    frameCounter--;
  } else {
    paused = true;
  }
  if(!paused) {
    noStroke();
    fill(0, 0, 0, 0.03);
    rect(-10, -10, w + 10, h + 10);
    for(let i=0; i<yin.length; i++) {
      yin[i].meditate();
      yin[i].gravitate();
      yin[i].accelerate();

      yang[i].meditate();
      yang[i].gravitate();
      yang[i].accelerate();

      yin[i].illustrate();
      yang[i].illustrate();
    }
  }
  for(let i=0; i<yin.length; i++) {
    yin[i].illustrate();
    yang[i].illustrate();
  }
}

function angleToUnitVector(a) {
  let r = (-a * PI) / 180;
  v = new Vector(cos(r), sin(r));
  return v;
}

function distance(x1, y1, x2, y2) {
  let d = 0;
  d = sqrt(pow(x1 - x2, 2) + pow(y1 - y2, 2));
  return d;
}

class Vector {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
  }

  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
  }

  mult(m) {
    this.x = this.x * m;
    this.y = this.y * m;
  }

  friction(f) {
    this.x = this.x * f;
    this.y = this.y * f;
  }
}

class Piece {
  constructor(rank, flip, x, y, id) {
    this.firing = false;
    this.flip = flip;
    this.id = id;
    this.alive = true;
    // console.log(id);
    this.coordinates = new Vector(x, y);
    this.delta = new Vector(0, 0);
    if(rank == 'pawn') {
      this.jets = [angleToUnitVector(flip * 50), angleToUnitVector(flip * 90), angleToUnitVector(flip * 130)];
      this.propulsion = 0.03;
    } else if(rank == 'rook') {
      this.jets = [angleToUnitVector(flip * 360), angleToUnitVector(flip * 90), angleToUnitVector(flip * 180), angleToUnitVector(flip * 270)];
      this.propulsion = 0.05;
    } else if(rank == 'queen') {
      this.jets = [angleToUnitVector(flip * 45), angleToUnitVector(flip * 90), angleToUnitVector(flip * 135), angleToUnitVector(flip * 180), angleToUnitVector(flip * 225), angleToUnitVector(flip * 270), angleToUnitVector(flip * 315), angleToUnitVector(flip * 360)];
      this.propulsion = 0.07;
    } else if(rank == 'bishop') {
      this.jets = [angleToUnitVector(flip * 45), angleToUnitVector(flip * 135), angleToUnitVector(flip * 225), angleToUnitVector(flip * 315)];
      this.propulsion = 0.05;
    }
    this.jetNav = 1; // 0 = first jet, 1 = second jet, etc
    this.jetPower = new Vector(0, 0);
    // console.log(this.jets[0]);

  }

  meditate() {
    // if(random() <= 0.03) {
    //   this.jetNav = int(random(0, this.jets.length));
    //   // this.delta += this.jets[this.jetNav];
    // }
    // this.delta.friction(friction);
    // this.power = constrain(this.power + 0.01, 0, 1);
  }

  gravitate() {
    if(this.alive) {
      // bounce off boundaries, stay in bounds
      if(this.coordinates.x > w - pieceSize/2) {
        this.delta.x = this.delta.x * -1;
        this.coordinates.x = w - pieceSize/2;
      } else if(this.coordinates.x < pieceSize/2) {
        this.delta.x = this.delta.x * -1;
        this.coordinates.x = pieceSize/2;
      }
      if(this.coordinates.y > h - pieceSize/2) {
        this.delta.y = this.delta.y * -1;
        this.coordinates.y = h - pieceSize/2;
      } else if(this.coordinates.y < pieceSize/2) {
        this.delta.y = this.delta.y * -1;
        this.coordinates.y = pieceSize/2;
      }
      // gravitate away from teammates and towards enemies
      // for(let i=0; i<yin.length; i++) {
      //   if(i != this.id) {
      //     // let distance = yin[i].coordinates.x;
      //   }
      // }
      // death or bounce? depends
      for(let i=0; i<yin.length; i++) {
        if(this.flip == -1 && this.id == i) {
          // hello, self
        } else {
          if(distance(this.coordinates.x, this.coordinates.y, yin[i].coordinates.x, yin[i].coordinates.y) < pieceSize && yin[i].alive) {
            if(this.flip == -1) {
              // this.delta.add(yin[i].delta);
              // this.delta.mult(0.5);
            } else if(playerTurn == -1) {
              // this.delta.add(yin[i].delta);
              // this.delta.mult(0.5);
            } else {
              this.alive = false;
              // console.log("DEAD");
            }
          }
        }
      }
      for(let i=0; i<yang.length; i++) {
        if(this.flip == 1 && this.id == i) {
          // hello, self
        } else {
          if(distance(this.coordinates.x, this.coordinates.y, yang[i].coordinates.x, yang[i].coordinates.y) < pieceSize && yang[i].alive) {
            if(this.flip == 1) {
              // this.delta.add(yang[i].delta);
              // this.delta.mult(0.5);
            } else if(playerTurn == 1) {
              // this.delta.add(yang[i].delta);
              // this.delta.mult(0.5);
            } else {
              this.alive = false;
              // console.log("DEAD");
            }
          }
        }
      }
    }
  }

  accelerate() {
    if(this.firing) {
      this.jetPower = new Vector(this.jets[this.jetNav].x, this.jets[this.jetNav].y);
      this.jetPower.mult(this.propulsion * (frameCounter / framesPerTurn));
      this.delta.add(this.jetPower);
    }
    this.coordinates.add(this.delta);
    // console.log(this.delta);
    this.delta.mult(friction);
  }

  illustrate() {
    if(this.alive) {
      noFill();
      for(let i=0; i<this.jets.length; i++) {
        if(this.jetNav == i && this.firing && !paused) {
          strokeWeight(8);
          if(this.flip == 1) {
            stroke(240, 100, 255, 1);
          } else {
            stroke(255, 220, 110, 1);
          }
        } else {
          if(jetSelector == i && pieceSelector == this.id && paused && playerTurn == this.flip) {
            strokeWeight(6);
            stroke(255, 255, 255, 1);
          } else {
            strokeWeight(8);
            if(this.flip == 1) {
              stroke(100, 100, 255, 0.05);
            } else {
              stroke(255, 130, 10, 0.05);
            }
          }
        }
        line(this.coordinates.x, this.coordinates.y, this.coordinates.x + this.jets[i].x*-20, this.coordinates.y + this.jets[i].y*-20)
      }
      noStroke();
      if(this.flip == 1) {
        fill(70, 70, 225, 1);
      } else {
        fill(225, 100, 0, 1);
      }
      ellipse(this.coordinates.x, this.coordinates.y, pieceSize, pieceSize);
      if(playerTurn == this.flip) {
        if(pieceSelector == this.id && paused) {
          fill(255, 255, 255, 1);
          ellipse(this.coordinates.x, this.coordinates.y, pieceSize*0.66, pieceSize*0.66);
        }
      }
    }
  }
}

function keyPressed() {
  if(keyCode == ENTER && paused) {
    for(let i=0; i<yin.length; i++) {
      yin[i].firing = false;
    }
    for(let i=0; i<yang.length; i++) {
      yang[i].firing = false;
    }
    if(playerTurn == 1) {
      yang[pieceSelector].firing = true;
      yang[pieceSelector].jetNav = jetSelector;
    } else if(playerTurn == -1){
      yin[pieceSelector].firing = true;
      yin[pieceSelector].jetNav = jetSelector;
    }
    frameCounter = framesPerTurn;
    background(200);
    pieceSelector = 0;
    jetSelector = 0;
    playerTurn = playerTurn * -1;
  } else if(keyCode == RIGHT_ARROW && paused) {
    if(pieceSelector >= yin.length - 1) {
      pieceSelector = 0;
    } else {
      pieceSelector++;
    }
    jetSelector = 0;
  } else if(keyCode == LEFT_ARROW && paused) {
    if(pieceSelector <= 0) {
      pieceSelector = yin.length - 1;
    } else {
      pieceSelector--;
    }
    jetSelector = 0;
  } else if(keyCode == DOWN_ARROW && paused) {
    if(jetSelector <= 0) {
      jetSelector = yin[pieceSelector].jets.length - 1;
    } else {
      jetSelector--;
    }
  } else if(keyCode == UP_ARROW && paused) {
    if(jetSelector >= yin[pieceSelector].jets.length - 1) {
      jetSelector = 0;
    } else {
      jetSelector++;
    }
  }
  // console.log(jetSelector);
}
