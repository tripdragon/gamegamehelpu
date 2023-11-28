import './index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas } from '@react-three/fiber';

import { Vector3, MathUtils } from 'three';
const lerp = MathUtils.lerp;
const remap = MathUtils.mapLinear;

import { PerspectiveCamera, OrbitControls } from '@react-three/drei';

import { useThree } from '@react-three/fiber';

import { useRef, useState, forwardRef, useEffect } from 'react';
import useKeyboard from './Logics/useKeyboard';
import { useFrame } from '@react-three/fiber';


import Box from './components/Box';
import Town1 from './components/Town1';
import Player1 from './components/Player1';


import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.19/+esm";


// function Foooots() {
//     const {camera, scene} = useThree();
//     // debugger
//     camera.lookAt(new Vector3());
// }
// </*
// <Foooots />
// <PerspectiveCamera makeDefault position={[0,24,0]} rotation={[2.2,2,2]} />
// */>


var playerPointer = null;



createRoot(document.getElementById('root')).render(
    <App />
);


const Controls_A = {
    forward : 'forward',
    back : 'back',
    left : 'left',
    right : 'right',
    jump : 'jump',
};


function App() {




    return (
        <Canvas shadows camera={{ position: [5, 10, 18], fov: 25 }} >
            <Stuff1 />
        </Canvas>


    );
}



const gui = new GUI();


const menuG = {
arm_leftX: 0,
arm_leftY: 0,
arm_leftZ: 0,
arm_left_tween: 0.5,
arm_right_tween: 0.5,
arm_both_tween: 0.5,
walk_tween_driver: 0,
// myFunction: function() { alert( 'hi' ) }
};

// gui.add(menuG, "arm_leftX", 0, Math.PI * 2 * 2);
// gui.add(menuG, "arm_leftY", 0, Math.PI * 2 * 2);
// gui.add(menuG, "arm_leftZ", 0, Math.PI * 2 * 2);
// gui.add(menuG, "arm_left_tween", 0, 1);
// gui.add(menuG, "arm_right_tween", 0, 1);
gui.add(menuG, "arm_both_tween", 0, 1);
gui.add(menuG, "walk_tween_driver", 0, Math.PI * 2 * 8);
  





