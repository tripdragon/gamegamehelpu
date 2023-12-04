

import { Object3D , Vector3 } from 'three';

export default class Robot extends Object3D{
      
  // holds values for moving parts to animate
  animationPoses = {};

  walkSpeed = 0.2;
  turnSpeed = 0.2;
  swingSpeed = 0.28;

  constructor(){
    super();
  }
  
  // @dir T: string
  move(dir, _walkSpeed){
    _walkSpeed = _walkSpeed || this.walkSpeed;
    switch(dir){
      case "forward":
        this.translateZ( _walkSpeed );
      break;
      case "backward":
        this.translateZ( -_walkSpeed );
      break;
    }
    this.swingArms();
  }
  
  turn(dir, _turnSpeed){
    _turnSpeed = _turnSpeed || this.turnSpeed;
    switch(dir){
      case "left":
        this.rotation.y += _turnSpeed;
      break;
      case "right":
        this.rotation.y -= _turnSpeed;
      break;
    }
    this.swingArms();
  }
  
  
  
      tempArmLeft = null;
      tempArmRight = null;

      tempLegLeft = null;
      tempLegRight = null;
      
      tVecLeft = new Vector3();
      tVecRight = new Vector3();

      mTime = 0;
      // const swingSpeed = 0.08;
      
  swingArms(){
    
    this.mTime += this.swingSpeed;

    if ( ! this.tempArmLeft ) this.tempArmLeft = this.getObjectByName('arm_l');
    if ( ! this.tempArmRight ) this.tempArmRight = this.getObjectByName('arm_r');
    if ( ! this.tempLegLeft ) this.tempLegLeft = this.getObjectByName('leg_l');
    if ( ! this.tempLegRight ) this.tempLegRight = this.getObjectByName('leg_r');
    
    let tempArmLeft = this.tempArmLeft;
    let tempArmRight = this.tempArmRight;
    let tempLegLeft = this.tempLegLeft;
    let tempLegRight = this.tempLegRight;
    
    
    if (tempArmLeft && tempArmRight) {
    
        let poses = this.animationPoses;
        let walkPoses = poses.walk;
        
        // var pl = player;

        let tVecLeft = this.tVecLeft;
        let tVecRight = this.tVecRight;

        // let gg1 = Math.cos(menuG.walk_tween_driver) * 0.5 + 0.5;
        let gg1 = Math.cos(this.mTime) * 0.5 + 0.5;
        tVecLeft.lerpVectors(walkPoses.armSway.front, walkPoses.armSway.back, gg1);
        tVecRight.lerpVectors(walkPoses.armSway.front, walkPoses.armSway.back, 1-gg1);

        tempArmLeft.rotation.setFromVector3(tVecLeft);
        tempArmRight.rotation.setFromVector3(tVecRight);


        // legs

        // let gg2 = Math.sin(menuG.walk_tween_driver) * 0.5 + 0.5;
        let gg2 = Math.sin(this.mTime) * 0.5 + 0.5;
        tVecLeft.lerpVectors(walkPoses.legSway.front, walkPoses.legSway.back, 1-gg2);
        tVecRight.lerpVectors(walkPoses.legSway.front, walkPoses.legSway.back, gg2);

        tempLegLeft.rotation.setFromVector3(tVecLeft);
        tempLegRight.rotation.setFromVector3(tVecRight);
        
        
    }
    
                
  }
  
  
}
