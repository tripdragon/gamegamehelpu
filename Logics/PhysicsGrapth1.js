


// 
// You dont nest things in this. You dont transform it
// It manages SimplePhysics things
// 
// 

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { create } from 'zustand'

import {Object3D} from "three";

export const usePhysicsStore = create((set) => ({
  
  items: [], // T : Object3D
  
  add: (wobject) => set((state) => {
    // debugger
    // console.log("¿¿¿¿");
    state.items.push(wobject)
  }
  ),
  
  clear: () => set({ item : [] })
  
}))
// 
// export default function PhysicsGrapth1(props) {
// 
// 
// 
// 
//     const thisRef = useRef();
// 
//     // useFrame((state, delta) => (thisRef.current.rotation.x += delta));
//     const main = new Object3D();
//     return (
//         <primitive object={main} {...props} ref={thisRef} />
//     );
// }