// REF's SUCKSORS
// https://stackoverflow.com/questions/71835726/how-can-i-use-forwardref-in-react-component
// and forwardRef
function Stuff1() {

  


    const {camera, scene, controls} = useThree();

    const playerRef = useRef();
    const orbitRef = useRef();
    const keyMap = useKeyboard();

    var orbitPointer = null;

    const walkSpeed = 6;


    const oldObjectPosition = new Vector3();
    const newObjectPosition = new Vector3();


    function movePlayer(dir, player, delta){
    
        player.getWorldPosition(oldObjectPosition);

        if (dir === 'KeyA') {
            // player.position.x -= walkSpeed * delta;
            player.rotation.y += walkSpeed * delta;
        }
        if (dir === 'KeyD') {
            // player.position.x += walkSpeed * delta;
            player.rotation.y -= walkSpeed * delta;
            // debugger
            // camera.position.x = player.position.x;
            // camera.lookAt(player.position)
        }
        if (dir === 'KeyW') {
            // player.position.z -= walkSpeed * delta;
            player.translateZ( walkSpeed * delta );
        }
        if (dir === 'KeyS') {
            // player.position.z += walkSpeed * delta;
            player.translateZ( -walkSpeed * delta );
        }
      if(camera && orbitRef){
      
        orbitRef.current.enabled = false;

        player.getWorldPosition(newObjectPosition);

        const deltaB = newObjectPosition.sub(oldObjectPosition);//.multiplyScalar(0.1);

        camera.position.add(deltaB);
        
        orbitRef.current.enabled = true;  
        
        orbitRef.current.target.copy(player.position)
        //   setTimeout(()=>{
        //   // camera.lookAt(player.position)
        // }, 1000)
        
        
      }
    }


    var tempArmLeft = null;
    var tempArmRight = null;

    var tempLegLeft = null;
    var tempLegRight = null;
    const tVecLeft = new Vector3();
    const tVecRight = new Vector3();

    let mTime = 0;
    const swingSpeed = 0.08;

    useFrame((_, delta) => {
        if(playerRef){
            // debugger
            keyMap['KeyA'] && ( movePlayer('KeyA', playerRef.current, delta) );
            keyMap['KeyD'] && (movePlayer('KeyD', playerRef.current, delta) );
            keyMap['KeyW'] && ( movePlayer('KeyW', playerRef.current, delta) );
            keyMap['KeyS'] && ( movePlayer('KeyS', playerRef.current, delta) );
            // keyMap['KeyA'] && (playerPointer.position.x -= 1 * delta)
            // keyMap['KeyD'] && (playerPointer.position.x += 1 * delta)
            // keyMap['KeyW'] && (playerPointer.position.z -= 1 * delta)
            // keyMap['KeyS'] && (playerPointer.position.z += 1 * delta)
        }
        
        
        // if(Object.keys(keyMap).length > 0){
        if(keyMap['KeyA'] || keyMap['KeyD'] || keyMap['KeyW'] || keyMap['KeyS']){
          mTime += swingSpeed;
          
        }
        
        // this should be an onchange from the menu instead
        // this also goes into the player more so
        
        if(playerRef){
          
          if ( ! tempArmLeft ) tempArmLeft = playerRef.current.getObjectByName("arm_l");
          if ( ! tempArmRight ) tempArmRight = playerRef.current.getObjectByName("arm_r");
          if ( ! tempLegLeft ) tempLegLeft = playerRef.current.getObjectByName("leg_l");
          if ( ! tempLegRight ) tempLegRight = playerRef.current.getObjectByName("leg_r");
          if (tempArmLeft && tempArmRight) {
            // debugger
            // tempArmLeft.rotation.set(menuG.arm_leftX , menuG.arm_leftY, menuG.arm_leftZ);
            // tempArmRight.rotation.set(menuG.arm_leftX , menuG.arm_leftY, menuG.arm_leftZ);
            // tempArmLeft.rotation.y = menuG.arm_leftY;
            // tempArmLeft.rotation.z = menuG.arm_leftZ;
            // tempArmLeft.rotation.x = menuG.arm_leftX;
            
            // tVecLeft.lerpVectors(playerRef.current.animationPoses.walk.armSway.front, 
            //   playerRef.current.animationPoses.walk.armSway.back,
            //   menuG.arm_left_tween);
            // tempArmLeft.rotation.setFromVector3(tVecLeft);
            // 
            // tVecRight.lerpVectors(playerRef.current.animationPoses.walk.armSway.front, 
            //   playerRef.current.animationPoses.walk.armSway.back,
            //   menuG.arm_right_tween);
            // tempArmRight.rotation.setFromVector3(tVecRight);
            // 
            
            let poses = playerRef.current.animationPoses;
            let walkPoses = poses.walk;
            var pl = playerRef.current;
            
                        // // arms
                        // tVecLeft.lerpVectors(walkPoses.armSway.front, walkPoses.armSway.back, menuG.arm_both_tween);
                        // tVecRight.lerpVectors(walkPoses.armSway.front, walkPoses.armSway.back, 1-menuG.arm_both_tween);
                        // 
                        // tempArmLeft.rotation.setFromVector3(tVecLeft);
                        // tempArmRight.rotation.setFromVector3(tVecRight);
                        // 
                        // 
                        // // legs
                        // 
                        // // tempLegLeft.rotation.y = menuG.arm_leftY;
                        // // tempLegLeft.rotation.z = menuG.arm_leftZ;
                        // // tempLegLeft.rotation.x = menuG.arm_leftX;
                        // 
                        // tVecLeft.lerpVectors(walkPoses.legSway.front, walkPoses.legSway.back, 1-menuG.arm_both_tween);
                        // tVecRight.lerpVectors(walkPoses.legSway.front, walkPoses.legSway.back, menuG.arm_both_tween);
                        // 
                        // tempLegLeft.rotation.setFromVector3(tVecLeft);
                        // tempLegRight.rotation.setFromVector3(tVecRight);
                        // 

// console.log("delta", delta);
            // arms
            
            
            // let gg1 = Math.cos(menuG.walk_tween_driver) * 0.5 + 0.5;
            let gg1 = Math.cos(mTime) * 0.5 + 0.5;
            tVecLeft.lerpVectors(walkPoses.armSway.front, walkPoses.armSway.back, gg1);
            tVecRight.lerpVectors(walkPoses.armSway.front, walkPoses.armSway.back, 1-gg1);
              
            tempArmLeft.rotation.setFromVector3(tVecLeft);
            tempArmRight.rotation.setFromVector3(tVecRight);
            
            
            // legs
            
            // let gg2 = Math.sin(menuG.walk_tween_driver) * 0.5 + 0.5;
            let gg2 = Math.sin(mTime) * 0.5 + 0.5;
            tVecLeft.lerpVectors(walkPoses.legSway.front, walkPoses.legSway.back, 1-gg2);
            tVecRight.lerpVectors(walkPoses.legSway.front, walkPoses.legSway.back, gg2);
            
            tempLegLeft.rotation.setFromVector3(tVecLeft);
            tempLegRight.rotation.setFromVector3(tVecRight);
            
                        
            
          }
          
        }
    });
    
    // Need this to get the reference var for the orbitcontrols
    useEffect(() => {

        if (orbitRef.current) {
            console.log('orbitRef.current', orbitRef.current);
        }
    }, [orbitRef.current]);

    return (
        <>
            <color attach="background" args={['skyblue']} />

            <OrbitControls ref={orbitRef} makeDefault />
            <ambientLight intensity={2.2} />

            <directionalLight intensity={6.2} position={[0, 1, 5]} color="#00aaff" />

            <Box position={[-1.2, 0, 0]} />
            <Box position={[1.2, 0, 0]} />

            <Town1 />

            <Player1 ref={playerRef} name="player1" position={[0.1,0,0]}  scale={2} />
        </>

    );
}
