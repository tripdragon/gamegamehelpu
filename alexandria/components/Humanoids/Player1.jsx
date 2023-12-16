import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


import { Vector3, Euler, Object3D } from 'three';
import Robot from './Robot.js';


import PhysicsBodySimpleCo from "../../simplePhysics/PhysicsBodySimpleCo";

import useKeyboard from '../useKeyboard';

// THIS UP UP UP has to be fixed
import { PhysicsGrapth1 } from "../../../Logics/PhysicsGrapth1";


// above note
// REF's SUCKSORS
// https://stackoverflow.com/questions/71835726/how-can-i-use-forwardref-in-react-component
// and forwardRef

const pi075 = Math.PI * 2 * 0.75;


class Player extends Robot{
  isPlayer = true;
  constructor(){
    super();
  }
  
}


function Player1(props, ref) {


    const gg = new Player();
    
    // these are hard fed from the debugger tools
    gg.animationPoses = {
      walk : {
        // this might actually use an axis rotation instead of the eulers
        armSway : {front: new Vector3(1.91008833338259, 0, 0 ), back: new Vector3( 4.68725623915597, 0, 0 ) },
        legSway : {front: new Vector3(1.91008833338259, pi075, 0 ), back: new Vector3( 4.68725623915597, pi075, 0 ) }
      }
    }
    
    const datas = {
      thisRef : useRef(),
      tempRef: ref,
      walkSpeed : useRef(0.1),
      turnSpeed : useRef(0.1),
      playerRef : useRef(),
      colliderRef : useRef()
    }
    
    const keyMap = useKeyboard();
    
    useEffect(() => {
      if (datas.tempRef) {
        datas.tempRef.current = datas.thisRef.current;
      }
      
      // this might should be in something else to beable to forget to run
      datas.colliderRef.current.geometry.computeBoundingBox();
      
      PhysicsGrapth1.add(datas.thisRef);
    });



    // how to move this into a componenet or such ecs
    // @dir T: string
    // use .call(ref, 124324435346)
    function move(dir, walkSpeed = 1){
      
      switch(dir){
        case "forward":
          this.translateZ( walkSpeed );
        break;
        case "backward":
          this.translateZ( -walkSpeed );
        break;
      }
      datas.playerRef.current.swingArms();
    }
    
    
    // // use .call(ref, 124324435346)
    function turn(dir, turnSpeed = 1){
      switch(dir){
        case "left":
          this.rotation.y += turnSpeed;
        break;
        case "right":
          this.rotation.y -= turnSpeed;
        break;
      }
      datas.playerRef.current.swingArms();
    }
    



    // Keys are now here instead of the main from controller
    // BUT this should instead listen to an AXIS object SOOMEWHERE
    // but need to get on with it!!!
    useFrame( (state, delta) => {
      if( keyMap['KeyW'] ){
        move.call(datas.thisRef.current, "forward", datas.walkSpeed.current);
      }
      if( keyMap['KeyS']){
        move.call(datas.thisRef.current, "backward", datas.walkSpeed.current);
      }
      if( keyMap['KeyA'] ){
        turn.call(datas.thisRef.current, "left", datas.turnSpeed.current);
      }
      if( keyMap['KeyD']){
        turn.call(datas.thisRef.current, "right", datas.turnSpeed.current);
      }
      
      // theres a bug, that these compound power instead of doing an || OR cause its fun!!
      if(keyMap['ArrowUp']  ){
        move.call(datas.thisRef.current, "forward", datas.walkSpeed.current);
      }
      if( keyMap['ArrowDown'] ){
        move.call(datas.thisRef.current, "backward", datas.walkSpeed.current);
      }
      if( keyMap['ArrowLeft'] ){
        turn.call(datas.thisRef.current, "left", datas.turnSpeed.current);
      }
      if(keyMap['ArrowRight'] ){
        turn.call(datas.thisRef.current, "right", datas.turnSpeed.current);
      }
      
    });

    // hackney method to get a .collider accessor on the main object
    // collider={getCollider}
    function getColliderB(){
      return datas.colliderRef?.current?.geometry?.boundingBox;
    }
    const getCollider = getColliderB();

    // 
    // 
    // function onCollide(otherwobject){
    //   debugger
    // }



    // const [hovered, setHover] = useState(false);
    // const [active, setActive] = useState(false);
    
    // Subscribe this component to the render-loop, rotate the mesh every frame
    // useFrame((state, delta) => (meshRef.current.rotation.x += delta));

    const gltf = useLoader(GLTFLoader, './models/player1withrig1.glb');
    
    // gltf.scene.children.forEach((item, i) => {
    //   gg.add(item);
    // });
    // more wrappers!!! cause we cant simply change the constructor
    gg.add(gltf.scene);
    
    // would like to add in 
    //               <Outlines thickness={4.05} color="orange" />
    
    // the collider attributes here should be consolidated into a CLASS or something ecs like
    return (
      <PhysicsBodySimpleCo name="ffffplayernamespace111" ref={datas.thisRef} {...props}
        name="player"
        colliderType={"positive"}
        defaultBoundsType={"box"}
        onCollide={(x)=>{
          // debugger
        }}
        datas={datas}
        collider={getCollider}
        walkBasic
        >
        <primitive object={gg} ref={datas.playerRef} receiveShadow castShadow />
        
        {/* bounds: this needs to be a simpler class, but needs an extents system instead of scale */}
        <mesh ref={datas.colliderRef} scale={1} receiveShadow castShadow  >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={'green'} />
        </mesh>

      </PhysicsBodySimpleCo>
    )
    // <primitive ref={ref} object={gg} position={props.position} scale={props.scale} />
    
        


}

// see note above
export default forwardRef(Player1);
