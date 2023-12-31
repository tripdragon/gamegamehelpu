import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

import { simplePhysics } from "../simplePhysics/simplePhysics"

import { Vector3 } from 'three';

import PhysicsBodySimpleCo from "../simplePhysics/PhysicsBodySimpleCo";
// import usePhysicsStore from "../utilites/PhysicsBodySimpleCo";
import { usePhysicsStore } from "../../Logics/PhysicsGrapth1";

import { PhysicsGrapth1 } from "../../Logics/PhysicsGrapth1";


// in this example we need 2 refs
// one for internal so we can do animation stuff
// and the forwardref type so the parent component can work with it
// 
// React internal does not allow array refs
// but does have an arcane useImperativeHandle
// which then does more and we are forced to put the functions into it
// it makes for some interesting new way to closure methods, but as per example
// its the only solution to the 2+ ref issue

let count = 0;

function Popable(props, ref) {


    const datas = {
      thisRef : useRef(),
      tempRef : ref,
      colliderRef : useRef()
    }
    
    // useImperativeHandle(ref, () => {
    //   return {
    //     poke(force){
    //       let mm = datas;
    //       // debugger
    //       datas.thisRef.current.poke(force);
    //     },
    //     get mainObject() {
    //       return datas.thisRef.current;
    //     }
    //   };
    // }, []);
    // 
    
    
    // const [hovered, setHover] = useState(false);
    // const [active, setActive] = useState(false);
    // 
    useFrame((state, delta) => {
      // thisRef.current.rotation.x += delta;
      // debugger
      
      let mm = datas;
    
    });
    
    const physicsItems = usePhysicsStore();
    
    
    
    function getColliderB(){
      // return datas.colliderRef?.current?.geometry?.boundingBox;
      return datas.colliderRef?.current?.geometry?.boundingSphere;
    }
    const getCollider = getColliderB();

    
    useEffect(()=>{
      let yy = physicsItems;
      
      if (datas.tempRef) {
        
        datas.tempRef.current = datas.thisRef.current;
        
        // datas.thisRef.current.name="popable_"+count++;
        // datas.thisRef.current.name="narf"
        
      }

      datas.colliderRef.current.geometry.computeBoundingBox();
      datas.colliderRef.current.geometry.computeBoundingSphere();
      datas.colliderRef.current.geometry.boundingSphere.isSphere = true; // cheap patch until three updates source
      
      PhysicsGrapth1.add(datas.thisRef);
      // debugger
      

      // if (datas.thisRef && datas.thisRef.current) {
      //   datas.physicsRef.current.objectPointer = datas.thisRef.current;
      //   // datas.physicsRef2.objectPointer = datas.thisRef.current;
      // }
    }, []);
    
    function onCollide(other){
      // console.log("other", other);
      datas.thisRef.current.visible = false;
      
    }
    
    
    return (
      <PhysicsBodySimpleCo {...props} ref={datas.thisRef}
        sfsgdfgname={"popable_"+count++}
        colliderType={"negative"}
        onCollide={onCollide}
        collider={getCollider}
        datas={datas}
         >
        {/* use itself as the colliderRef */}
        <mesh ref={datas.colliderRef} receiveShadow castShadow >
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color={'yellow'} />
        </mesh>
      </PhysicsBodySimpleCo>
    );
}

export default forwardRef(Popable);
