import React, { useRef, useState, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';

import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { Clone } from '@react-three/drei';

// need to clone imported model to have mutiples in level scene
// https://stackoverflow.com/questions/68813736/use-the-same-gltf-model-twice-in-react-three-fiber-drei-three-js
// drei has a clone object
function ImportedModel(props, ref) {
    
    const meshRef = useRef();
    

    const gltf = useLoader(GLTFLoader, props.imageURL);
    // return <primitive castShadow receiveShadow object={gltf.scene} {...props} />;
    // receiveShadow
    return <Clone receiveShadow ref={ref} castShadow receiveShadow object={gltf.scene} {...props} />;

}

export default forwardRef(ImportedModel);
