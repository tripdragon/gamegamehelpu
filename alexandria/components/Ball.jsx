import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

import { simplePhysics } from "../utilites/simplePhysics"

import { Vector3 } from 'three';

// in this example we need 2 refs
// one for internal so we can do animation stuff
// and the forwardref type so the parent component can work with it
// 
// React internal does not allow array refs
// but does have an arcane useImperativeHandle
// which then does more and we are forced to put the functions into it
// it makes for some interesting new way to closure methods, but as per example
// its the only solution to the 2+ ref issue

function Ball(props, ref) {
    
    // this was a test
    // const refsDerp = {
    //   mesh : useRef(null),
    //   physicsRef : useRef(new simplePhysics())
    // }
    // 
    // const meshRef = useRef();
    const tacos = "skdmgldfg";
    
    // const physicsRef = useRef(new simplePhysics());
    // const ppp = useRef(9);
    // let mm = 12;
    
    const datas = {
      meshRef : useRef(),
      ppp : useRef(9),
      tamacos : "crunchy",
      // physicsRef : useRef( new simplePhysics(new Vector3(), 8, 0.08, 0) ),
      physicsRef : useRef( new simplePhysics(new Vector3(), 5, 0.92, 0.1) ),
      // this one wont work, its like its just not even in the dom in teh app in the next update
      // physicsRef2 : new simplePhysics(new Vector3(), 1, 0.9, 0),
      hasJumped : false,
      hasJumped2 : useRef(false),
    }
    
    useImperativeHandle(ref, () => {
      return {
        fishness(gg){
          // debugger
          signal()
        }
      };
    }, []);
    
    
    
    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);
    
    useFrame((state, delta) => {
      // meshRef.current.rotation.x += delta;
      // debugger
      
      let mm = datas;
      // console.log(datas);
      
      if (datas.meshRef && datas.meshRef.current) {
        // cheap floor
        // debugger
        
        if(datas.physicsRef.current){
            
          // datas.physicsRef2.update();
          
          // gravity
          // datas.physicsRef.current.applyForce(new Vector3(0,-9.2*0.5,0));
          // datas.physicsRef.current.applyForce(new Vector3(0,-9.2*0.1,0));
          
          // datas.physicsRef.current.applyForce(new Vector3(0,-0.15,0));
          datas.physicsRef.current.applyForce(new Vector3(0,-0.6,0));
          
          
          datas.physicsRef.current.update();
          // console.log(datas.physicsRef2.objectPointer.position);
          // debugger
          if(datas.physicsRef.current.objectPointer.position.y < 0){
            datas.physicsRef.current.objectPointer.position.y = 0;
          }
          
          // datas.physicsRef.current.objectPointer.position.y += 0.1;
        }
        
        if(datas.hasJumped2 === true){
          // console.log(datas);
          // debugger
          // console.log(datas.meshRef.current.position);
        }
        // if(datas.meshRef.current.position.y < 0){
        //   // datas.meshRef.current.geometry.boundingSphere.radius
        //   datas.meshRef.current.position.y = -1;
        // }
      }
    });
    
    useEffect(()=>{
      // debugger
      if (datas.meshRef && datas.meshRef.current) {
        datas.physicsRef.current.objectPointer = datas.meshRef.current;
        // datas.physicsRef2.objectPointer = datas.meshRef.current;
      }
    });
    
    function signal(){
      // debugger
      // Stuuuupid bug, need some thing to reference these before you can debugger
      // console.log(meshRef.current);
      // console.log(ppp.current);
      // let yy = ppp;
      let mm = datas;
      let wppwp = tacos;
      datas.hasJumped = true;
      datas.hasJumped2 = true;
      // datas.physicsRef2.applyForce(new Vector3(0,0.1,0));
      // datas.physicsRef.current.applyForce(new Vector3(0,14,0));
      // datas.physicsRef.current.applyForce(new Vector3(-12,24,0));
      // datas.physicsRef.current.applyForce(new Vector3(-12*1,24*1,0));
      // datas.physicsRef.current.applyForce(new Vector3(-4,12,0));
      // datas.physicsRef.current.applyForce(new Vector3(-2,12,0));
      // datas.physicsRef.current.applyForce(new Vector3(-2,12,0));
      // datas.physicsRef.current.applyForce(new Vector3(-0.1,1,0));
      datas.physicsRef.current.applyForce(new Vector3(-2,2,0));

      // console.log(datas.physicsRef2.objectPointer.position);
      // debugger
    }
    // https://stackoverflow.com/questions/60270678/using-multiple-refs-on-a-single-react-element
    return (
        <mesh
            {...props}
            ref={datas.meshRef}
            receiveShadow castShadow
            asdfsdfscale={active ? 1 : 1}
            onClick={() => setActive(!active)}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
            signal={signal}
            >
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'green'} />
        </mesh>
    );
}

export default forwardRef(Ball);
