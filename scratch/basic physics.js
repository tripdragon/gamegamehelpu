

const clearAcceleration = () => {

    this.acceleration.set(0,0,0);
};

const clearAngularAcceleration = () => {

    this.angularAcceleration.set(0,0,0);
};


export function applyAngularForce(wobj, force, damping = 1) {

    _forceAngularV.copy(force);
    _forceAngularV.divideScalar(wobj.mass);
    wobj.angularAcceleration.add(_forceAngularV);
    wobj.angularVelocity.add(wobj.angularAcceleration);
    wobj.angularVelocity.multiplyScalar(damping);

    // this is guessing since .rotation is an T: Euler and does not follow vector .add
    // since they have order options, default being XYZ
    wobj.rotation.x += wobj.angularVelocity.x;
    wobj.rotation.y += wobj.angularVelocity.y;
    wobj.rotation.z += wobj.angularVelocity.z;
}

export function applyForce(wobj, force, damping = 1){
  _forceV.copy(force);
  _forceV.divideScalar(wobj.mass);
  wobj.acceleration.add(_forceV);
  wobj.velocity.add(wobj.acceleration);
  wobj.velocity.multiplyScalar(damping);
  wobj.position.add(wobj.velocity);
}



_this.loopR = function() {

    // this makes it fricken jitter infinitely
    // getFriction(_this.forceWork, _this.selected.velocity, _this.force.coefriction);

    if(_this.type === "spring"){
      applySpringForce(_this.selected, _this.force, _this.forceWork, _this.force.damping);
    }
    else if (_this.type === "impulse") {
      // console.log("¿");
      applyForce(_this.selected, _this.forceWork, _this.force.damping);
    }

    // todo: this does not belong here
    // _this.selected.rotateY( _this.selected.velocity.length()* Math.PI * 9);
    applyAngularForce(_this.selected, _this.angularForceWork, _this.angularForce.damping);


    // More animations states would start here
    // if they were like a cache

    matOpacity += fadeInRate;
    _this.selected.setOpacity(matOpacity);

    // materials.forEach
    //   opacity = Math.Clamp(0,1, opacity + rate);
    //
    // spartikles system, bast a few
    // use reverse atractor
    // spin them a bit
    // deltaTime >= lim
    //




    _this.selected.clearAcceleration();
    _this.selected.clearAngularAcceleration();

    // if ( Math.abs( _this.selected.velocity.length() ) >= 0.00001) {
    if ( Math.abs( _this.selected.velocity.length() && _this.selected.angularVelocity.length() ) >= 0.0001) {
    // if (true) {
      // console.log(" reloop ");
      _this.loopId = requestAnimationFrame(_this.loopR);
    }
    else {
      console.log("done??¿¿?¿");
    }


    // console.log(_this.selected.position);
    // start it
    _this.loopR();
};
