


// 
// You dont nest things in this. You dont transform it
// It manages SimplePhysics things
// 
// 

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { create } from 'zustand'

import {Object3D} from "three";

import {PhysicsGrapth1} from "./PhysicsGrapth1";



export default function PhysicsGrapth1Compo(props) {

    const thisRef = useRef();

    useFrame( (state, delta) => {
      // console.log("??¿¿¿ PPPPP");
      console.log("PhysicsGrapth1", PhysicsGrapth1.items.length);
    });
    const main = new Object3D();
    
    return (
        <primitive object={main} {...props} ref={thisRef} />
    );
}
