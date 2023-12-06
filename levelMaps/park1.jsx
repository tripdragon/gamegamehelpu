import React, { useRef, useState, forwardRef, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';


import {RepeatWrapping} from "three";

// import { Suspense } from 'react';

// import { Group } from 'three';

// 
// 
// import { Text } from '@react-three/drei';
// 
// import Box from '../alexandria/components/Box';
// import Town1 from '../alexandria/components/Town1';


import { TextureLoader } from 'three/src/loaders/TextureLoader';

function Park1(props, ref) {
  
  const grasstex = useLoader(TextureLoader, "./textures/triangles01.jpg");
  // debugger
  grasstex.wrapS = RepeatWrapping;
grasstex.wrapT = RepeatWrapping;
grasstex.repeat.setScalar(14)
    
    // // needs a conditional 
    // const word_balloon_1 = useLoader(TextureLoader, props.imageURL);
    // 
    // const textboxref = useRef();
    // 

    // This reference will give us direct access to the mesh
    // const textBubbleRef = useRef();
    
    
    // const [hovered, setHover] = useState(false);
    // const [active, setActive] = useState(false);
    // 
    // useFrame((state, delta) => (meshRef.current.rotation.x += delta));
    
    // let index = 0;
    // let deltaTime = 0;
    // 
    // let _text = props.text || ["NArffff!!"];
    // 
    // useFrame((state, delta) => {
    //   deltaTime += delta;
    //   // console.log("deltatime", deltaTime);
    //   if (deltaTime > 1) {
    //     deltaTime = 0;
    //      index++;
    //     // _text = "meeep moop";
    // 
    //     if(textboxref && textboxref.current){
    // 
    //       // textboxref.current.text = "meeep moop";
    //       textboxref.current.text = _text[index];
    //     }
    //   }
    // });
    // 
    // 
    // useEffect(() => {
    // 
    //     if (textboxref) {
    //         // console.log('playerRef.current', playerRef.current);
    //         // debugger
    //     }
    // // }, [playerRef.current, playerControllerPad.current]);
    // });
    // 
    
    
    return (
      <group ref={ref}>
          
        <color attach="background" args={['skyblue']} />
        <ambientLight intensity={2.4} />

        <directionalLight intensity={4.2} position={[0, 1, 5]} color="#00aaff" />

        <mesh rotation={[-Math.PI/2,0,0]} scale="14">
          <planeGeometry args={[1*1.5, 1*1.5]} />
          <meshStandardMaterial color="#b9ffb8" map={grasstex} />
        </mesh>
      
      </group>
    );
}


export default forwardRef(Park1);
