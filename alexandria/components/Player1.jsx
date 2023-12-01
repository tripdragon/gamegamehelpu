import React, { useRef, useState, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';

import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


import { Vector3, Euler } from 'three';

// REF's SUCKSORS
// https://stackoverflow.com/questions/71835726/how-can-i-use-forwardref-in-react-component
// and forwardRef

function Player1(props, ref) {

    const pi075 = Math.PI * 2 * 0.75;

    // these are hard fed from the debugger tools
    const animationPoses = {
        walk : {
        // this might actually use an axis rotation instead of the eulers
            armSway : {front: new Vector3(1.91008833338259, 0, 0 ), back: new Vector3( 4.68725623915597, 0, 0 ) },
            legSway : {front: new Vector3(1.91008833338259, pi075, 0 ), back: new Vector3( 4.68725623915597, pi075, 0 ) }
        }
    };


    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);

    // Subscribe this component to the render-loop, rotate the mesh every frame
    // useFrame((state, delta) => (meshRef.current.rotation.x += delta));

    const gltf = useLoader(GLTFLoader, './models/player1withrig1.glb');
    return <primitive ref={ref} object={gltf.scene} position={props.position} scale={props.scale} animationPoses={animationPoses} />;

}


export default forwardRef(Player1);
