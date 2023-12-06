// react stuff
import './index.css';
import React from 'react';
import { Suspense } from 'react';
import { useRef, useState, forwardRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useLoader } from '@react-three/fiber';
import Styled from 'styled-components';


// const lerp = MathUtils.lerp;
// const remap = MathUtils.mapLinear;

// three stuff
import { PerspectiveCamera, OrbitControls, Text } from '@react-three/drei';
import { Vector3, MathUtils } from 'three';
import { TextureLoader } from 'three/src/loaders/TextureLoader';

// fiber stuff
import { useThree } from '@react-three/fiber';
// import useKeyboard from './Logics/useKeyboard';
import { useFrame } from '@react-three/fiber';



// main player stuff
import Player1 from './alexandria/components/Humanoids/Player1';
import PlayerControllerPad from './Logics/PlayerControllerPad';
import WordBubble1 from './alexandria/components/WordBubble1';

// stuff
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.19/+esm';
import TwoDDialog from './alexandria/components/TwoDDialog';


// levelmap stuff
// import Box from './alexandria/components/Box';
// import Town1 from './alexandria/components/Town1';
import TownMap1 from './levelMaps/townMap1';



// catch all for stuff in this file
const internals = {};


createRoot(document.getElementById('root')).render(
    <App />
);



function App() {

    const { TwoDOverlay } = internals;
    return (
        <>
            <Canvas shadows camera={{ position: [5, 10, 18], fov: 25 }} >
                <Stuff1 />
            </Canvas>
            <TwoDOverlay>
                <TwoDDialog />
            </TwoDOverlay>

        </>
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
    swingSpeed : 0.28,
    walkSpeed : 0.1,
    turnSpeed : 0.1,
    playerScale : 1.0,
// myFunction: function() { alert( 'hi' ) }
};

// gui.add(menuG, "arm_leftX", 0, Math.PI * 2 * 2);
// gui.add(menuG, "arm_leftY", 0, Math.PI * 2 * 2);
// gui.add(menuG, "arm_leftZ", 0, Math.PI * 2 * 2);
// gui.add(menuG, "arm_left_tween", 0, 1);
// gui.add(menuG, "arm_right_tween", 0, 1);
// gui.add(menuG, "arm_both_tween", 0, 1);
// gui.add(menuG, "walk_tween_driver", 0, Math.PI * 2 * 8);
gui.add(menuG, 'swingSpeed', 0, 2);
gui.add(menuG, 'walkSpeed', 0, 2);
gui.add(menuG, 'turnSpeed', 0, 2);
gui.add(menuG, 'playerScale', 0.1, 20);







// REF's SUCKSORS
// https://stackoverflow.com/questions/71835726/how-can-i-use-forwardref-in-react-component
// and forwardRef
function Stuff1() {
    
    var orbitPointer = null;

    const {camera, scene, controls} = useThree();

    const playerRef = useRef();
    const orbitRef = useRef();
    const textBubbleRef = useRef();
    // const keyMap = useKeyboard();
    
    const playerControllerPad = useRef();

    const word_balloon_1 = useLoader(TextureLoader, './textures/word_balloon_2.png')






    useFrame((_, delta) => {
      const swingSpeed = menuG.swingSpeed;
      // const walkSpeed = 6.2;
      const walkSpeed = menuG.walkSpeed;
      const turnSpeed = menuG.turnSpeed;
      
      if(playerRef){
        // debugger
          playerRef.current.scale.setScalar(menuG.playerScale);
          // playerRef.current.walkSpeed = walkSpeed;
          // playerRef.current.turnSpeed = turnSpeed;
          // debugger
          playerRef.current.walkSpeed = walkSpeed;
          playerRef.current.turnSpeed = turnSpeed;
      }
      
      // this does not work
      if(playerControllerPad && playerControllerPad.current.player){
        // debugger
        // playerControllerPad.current.walkSpeed = walkSpeed;
        // playerControllerPad.current.turnSpeed = turnSpeed;
        // debugger
        // this is wrong but it works for now
        playerControllerPad.current.player.walkSpeed = walkSpeed;
        playerControllerPad.current.player.turnSpeed = turnSpeed;
        playerControllerPad.current.player.swingSpeed = swingSpeed;
      }
      
      if(textBubbleRef && playerRef){
        textBubbleRef.current.position.copy(playerRef.current.position);
        textBubbleRef.current.position.y += 1.8;
      }
      
    });


    // Need this to get the reference var for the orbitcontrols
    // useEffect(() => {
    //     if (orbitRef.current) {
    //         console.log('orbitRef.current', orbitRef.current);
    //     }
    // }, [orbitRef.current]);


    useEffect(() => {
        if (playerRef.current && playerControllerPad.current && orbitRef.current && camera) {
            console.log('playerRef.current', playerRef.current);
            // debugger
            playerControllerPad.current.player = playerRef.current;
            playerControllerPad.current.camera = camera;
            playerControllerPad.current.orbit = orbitRef.current;
        }
    // }, [playerRef.current, playerControllerPad.current]);
    });

    return (
        <>

            <OrbitControls ref={orbitRef} makeDefault />
            
          {/* 
            <color attach="background" args={['skyblue']} />
            <ambientLight intensity={2.2} />

            <directionalLight intensity={14.2} position={[0, 1, 5]} color="#00aaff" />

            <Box position={[-1.2, 0, 0]} />
            <Box position={[1.2, 0, 0]} />

            <Town1 />
            
            
             */}
            
            <TownMap1 />
          
            {/* this should have the gltf link maybe */}
            <Player1 ref={playerRef} name="player1" position={[0.1,0,0]}  scale={0.9} />
            
            
            {/* player here is not yet loaded so we have to use the useEffect sighduck */}
            <PlayerControllerPad ref={playerControllerPad} />
            
            {/* 
              
              <OnscreenMessages />
              
              
              <mesh position={[0,1.8,0]} ref={textBubbleRef} >
              <planeGeometry args={[1.2*1.5, 1*1.5]} />
              <meshStandardMaterial color="white" map={word_balloon_1} transparent="true" />
              <Text fontSize="0.2" color="blue" anchorX="center" anchorY="middle" position={[0,0,0.01]} >
              NARF!!!
              </Text>
              </mesh>
            */}
            
            <WordBubble1 ref={textBubbleRef} textColor="black" text={["boooo", "Naaarrrfs", "graaaalg", "kupafffy"]} imageURL="./textures/word_balloon_2.png" />
            
        </>
    );
}

internals.TwoDOverlay = Styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-size: 60px;

    pointer-events: none;
    display: none;
    * {
        pointer-events: all;
    }
`;
