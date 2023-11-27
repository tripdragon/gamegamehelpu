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
// myFunction: function() { alert( 'hi' ) }
};

gui.add(menuG, "arm_leftX", 0, Math.PI * 2 * 2);
gui.add(menuG, "arm_leftY", 0, Math.PI * 2 * 2);
gui.add(menuG, "arm_leftZ", 0, Math.PI * 2 * 2);
gui.add(menuG, "arm_left_tween", 0, 1);
gui.add(menuG, "arm_right_tween", 0, 1);
gui.add(menuG, "arm_both_tween", 0, 1);
  





// REF's SUCKSORS
// https://stackoverflow.com/questions/71835726/how-can-i-use-forwardref-in-react-component
// and forwardRef
function Stuff1() {

  


    const {camera, scene, controls} = useThree();

    const playerRef = useRef();
    const orbitRef = useRef();
    const keyMap = useKeyboard();

    var orbitPointer = null;

    const speed = 4;


    const oldObjectPosition = new Vector3();
    const newObjectPosition = new Vector3();


    function movePlayer(dir, player, delta){
    
        player.getWorldPosition(oldObjectPosition);

        if (dir === 'KeyA') {
            player.position.x -= speed * delta;
        }
        if (dir === 'KeyD') {
            player.position.x += speed * delta;
            // debugger
            // camera.position.x = player.position.x;
            // camera.lookAt(player.position)
        }
        if (dir === 'KeyW') {
            player.position.z -= speed * delta;
        }
        if (dir === 'KeyS') {
            player.position.z += speed * delta;
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
    const tVecLeft = new Vector3();
    const tVecRight = new Vector3();

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
        
        // this shoiuld be an onchange from the menu instead
        // this also goes into the player more so
        
        if(playerRef){
          if ( ! tempArmLeft ) tempArmLeft = playerRef.current.getObjectByName("arm_l");
          if ( ! tempArmRight ) tempArmRight = playerRef.current.getObjectByName("arm_r");
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
            
            tVecLeft.lerpVectors(playerRef.current.animationPoses.walk.armSway.front, 
              playerRef.current.animationPoses.walk.armSway.back,
              menuG.arm_both_tween);
            tVecRight.lerpVectors(playerRef.current.animationPoses.walk.armSway.front, 
              playerRef.current.animationPoses.walk.armSway.back,
              1-menuG.arm_both_tween);
              
            tempArmLeft.rotation.setFromVector3(tVecLeft);
            tempArmRight.rotation.setFromVector3(tVecRight);
            
            
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
