import React, { useRef, useState, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';

import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


function Tree1(props, ref) {
    
    const meshRef = useRef();
    
    
    // const [hovered, setHover] = useState(false);
    // const [active, setActive] = useState(false);
    // 
    // Subscribe this component to the render-loop, rotate the mesh every frame
    // useFrame((state, delta) => (meshRef.current.rotation.x += delta));

    // const gltf = useLoader(GLTFLoader, './models/town4.glb');
    const gltf = useLoader(GLTFLoader, './models/tree1.glb');
    return <primitive castShadow receiveShadow object={gltf.scene} {...props} />;
          
    // Return view, these are regular three.js elements expressed in JSX
    // return (
    //     <mesh
    //         {...props}
    //         ref={meshRef}
    //         scale={active ? 1.5 : 1}
    //         onClick={() => setActive(!active)}
    //         onPointerOver={() => setHover(true)}
    //         onPointerOut={() => setHover(false)}>
    //         <boxGeometry args={[1, 1, 1]} />
    //         <meshStandardMaterial color={hovered ? 'hotpink' : 'green'} />
    //     </mesh>
    // );
}

export default forwardRef(Tree1);
