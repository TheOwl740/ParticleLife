//jshint maxerr: 10000

//PRIMITIVE VARIABLES
let accuracy = 3;
let buttonCount = 0;

//OBJECTS AND CLASS INSTANCES
const squareButton = new Polygon([
  new Tri([
    new Vector2(0, 0),
    new Vector2(40, 0),
    new Vector2(40, -40)
  ], 3),
  new Tri([
    new Vector2(40, -40),
    new Vector2(0, -40),
    new Vector2(0, 0)
  ], 3)
], true, false);

const icons = {
  eraser: new Image(),
  reload: new Image(),
  magnify: new Image(),
  shrink: new Image()
};
icons.eraser.src = "eraser.png";
icons.reload.src = "reload.png";
icons.magnify.src = "magnify.png";
icons.shrink.src = "shrink.png";

const particles = [
];

const rules = {
  colorMatrix: [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  repulsionFactor: -10
};

const rectButton = new Polygon([
  new Tri([
    new Vector2(0, 0),
    new Vector2(80, 0),
    new Vector2(80, -40)
  ], 3),
  new Tri([
    new Vector2(80, -40),
    new Vector2(0, -40),
    new Vector2(0, 0)
  ], 3)
], true, false);

//CLASSES
class Particle {
  constructor(transform, color, radius) {
    this.p = transform;
    this.v = new Vector2(0, 0);
    this.r = radius;
    this.color = color;
    this.id = Math.random().toString().slice(2);
  }
  update() {
    this.v = e.roundVector(e.addVector(this.v, calcVelocity(this)).multiply(0.5), accuracy);
    if(this.v.x > 10 || this.v.y > 10) {
      this.v.x **= 0.9;
      this.v.y **= 0.9;
    }
    this.p = e.roundVector(e.addVector(this.p, this.v), accuracy);
    switch(this.color) {
      case 0:
        e.cx.fillStyle = "#0000FF";
        break;
      case 1:
        e.cx.fillStyle = "#FF0000";
        break;
      case 2:
        e.cx.fillStyle = "#009900";
        break;
      case 3:
        e.cx.fillStyle = "#FFFF00";
    }
    e.cx.fillRect(this.p.x - (this.r / 2), this.p.y - (this.r / 2), this.r, this.r);
    if(this.p.x - (this.r / 2) > e.w - this.r) {
      e.cx.fillRect(this.p.x - (this.r / 2) - e.w, this.p.y - (this.r / 2), this.r, this.r);
    }
    if(this.p.x - (this.r / 2) < this.r) {
      e.cx.fillRect(this.p.x - (this.r / 2) + e.w, this.p.y - (this.r / 2), this.r, this.r);
    }
    if(this.p.y - (this.r / 2) < (e.h * -1) + this.r) {
      e.cx.fillRect(this.p.x - (this.r / 2), this.p.y - (this.r / 2) + e.h, this.r, this.r);
    }
    if(this.p.y - (this.r / 2) > this.r * -1) {
      e.cx.fillRect(this.p.x - (this.r / 2), this.p.y - (this.r / 2) - e.h, this.r, this.r);
    }
    if(this.p.x < 0) {
      this.p.x = e.w;
    }
    if(this.p.x > e.w) {
      this.p.x = 0;
    }
    if(this.p.y > 0) {
      this.p.y = e.h * -1;
    }
    if(this.p.y < e.h * -1) {
      this.p.y = 0;
    }
  }
}

//FUNCTIONS
function calcVelocity(particle) {
  let [f, fv] = [0, new Vector2(0, 0)];
  for(i = 0; i < particles.length; i++) {
    if(particle.id !== particles[i].id) {
      let [dx, dy] = [particles[i].p.x - particle.p.x, particles[i].p.y - particle.p.y];
      if(Math.abs(dx) > e.w - (particles[i].r * 25)) {
        if(particle.p.x > e.w / 2) {
          dx = particles[i].p.x - (particle.p.x - e.w);
        } else {
          dx = particles[i].p.x - (particle.p.x + e.w);
        }
      }
      if(Math.abs(dy) > e.h - (particles[i].r * 25)) {
        if(particle.p.y < e.h / -2) {
          dy = particles[i].p.y - (particle.p.y + e.h);
        } else {
          dy = particles[i].p.y - (particle.p.y - e.h);
        }
      }
      let d = ((dx ** 2) + (dy ** 2)) ** 0.5;
      if(d > 0) {
        if(d > (particles[i].r * 3) && d < (particles[i].r * 25)) {
          f = (rules.colorMatrix[particle.color][particles[i].color] * (particles[i].r / 4)) / d;
          fv = e.addVector(fv, new Vector2(f * dx, f * dy));
        } else if(d <= 10) {
          f = rules.repulsionFactor / (d ** 2) > -10 ? rules.repulsionFactor / (d ** 2) : -10;
          fv = e.addVector(fv, new Vector2(f * dx, f * dy));
        }
      }
    }
  }
  if(e.mouse.clicking) {
    let [dx, dy] = [e.mouse.absolute.x - particle.p.x, e.mouse.absolute.y - particle.p.y];
    if(Math.abs(dx) > e.w - 100) {
      if(particle.p.x > e.w / 2) {
        dx = e.mouse.absolute.x - (particle.p.x - e.w);
      } else {
        dx = e.mouse.absolute.x - (particle.p.x + e.w);
      }
    }
    if(Math.abs(dy) > e.h - 100) {
      if(particle.p.y < e.h / -2) {
        dy = e.mouse.absolute.y - (particle.p.y + e.h);
      } else {
        dy = e.mouse.absolute.y - (particle.p.y - e.h);
      }
    }
    let d = ((dx ** 2) + (dy ** 2)) ** 0.5;
    if(d < 100) {
      f = -100 / (d ** 2);
      fv = e.addVector(fv, new Vector2(f * dx, f * dy));
    }
  }
  return fv;
}

function setRules(repulsionFactor, sameColorAttraction) {
  rules.repulsionFactor = repulsionFactor;
  for(a = 0; a < 4; a++) {
    for(aa = 0; aa < 4; aa++) {
      rules.colorMatrix[a][aa] = e.randomNum(-10, 10) / 100;
      if(sameColorAttraction !== false) {
        if(a === aa) {
          rules.colorMatrix[a][aa] = sameColorAttraction;
        }
      }
    }
  }
}

function setToPreset(preset) {
  switch(preset) {
    case 1:
      for(a = 0; a < 4; a++) {
        for(aa = 0; aa < 4; aa++) {
          rules.colorMatrix[a][aa] = 0;
        }
      }
      break;
    case 2:
      for(a = 0; a < 4; a++) {
        for(aa = 0; aa < 4; aa++) {
          rules.colorMatrix[a][aa] = -0.05;
        }
      }
      rules.repulsionFactor = -10;
      break;
    case 3:
      for(a = 0; a < 4; a++) {
        for(aa = 0; aa < 4; aa++) {
          if(a === aa) {
            rules.colorMatrix[a][aa] = 0.1;
          } else {
            rules.colorMatrix[a][aa] = -0.05;
          }
        }
      }
      rules.repulsionFactor = -10;
      break;
    case 4:
      rules.colorMatrix = [
        [0.1,0.05,-0.05,0.1],
        [-0.05,0.1,0.05,0.1],
        [0.05,-0.05,0.1,0.1],
        [0.05,0.05,0.05,0.1]
      ];
      rules.repulsionFactor = -10;
      break;
    case 5:
      rules.colorMatrix = [
        [0.08,-0.02,-0.02,0.03],
        [-0.09,0.06,0.04,0.1],
        [0.01,0.02,0,0.1],
        [0.07,0.08,-0.01,0]
      ];
      rules.repulsionFactor = -10;
      break;
    case 6:
      rules.colorMatrix = [
        [0.02,0.02,-0.18,0.1],
        [-0.14,0.2,-0.04,0.14],
        [0.04,0.18,-0.2,-0.06],
        [-0.18,-0.14,-0.08,-0.18]
      ];
      rules.repulsionFactor = -10;
      break;
    case 7:
      rules.colorMatrix = [
        [-0.03,0.02,0.08,-0.06],
        [0.07,-0.01,0.05,-0.04],
        [-0.09,0.09,0.1,-0.04],
        [0.02,0.1,-0.07,0.03]
      ];
      rules.repulsionFactor = -10;
      break;
    case 8:
      rules.colorMatrix = [
        [0.01,0.08,-0.08,0.09],
        [-0.07,-0.05,0.06,0.07],
        [0.06,-0.05,0.01,0.02],
        [-0.06,0,0.03,0.08]
      ];
      rules.repulsionFactor = -10;
      break;
    case 9:
      rules.colorMatrix = [
        [0.08,-0.02,0.1,0.05],
        [-0.1,-0.03,0.03,0.01],
        [0,0.09,0.1,0.1],
        [0.09,-0.09,0,0.02]
      ];
      rules.repulsionFactor = -10;
      break;
  }
}

function clearParticles() {
  particles.splice(0, particles.length);
}

function generatePreset() {
  return `rules.colorMatrix=[[${rules.colorMatrix[0].toString()}],[${rules.colorMatrix[1].toString()}],[${rules.colorMatrix[2].toString()}],[${rules.colorMatrix[3].toString()}]];rules.repulsionFactor=${rules.repulsionFactor};`;
}

function addParticles(number, color, location, baseS, minS, maxS) {
  for(b = 0; b < number; b++) {
    particles.push(new Particle(location === null ? new Vector2(e.randomNum(0, e.w), -1 * e.randomNum(0, e.h)) : location, color, baseS + (e.randomNum(minS * 10, maxS * 10) / 10)));
  }
}

function bc(count) {
  if(e.mouse.clicking && buttonCount > count) {
    buttonCount = 0;
    return true;
  } else {
    return false;
  }
}

function drawHud() {
  if(e.mouse.absolute.y < -120) {
    e.cx.globalAlpha = 0.2;
  } else {
    e.cx.globalAlpha = 1;
  }
  e.cx.fillStyle = "#888888";
  e.cx.fillRect(0, 0, 100, -100);
  e.cx.fillStyle = "#0000FF";
  e.cx.fillRect(25, -5, 15, -15);
  e.cx.fillStyle = "#FF0000";
  e.cx.fillRect(40, -5, 15, -15);
  e.cx.fillStyle = "#009900";
  e.cx.fillRect(55, -5, 15, -15);
  e.cx.fillStyle = "#FFFF00";
  e.cx.fillRect(70, -5, 15, -15);
  e.cx.fillStyle = "#0000FF";
  e.cx.fillRect(5, -25, 15, -15);
  e.cx.fillStyle = "#FF0000";
  e.cx.fillRect(5, -40, 15, -15);
  e.cx.fillStyle = "#009900";
  e.cx.fillRect(5, -55, 15, -15);
  e.cx.fillStyle = "#FFFF00";
  e.cx.fillRect(5, -70, 15, -15);
  
  for(c = 0; c < rules.colorMatrix.length; c++) {
    for(cc = 0; cc < rules.colorMatrix[0].length; cc++) {
      if(rules.colorMatrix[c][cc] < 0) {
        e.cx.fillStyle = `hsl(0, ${rules.colorMatrix[c][cc] * -1000}%, 50%)`;
      } else if(rules.colorMatrix[c][cc] > 0) {
        e.cx.fillStyle = `hsl(128, ${rules.colorMatrix[c][cc] * 1000}%, 50%)`;
      } else {
        e.cx.fillStyle = "#888888";
      }
      e.cx.fillRect(25 + (cc * 15), -25 - (c * 15), 15, -15);
    }
  }
  
  //rectangle buttons
  e.cx.fillStyle = "#888888";
  e.cx.fillRect(105, -5, 80, -40);
  e.renderText(new Vector2(105, -5), new Text("Trebuchet MS", "Save", 9, 30, 30, false, false), new FillRenderer("white", null, e.cx.globalAlpha, 0));
  e.cx.fillRect(190, -5, 80, -40);
  e.renderText(new Vector2(190, -5), new Text("Trebuchet MS", "Load", 9, 30, 30, false, false), new FillRenderer("white", null, e.cx.globalAlpha, 0));
  e.cx.fillRect(275, -5, 80, -40);
  e.renderText(new Vector2(275, -5), new Text("Trebuchet MS", "Preset", 5, 28, 25, false, false), new FillRenderer("white", null, e.cx.globalAlpha, 0));
  
  //close window button
  e.cx.fillStyle = "#888888";
  e.cx.fillRect(360, -5, 80, -40);
  e.renderText(new Vector2(360, -5), new Text("Trebuchet MS", "Close", 5, 30, 30, false, false), new FillRenderer("white", null, e.cx.globalAlpha, 0));
  if(e.detectCollision(e.mouse.absolute, null, new Vector2(360, -5), rectButton) && e.mouse.clicking) {
    window.close();
  }
  
  //square buttons
  e.cx.fillStyle = "#BBBBBB";
  e.cx.fillRect(105, -50, 40, -40);
  e.renderImage(new Vector2(105, -50), new ImageRenderer(icons.eraser, e.cx.globalAlpha, 20, -20, 30, 20, false, false, true, false));
  if(e.detectCollision(e.mouse.absolute, null, new Vector2(105, -50), squareButton) && bc(20)) {
    clearParticles();
  }
  e.cx.fillRect(150, -50, 40, -40);
  e.renderImage(new Vector2(150, -50), new ImageRenderer(icons.reload, e.cx.globalAlpha, 20, -20, 35, 35, false, false, true, false));
  if(e.detectCollision(e.mouse.absolute, null, new Vector2(150, -50), squareButton) && bc(20)) {
    setRules(-10, false);
  }
  e.cx.fillRect(195, -50, 40, -40);
  e.cx.fillStyle = "#0000FF";
  e.cx.fillRect(210, -55, 10, -30);
  e.cx.fillRect(200, -65, 30, -10);
  if(e.detectCollision(e.mouse.absolute, null, new Vector2(195, -50), squareButton) && bc(20)) {
    addParticles(50, 0, null, 4, 0, 0);
  }
  e.cx.fillStyle = "#BBBBBB";
  e.cx.fillRect(240, -50, 40, -40);
  e.cx.fillStyle = "#FF0000";
  e.cx.fillRect(255, -55, 10, -30);
  e.cx.fillRect(245, -65, 30, -10);
  if(e.detectCollision(e.mouse.absolute, null, new Vector2(240, -50), squareButton) && bc(20)) {
    addParticles(50, 1, null, 4, 0, 0);
  }
  e.cx.fillStyle = "#BBBBBB";
  e.cx.fillRect(285, -50, 40, -40);
  e.cx.fillStyle = "#009900";
  e.cx.fillRect(300, -55, 10, -30);
  e.cx.fillRect(290, -65, 30, -10);
  if(e.detectCollision(e.mouse.absolute, null, new Vector2(285, -50), squareButton) && bc(20)) {
    addParticles(50, 2, null, 4, 0, 0);
  }
  e.cx.fillStyle = "#BBBBBB";
  e.cx.fillRect(330, -50, 40, -40);
  e.cx.fillStyle = "#FFFF00";
  e.cx.fillRect(345, -55, 10, -30);
  e.cx.fillRect(335, -65, 30, -10);
  if(e.detectCollision(e.mouse.absolute, null, new Vector2(330, -50), squareButton) && bc(20)) {
    addParticles(50, 3, null, 4, 0, 0);
  }
  e.cx.fillStyle = "#BBBBBB";
  e.cx.fillRect(375, -50, 40, -40);
  e.renderImage(new Vector2(375, -50), new ImageRenderer(icons.magnify, e.cx.globalAlpha, 20, -20, 35, 35, false, false, true, false));
  if(e.detectCollision(e.mouse.absolute, null, new Vector2(375, -50), squareButton) && bc(20)) {
    for(a = 0; a < 4; a++) {
      for(aa = 0; aa < 4; aa++) {
        rules.colorMatrix[a][aa] *= 2;
      }
    }
  }
  e.cx.fillRect(420, -50, 40, -40);
  e.renderImage(new Vector2(420, -50), new ImageRenderer(icons.shrink, e.cx.globalAlpha, 20, -20, 35, 35, false, false, true, false));
  if(e.detectCollision(e.mouse.absolute, null, new Vector2(420, -50), squareButton) && bc(20)) {
    for(a = 0; a < 4; a++) {
      for(aa = 0; aa < 4; aa++) {
        rules.colorMatrix[a][aa] /= 2;
      }
    }
  }
  e.cx.globalAlpha = 1;
}

//PRIMARY GAME LOOP
function update() {
  buttonCount++;
  e.clearCanvas(new FillRenderer("black", null, 1, 0));
  for(r = 0; r < particles.length; r++) {
    particles[r].update();
  }
  drawHud();
}

//KEYPRESS FUNCTIONS
document.addEventListener("keydown", (eObject) => {
  //number key detection
  if(!isNaN(Number(eObject.key))) {
    
    //save matrix
    if(e.detectCollision(e.mouse.absolute, null, new Vector2(105, -5), rectButton)) {
      localStorage.setItem(eObject.key, JSON.stringify(rules.colorMatrix));
      
    //load saved
    } else if(e.detectCollision(e.mouse.absolute, null, new Vector2(190, -5), rectButton) && JSON.parse(localStorage.getItem(eObject.key)) !== null) {
      rules.colorMatrix = JSON.parse(localStorage.getItem(eObject.key));
      
    //load preset
    } else if(e.detectCollision(e.mouse.absolute, null, new Vector2(275, -5), rectButton)) {
      setToPreset(Number(eObject.key));
    }
  }
});

//INITIAL SETUP
const interval = setInterval(update, 10);

setRules(-10, false);

addParticles(200, 0, null, 4, 0, 0);
addParticles(200, 1, null, 4, 0, 0);
addParticles(200, 2, null, 4, 0, 0);
addParticles(200, 3, null, 4, 0, 0);