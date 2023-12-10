



import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useFrame, extend } from '@react-three/fiber';

import { Vector3, Group } from 'three';

import { simplePhysics } from "../utilites/simplePhysics"
// import { PhysicsBodySimple } from "./PhysicsBodySimple.js";
// extend({ PhysicsBodySimple });




// in this example we need 2 refs
// one for internal so we can do animation stuff
// and the forwardref type so the parent component can work with it
// 
// React internal does not allow array refs
// but does have an arcane useImperativeHandle
// which then does more and we are forced to put the functions into it
// it makes for some interesting new way to closure methods, but as per example
// its the only solution to the 2+ ref issue

function PhysicsBodySimpleCo(props, ref) {

    const datas = {
      thisRef : useRef(),
      physicsRef : useRef()
    }
    
    useImperativeHandle(ref, () => {
      return {
        poke(force = new Vector3(-2,2,0)){
          // signal()
          // debugger
          // Stuuuupid bug, need some thing to reference these before you can debugger

          let mm = datas;
// debugger
          datas.physicsRef.current.applyForce(force);

        }
      };
    }, []);

    
    useFrame((state, delta) => {
      // thisRef.current.rotation.x += delta;
      
      let mm = datas;
      
      if (datas.thisRef && datas.thisRef.current) {
        
        if(datas.physicsRef.current){
          
          // gravity

          datas.physicsRef.current.applyForce(new Vector3(0,-0.4,0));
          
          
          datas.physicsRef.current.update();
          
          // cheap floor
          if(datas.physicsRef.current.objectPointer.position.y < 0){
            datas.physicsRef.current.objectPointer.position.y = 0;
          }
          
        }

      }
    });
    
    useEffect(()=>{
      // debugger
      if (datas.thisRef && datas.thisRef.current) {
        datas.physicsRef.current = new simplePhysics(datas.thisRef.current, new Vector3(), 5, 0.92, 0.1)
      }
    });
    
    
    const mm = new Group();
    // https://stackoverflow.com/questions/60270678/using-multiple-refs-on-a-single-react-element
    return <primitive ref={datas.thisRef} object={mm} {...props} />
    // return <PhysicsBodySimple ref={datas.thisRef} {...props} />
}

export default forwardRef(PhysicsBodySimpleCo);
