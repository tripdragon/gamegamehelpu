
import { Group } from 'three';
import { simplePhysics } from './simplePhysics';

export class PhysicsBodySimple extends Group{
  
  isPhysicsBodySimple = true;
  isPhysicsBody = true;
  
  
  physics;
  target;
  
  constructor(target = null, force = new Vector3(), mass = 1, damping = 1, friction = 0){
    super();
    
    this.target = target;
    
    this.physics = new simplePhysics(this, force, mass, damping, friction);
    
    if (target) {
      this.add(target)
    }
  }
  
  // basic form of the other object
  onCollide(other){}
  
}

// three fiber Class constructor  cannot be invoked without 'new'
