import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useFrame, extend } from '@react-three/fiber';


import { Vector3, Object3D } from 'three';




// this here, we could extend the base classes like normal
// with logics without having to spam the react component
// and with the hacky ref= below we can access this!!
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



function WutIsThis222(props, ref) {
    const datas = {
      thisRef : useRef(),
    }
    // debugger
    // ok so here we try ref =
    // will never get the ref
    // ref = datas.thisRef;
    
    // but here if we point .current we get
    // ref.current.current.position !!!
    // so to better name the namespace we try adding a different name
    ref.current = datas.thisRef;
    ref.pointerLike = datas.thisRef;
    
    
    useFrame((state, delta) => {
      datas.thisRef.current.rotation.y += delta;
      // debugger
      
      // let mm = datas;
    
    });
    
    function narfs(){
      debugger
    }
    
    useEffect(() => {
      // debugger
    });

    return (
      <wut ref={datas.thisRef} {...props}
        narfs={narfs}>
        <mesh receiveShadow castShadow  >
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color={'blue'} />
        </mesh>
      </wut>
        
    );
}

export default forwardRef(WutIsThis222);
