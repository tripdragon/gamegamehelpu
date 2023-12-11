import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

import { simplePhysics } from "../simplePhysics/simplePhysics"

import { Vector3 } from 'three';

import PhysicsBodySimpleCo from "../simplePhysics/PhysicsBodySimpleCo";


// in this example we need 2 refs
// one for internal so we can do animation stuff
// and the forwardref type so the parent component can work with it
// 
// React internal does not allow array refs
// but does have an arcane useImperativeHandle
// which then does more and we are forced to put the functions into it
// it makes for some interesting new way to closure methods, but as per example
// its the only solution to the 2+ ref issue

function Ball2(props, ref) {

    const datas = {
      thisRef : useRef(),
    }
    
    useImperativeHandle(ref, () => {
      return {
        poke(force){
          let mm = datas;
          // debugger
          datas.thisRef.current.poke(force);
        }
      };
    }, []);
    
    
    
    // const [hovered, setHover] = useState(false);
    // const [active, setActive] = useState(false);
    // 
    useFrame((state, delta) => {
      // thisRef.current.rotation.x += delta;
      // debugger
      
      let mm = datas;
    
    });
    
    // useEffect(()=>{
    //   // debugger
    //   if (datas.thisRef && datas.thisRef.current) {
    //     datas.physicsRef.current.objectPointer = datas.thisRef.current;
    //     // datas.physicsRef2.objectPointer = datas.thisRef.current;
    //   }
    // });
    
    return (
      <PhysicsBodySimpleCo {...props} ref={datas.thisRef} >
          <mesh receiveShadow castShadow >
              <sphereGeometry args={[1, 12, 12]} />
              <meshStandardMaterial color={'green'} />
          </mesh>
        </PhysicsBodySimpleCo>
    );
}

export default forwardRef(Ball2);
