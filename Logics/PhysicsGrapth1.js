

//
//
// We have two forms, classical import object 
// And trying to get zusland to work, but its not being nice yet
// 
// The <PhysicsGrapth1Compo> then has the update logics

// ideally to use
// import {PhysicsGrapth1} from "./PhysicsGrapth1";
// PhysicsGrapth1.add(item)
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

class grapth{
  
  items = [];
  
  add(item){
    this.items.push(item);
  }
  
  clear(){
    this.items.length = 0;
  }
}

export const PhysicsGrapth1 = new grapth();
