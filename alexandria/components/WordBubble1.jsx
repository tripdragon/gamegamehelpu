import React, { useRef, useState, forwardRef, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';


// import { Suspense } from 'react';



import { TextureLoader } from 'three/src/loaders/TextureLoader';

import { Text } from '@react-three/drei';



function WordBubble1(props, ref) {
  
  // const word_balloon_1 = useLoader(TextureLoader, './textures/word_balloon_2.png')
    
    // needs a conditional 
    const word_balloon_1 = useLoader(TextureLoader, props.imageURL);

    const textboxref = useRef();


    // This reference will give us direct access to the mesh
    // const textBubbleRef = useRef();
    
    
    // const [hovered, setHover] = useState(false);
    // const [active, setActive] = useState(false);
    // 
    // useFrame((state, delta) => (meshRef.current.rotation.x += delta));
    
    let index = 0;
    let deltaTime = 0;
    
    let _text = props.text || ["NArffff!!"];
    
    useFrame((state, delta) => {
      deltaTime += delta;
      // console.log("deltatime", deltaTime);
      if (deltaTime > 1) {
        deltaTime = 0;
         index++;
        // _text = "meeep moop";
        
        if(textboxref && textboxref.current){
          
          // textboxref.current.text = "meeep moop";
          textboxref.current.text = _text[index];
        }
      }
    });
    
    
    useEffect(() => {

        if (textboxref) {
            // console.log('playerRef.current', playerRef.current);
            // debugger
        }
    // }, [playerRef.current, playerControllerPad.current]);
    });
    
    return (
      
      <mesh position={[0,1.8,0]} ref={ref} >
        <planeGeometry args={[1.2*1.5, 1*1.5]} />
        <meshStandardMaterial color="white" map={word_balloon_1 || ''} transparent="true" />
        <Text ref={textboxref} fontSize="0.2" color="blue" anchorX="center" anchorY="middle" position={[0,0,0.01]} >
          {/*props.text || "NArffff!!"*/}
          {_text[0]}
        </Text>
      </mesh>

      
    );
}


export default forwardRef(WordBubble1);
