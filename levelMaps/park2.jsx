import React, { useRef, useState, forwardRef, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';


import {RepeatWrapping, Vector3, BackSide} from "three";

// import { Suspense } from 'react';

// import { Group } from 'three';

// 
// 
import { GradientTexture } from '@react-three/drei';
// 
// import Box from '../alexandria/components/Box';
import Tree1 from '../alexandria/components/Tree1';
import ImportedModel from '../alexandria/components/ImportedModel';


import { TextureLoader } from 'three/src/loaders/TextureLoader';



// https://gist.github.com/JesterXL/8a124a812811f9df600e6a1fdc0013af
function randomInRange(start, end) {
  var range = end - start;
  var result = Math.random() * range;
  result += start;
  return Math.round(result);
}

function Park2(props, ref) {
  
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

    // builds a slow expenssive array of trees in a circle
    // other version is assign a random length between
    // but then need to random the count as well
    const circleSpace = [];
    const center = new Vector3();
    const tempv = new Vector3();
    for (var i = 0; i < 10; i++) {
      let x = randomInRange(-12,12);
      let z = randomInRange(-12,12);
      tempv.set(x,0,z);
      let dis = tempv.distanceTo(center);
      if ( dis > 4 && dis < 8) {
        circleSpace.push(tempv.clone())
      }
    }
    

    return (
      <group ref={ref}>
          
        {/*<color attach="background" args={['skyblue']} />*/}
        <mesh scale={20}>
          <sphereGeometry args={[2.5, 30, 30]} attach="geometry" />
             <meshBasicMaterial side={BackSide}>
                <GradientTexture
                  stops={[0, 1]} // As many stops as you want
                  colors={['#ffffff', '#ffffff']} // Colors need to match the number of stops
                  size={24} // Size is optional, default = 1024
                 />
            </meshBasicMaterial>
        </mesh>
        
        
        <ambientLight intensity={1.4} />

        <directionalLight castShadow position={[2.5, 4, 5]} shadow-mapSize={[1024, 1024]} intensity={8.2} color="#b7ff80" />

        <mesh receiveShadow rotation={[-Math.PI/2,0,0]} scale="14">
          <planeGeometry args={[1*1.5, 1*1.5]} />
          <meshStandardMaterial color="#6c5cff" sdfsdfcolor="#b9ffb8" vdfgdfgmap={grasstex} />
        </mesh>
        
        
      {/* for loops dont work so have to do this stupid thing */}
      {/*
        <Tree1 scale={0.5} position={[2,0,0]} />
        <ImportedModel scale={0.5} position={[-2,0,0]} imageURL="./models/tree2.glb" />
        {Array.apply(0, Array(80)).map(function (x, i) {
          return <ImportedModel key={i} rotation={[0, Math.random()*Math.PI*2, 0]} scale={Math.random()*0.4} position={[randomInRange(-8,8),0,randomInRange(-8,8)]} imageURL="./models/tree2.glb" />
        })}
        */}
        {circleSpace.map(function (x, i) {
          return <ImportedModel key={i} rotation={[0, Math.random()*Math.PI*2, 0]} scale={Math.random()*0.4} position={[x.x,0,x.z]} imageURL="./models/tree2.glb" />
        })}
        
        {/* 
          
          <ImportedModel rotation={[0, Math.random()*Math.PI*2, 0]} scale={0.5} position={[4,0,4]} imageURL="./models/cat2.glb" />
           */}
        
      
      </group>
    );
}

// make sure the root object has ref={ref} ref ref ref 
export default forwardRef(Park2);
