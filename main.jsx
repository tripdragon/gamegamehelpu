import './index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas } from '@react-three/fiber';

import { Vector3 } from 'three';

import { PerspectiveCamera, OrbitControls } from '@react-three/drei';

import { useThree } from '@react-three/fiber';

import { useRef, useState, forwardRef, useEffect } from 'react';
import useKeyboard from './Logics/useKeyboard';
import { useFrame } from '@react-three/fiber';


import Box from './components/Box';
import Town1 from './components/Town1';
import Player1 from './components/Player1';

function Foooots() {
  const {camera, scene} = useThree();
  // debugger
  camera.lookAt(new Vector3());
}
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
}


function App() {
  


  
  return (
    <Canvas shadows camera={{ position: [5, 10, 18], fov: 25 }} >
      <Stuff1 />
    </Canvas>


  )
}





// REF's SUCKSORS
// https://stackoverflow.com/questions/71835726/how-can-i-use-forwardref-in-react-component
// and forwardRef
function Stuff1() {


  const {camera, scene, controls} = useThree();
  
  const playerRef = useRef()
  const orbitRef = useRef()
  const keyMap = useKeyboard()
  
  var orbitPointer = null;
  // 
  // useEffect(() => {
  //       // call api or anything
  //       console.log("loaded");
  //       debugger
  //    });


  let speed = 4;

  function movePlayer(dir, player, delta){
    // debugger
    if (dir === "KeyA") {
      player.position.x -= speed * delta
    }
    if (dir === "KeyD") {
      player.position.x += speed * delta
      // debugger
      // camera.position.x = player.position.x;
      // camera.lookAt(player.position)
    }
    if (dir === "KeyW") {
      player.position.z -= speed * delta
    }
    if (dir === "KeyS") {
      player.position.z += speed * delta
    }
    // if(camera){
    //   camera.position.x += 4;
    // }
  }
  
  useFrame((_, delta) => {
    // if( playerPointer === null ){
    //   // debugger
    //   playerPointer = scene.getObjectByName("player1", true);
    // }
    if(playerRef){
      // debugger
      keyMap['KeyA'] && ( movePlayer('KeyA', playerRef.current, delta) )
      keyMap['KeyD'] && (movePlayer('KeyD', playerRef.current, delta) )
      keyMap['KeyW'] && ( movePlayer('KeyW', playerRef.current, delta) )
      keyMap['KeyS'] && ( movePlayer('KeyS', playerRef.current, delta) )
      // keyMap['KeyA'] && (playerPointer.position.x -= 1 * delta)
      // keyMap['KeyD'] && (playerPointer.position.x += 1 * delta)
      // keyMap['KeyW'] && (playerPointer.position.z -= 1 * delta)
      // keyMap['KeyS'] && (playerPointer.position.z += 1 * delta)
      
    }
  })
  
  //
  // MORE FKNNNN wrappers
  // https://stackoverflow.com/questions/70768112/how-to-get-orbitcontrols-ref
  // 
  // IUUUGGGG cant figure this out
  // const DerpOrbitControls = (props, ref) => {
  //   const { setControls } = props;
  //   // const ref = useRef();
  // 
  //   useEffect(() => {
  //     if (!ref.current) return;
  //     setControls(ref.current);
  //   }, ref.current);
  //     return forwardRef(<OrbitControls makeDefault ref={ref} />);
  // };
  
  
  return (
    <>
    <color attach="background" args={['skyblue']} />


    {/*
      <OrbitControls ref={orbitRef} makeDefault />
      */}
    <OrbitControls makeDefault />
    <ambientLight intensity={2.2} />

    <directionalLight intensity={8.2} position={[0, 1, 5]} color="#00aaff" />

    <Box position={[-1.2, 0, 0]} />
    <Box position={[1.2, 0, 0]} />

    <Town1 />
    {/*
    Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?
    <Player1 name="player1" ref={ref} position={[0.1,0,0]}  scale={2} />

    */}
    <Player1 ref={playerRef} name="player1" position={[0.1,0,0]}  scale={2} />
    </>

  )
}
