
class Pendulum {
    location; // Location of bob
    origin; // Location of arm origin
    r; // Length of arm
    angle; // Pendulum arm angle
    aVelocity; // Angle velocity
    aAcceleration; // Angle acceleration
    damping; // Arbitrary damping amount
    constructor(origin_, r_) {
        this.origin = origin_.copy();
        this.location = new p5.Vector();
        this.r = r_;
        this.angle = Math.PI / 4;
      
        this.aVelocity = 0.02;
        
        this.aAcceleration = 0.0;
        this.damping = 0.9995;
    }
    go() {
        this.update();
        this.display();
    }
    update() {
        let gravity = 0.4;
        this.aAcceleration = ((-1 * gravity) / this.r) * sin(this.angle);
        this.aVelocity += this.aAcceleration;
        this.angle += this.aVelocity;
        this.aVelocity *= this.damping;
    }
    display() {
        this.location.set(
            this.r * sin(this.angle),
            this.r * cos(this.angle),
            0
        );
      // console.log(this.angle);
        this.location.add(this.origin);
        stroke(0);
        line(this.origin.x, this.origin.y, this.location.x, this.location.y);
        fill(175);
        ellipse(this.location.x, this.location.y, 26, 26);
    }
}


function setup() {
    createCanvas(640, 360);
    p = new Pendulum(new p5.Vector(width / 2, 10), 125);
}
function draw() {
    background(255);
    p.go();
}

let p = new Pendulum(new p5.Vector(0.5,0.5), 12);
