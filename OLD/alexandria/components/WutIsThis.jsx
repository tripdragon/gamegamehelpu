import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useFrame, extend } from '@react-three/fiber';


import { Vector3, Object3D } from 'three';





class Wut extends Object3D{
  isWut = true;
  constructor(){
    super();
  }
  tacos(){
    console.log("tacos", this.position);
  }
}

extend({ Wut })
// debugger

export default function WutIsThis(props) {

    const datas = {
      thisRef : useRef(),
    }
    
    useFrame((state, delta) => {
      // datas.thisRef.current.rotation.y += delta;
      // debugger
      
      // let mm = datas;
    
    });

    return (
      <wut sdfdfgfdref={datas.thisRef} {...props}>
        <mesh receiveShadow castShadow  >
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color={'blue'} />
        </mesh>
      </wut>
        
    );
}
