import './index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas } from '@react-three/fiber';

import { Vector3 } from 'three';

import { PerspectiveCamera, OrbitControls } from '@react-three/drei';

import { useThree } from '@react-three/fiber';



import Box from './components/Box';
import Town1 from './components/Town1';
import Player1 from './components/Player1';

function Foooots() {
  const {camera} = useThree();
  // debugger
  camera.lookAt(new Vector3());
}
// </*
// <Foooots />
// <PerspectiveCamera makeDefault position={[0,24,0]} rotation={[2.2,2,2]} />
// */>
createRoot(document.getElementById('root')).render(

    <Canvas shadows camera={{ position: [5, 10, 18], fov: 25 }} >
      <color attach="background" args={['skyblue']} />

      
      <OrbitControls makeDefault />
      <ambientLight intensity={2.2} />
    
      <directionalLight intensity={8.2} position={[0, 1, 5]} color="#00aaff" />

      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
        
      <Town1 />
      <Player1 position={[0.1,0,0]}  scale={2} />
    </Canvas>
);
