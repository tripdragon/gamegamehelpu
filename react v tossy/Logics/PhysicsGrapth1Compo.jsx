


// 
// You dont nest things in this. You dont transform it
// It manages SimplePhysics things
// 
// 

// This is also a quick job so its focused only on the player
// for its colliders

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { create } from 'zustand'

import {Object3D, Box3, Sphere} from "three";

import {PhysicsGrapth1} from "./PhysicsGrapth1";


var waitIndex = 0;

const boxA = new Box3();
const boxB = new Box3();
const sphereA = new Sphere();
const sphereB = new Sphere();

export default function PhysicsGrapth1Compo(props) {

    const thisRef = useRef();

    useFrame( (state, delta) => {
      
      // waitIndex++;
      // console.log("waitIndex", waitIndex);
      // if (waitIndex < 1)  return;
        
      
      
      // console.log("??¿¿¿ PPPPP");
      // console.log("PhysicsGrapth1", PhysicsGrapth1.items.length);
      // for (var i = 0; i < PhysicsGrapth1.items.length; i++) {
      //   // debugger
      //   let pp = PhysicsGrapth1.items[i];
      //   if(pp.current && pp.current.onCollide){
      //     pp.current.onCollide();
      //     // console.log("pp", pp.current.name);
      //   }
      // }
      
      
      // testing for positive and negative reactions!!
      for (var ii = 0; ii < PhysicsGrapth1.positives.length; ii++) {
        let pp = PhysicsGrapth1.positives[ii];
        pp.updateMatrixWorld();
        // need to test for onCollide but for now make eeeasy to read
        // if(pp.onCollide){
        
        // console.log("pp box", pp.collider);
        
        for (var mm = 0; mm < PhysicsGrapth1.negatives.length; mm++) {
          let nn = PhysicsGrapth1.negatives[mm];
          nn.updateMatrixWorld();
          
            // console.log("nn box", nn.collider);
            
            // test!
            // boundingBox
            // boundingSphere
            
            if (nn.visible && pp.collider && nn.collider) {
              
              // test 2!!!!
              if(pp.collider.isBox3 && nn.collider.isBox3){
                boxA.copy(pp.collider).applyMatrix4( pp.matrixWorld );
                boxB.copy(nn.collider).applyMatrix4( nn.matrixWorld );
              
                if (boxA.intersectsBox(boxB)) {
                  // debugger
                  // nn.visible = false;
                  nn.onCollide(pp);
                }
              }
              // debugger
              // just testing sphere hacney in here for now
              // since we dont have isSphere in three source
              // Uuuuuh .isSphere is missing from source so for now we just skip it
              // else if(pp.collider.isBox3 && nn.collider.isBox3){
              
              else if(pp.collider.isBox3 && nn.collider.isSphere){
                sphereA.copy(nn.collider).applyMatrix4(nn.matrixWorld);              
                boxA.copy(pp.collider).applyMatrix4( pp.matrixWorld );
                
                if (boxA.intersectsSphere(sphereA)) {
                  // nn.visible = false;
                  nn.onCollide(pp);
                }
              }
              
            }
            
            
          
        }
        
        // pp.current.onCollide();
        // console.log("pp", pp.current.name);
      
      }
    });
    
    
    const main = new Object3D();
    
    return (
        <primitive object={main} {...props} ref={thisRef} />
    );
}
