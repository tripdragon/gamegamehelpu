

import { Vector3 } from 'three';

const _forceV = new Vector3();


// this version is functional and annoying
// but its easiest when we dont yet know how to super class the top level Object3D
// to give it physics, and just hand rando objects physics lite

// 
// export class physicsObject(){
//   acceleration = new Vector3();
//   velocity = new Vector3();
//   force = new Vector3();
//   acceleration = 1;
//   damping = 1;
// }


// export class physicsObject(){
export class simplePhysics{
  objectPointer = null;
  acceleration = new Vector3();
  velocity = new Vector3();
  force = new Vector3();
  acceleration = 1;
  damping = 1;
  // position = new Vector3();
  
  _forceV = new Vector3();
  
  applyForce(){
    this._forceV.copy(this.force);
    this._forceV.divideScalar(this.mass);
    this.acceleration.add(this._forceV);
    this.velocity.add(this.acceleration);
    this.velocity.multiplyScalar(this.damping);
    this.objectPointer.position.add(this.velocity);
  }
  
  clearAcceleration(){
      this.acceleration.set(0,0,0);
  }

  clearAngularAcceleration(){
      this.angularAcceleration.set(0,0,0);
  }
  
  
  
  update() {

      // this makes it fricken jitter infinitely
      // getFriction(_this.forceWork, _this.selected.velocity, _this.force.coefriction);

      // if(_this.type === "spring"){
      //   this.applySpringForce(_this.selected, _this.force, _this.forceWork, _this.force.damping);
      // }
      // else if (_this.type === "impulse") {
      //   // console.log("¿");
      // }
      this.applyForce();

      // todo: this does not belong here
      // _this.selected.rotateY( _this.selected.velocity.length()* Math.PI * 9);
      // applyAngularForce(_this.selected, _this.angularForceWork, _this.angularForce.damping);


      // More animations states would start here
      // if they were like a cache

      // matOpacity += fadeInRate;
      // _this.selected.setOpacity(matOpacity);

      // materials.forEach
      //   opacity = Math.Clamp(0,1, opacity + rate);
      //
      // spartikles system, bast a few
      // use reverse atractor
      // spin them a bit
      // deltaTime >= lim
      //




      this.clearAcceleration();
      this.clearAngularAcceleration();

      // // if ( Math.abs( _this.selected.velocity.length() ) >= 0.00001) {
      // if ( Math.abs( _this.selected.velocity.length() && _this.selected.angularVelocity.length() ) >= 0.0001) {
      // // if (true) {
      //   // console.log(" reloop ");
      //   _this.loopId = requestAnimationFrame(_this.loopR);
      // }
      // else {
      //   console.log("done??¿¿?¿");
      // }
      // 
      // 
      // // console.log(_this.selected.position);
      // // start it
      // _this.loopR();
  };


}











export function applyForce(wobj, physicsObject){
  _forceV.copy(physicsBlock.force);
  _forceV.divideScalar(mass);
  physicsBlock.acceleration.add(_forceV);
  physicsBlock.velocity.add(physicsBlock.acceleration);
  physicsBlock.velocity.multiplyScalar(physicsBlock.damping);
  wobj.position.add(physicsBlock.velocity);
}
