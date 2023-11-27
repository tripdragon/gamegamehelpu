import React, { useRef, useState, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';

import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


// REF's SUCKSORS
// https://stackoverflow.com/questions/71835726/how-can-i-use-forwardref-in-react-component
// and forwardRef

function Player1(props, ref) {
// export default function Player1(props, ref) {
// const ugggghrefs = forwardRef(function Player1Reeefforcedsystem(props, ref) {
// export default forwardRef(function Player1Reeefforcedsystem(props, ref) {

    
    // const ref = useRef()

    // const meshRef = useRef();
    
    
    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);
    
    // Subscribe this component to the render-loop, rotate the mesh every frame
    // useFrame((state, delta) => (meshRef.current.rotation.x += delta));

    const gltf = useLoader(GLTFLoader, './models/player1.glb');
    return <primitive ref={ref} object={gltf.scene} position={props.position} scale={props.scale} />;
          
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


// export default function Player1(props, ref) {
//   return (
//     <ugggghrefs props={props} ref={ref} />
//   )
// }

export default forwardRef(Player1);
