

import { Vector3 } from "three";

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
  angularAcceleration = new Vector3();
  velocity = new Vector3();
  force = new Vector3(); // this acts as a cache
  damping = 1;
  friction = 0;
  mass = 1;
  // position = new Vector3();
  
  // friction is really low values 0.01
  constructor(objectPointer = null, force = new Vector3(), mass = 1, damping = 1, friction = 0){
    this.objectPointer = objectPointer;
    this.force.copy(force);
    this.damping = damping;
    this.friction = friction;
    this.mass = mass;
  }
  
  applyForce(forceIn){
    this.force.copy(forceIn);
    this.force.divideScalar(this.mass);
    this.acceleration.add(this.force);
    
    // this.velocity.add(this.acceleration);
    // this.velocity.multiplyScalar(this.damping);
    // console.log("this.velocity", this.velocity);
    // this.objectPointer.position.add(this.velocity);
  }
  
  // applyExternalForce(forceIn){
  //   this.applyForce(forceIn);
  //   this.clearAcceleration();
  // }
  
  updateForce(){
    // this.applyForce(this.force);
    
    // this.force.copy(forceIn);
    // this.force.divideScalar(this.mass);
    // this.acceleration.add(this.force);
    
    this.velocity.add(this.acceleration);
    this.velocity.multiplyScalar(this.damping);
    
    // console.log("this.velocity", this.velocity);
    this.objectPointer.position.add(this.velocity);
    
  }
  
  clearAcceleration(){
    this.acceleration.set(0,0,0);
  }

  clearAngularAcceleration(){
    this.angularAcceleration.set(0,0,0);
  }
  
  
  updateFriction(){
    
    this.force.copy(this.velocity);
    this.force.multiplyScalar(-1);
    this.force.normalize();
    this.force.multiplyScalar(this.friction); // friction coefficient
    this.applyForce(this.force);
    
  }
  
  
  update() {
    // console.log("force",this.force);
    // this makes it fricken jitter infinitely
    // getFriction(_this., _this.selected.velocity, _this.force.coefriction);

    // if(_this.type === "spring"){
    //   this.applySpringForce(_this.selected, _this.force, _this.forceWork, _this.force.damping);
    // }
    // else if (_this.type === "impulse") {
    //   // console.log("¿");
    // }
    // this.applyForce();
      
    // this.updateFriction();
    this.updateForce();
      

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
  }


}







// 
// 
// 
// 
// export function applyForce(wobj, physicsObject){
//   _forceV.copy(physicsBlock.force);
//   _forceV.divideScalar(mass);
//   physicsBlock.acceleration.add(_forceV);
//   physicsBlock.velocity.add(physicsBlock.acceleration);
//   physicsBlock.velocity.multiplyScalar(physicsBlock.damping);
//   wobj.position.add(physicsBlock.velocity);
// }
