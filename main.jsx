import './index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas } from '@react-three/fiber';

import { Vector3 } from 'three';

import { PerspectiveCamera, OrbitControls } from '@react-three/drei';

import { useThree } from '@react-three/fiber';



import Box from './components/Box';
import Town1 from './components/Town1';

function Farts() {
  const {camera} = useThree();
  // debugger
  camera.lookAt(new Vector3());
}
createRoot(document.getElementById('root')).render(

    <Canvas>
      <Farts />
      <PerspectiveCamera makeDefault position={[0,24,0]} rotation={[2.2,2,2]} />
      <OrbitControls  />
        <ambientLight intensity={2.2} />
      
        <directionalLight position={[0, 1, 5]} color="blue" />

      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
        
      <Town1 />
    </Canvas>
);
