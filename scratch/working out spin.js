


acceleration = 0;
velocity = new THREE.Vector3(0,0,0);

gravity = 0.4;
r = 1.2;
angle = 0; // do we need the inital angle?
damping = 0.995;

loopId = 0;

function looop() {

  
  acceleration = (-1 * gravity / r) * Math.sin(angle);
  // acceleration = (-1 * 9 / 2) * Math.sin(12);
  
  
  // Standard angular motion algorithm
  velocity.add(acceleration);
  // velocity += acceleration;
  
  angle += velocity.length();
  
  // velocity *= damping;
  velocity.multiplyScalar(damping);

  console.log("angle", angle);
  console.log("x", velocity.x);
  console.log("y", velocity.y);
  console.log("z", velocity.z);

  // clearAcceleration();
  acceleration.set(0,0,0);

  loopId = requestAnimationFrame(looop);

}

cancelAnimationFrame(loopId)
