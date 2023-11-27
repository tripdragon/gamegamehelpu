import './index.css';
import { createRoot } from 'react-dom/client';
import React from 'react';
import { Canvas } from '@react-three/fiber';
import Box from './components/Box';

createRoot(document.getElementById('root')).render(
    <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
    </Canvas>
);
