import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

import { simplePhysics } from "../utilites/simplePhysics"


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
    const refsDerp = {
      mesh : useRef(null),
      physicsRef : useRef(new simplePhysics())
    }
    
    const meshRef = useRef(null);
    const tacos = "skdmgldfg";
    
    const physicsRef = useRef(new simplePhysics());
    const ppp = useRef(9);
    let mm = 12;
    
    useImperativeHandle(ref, () => {
      return {
        fishness(gg){
          debugger
          signal()
        }
      };
    }, []);
    
    
    
    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);
    
    useFrame((state, delta) => {
      // meshRef.current.rotation.x += delta;
      // debugger
    });
    
    useEffect(()=>{
      // debugger
    });
    
    function signal(){
      debugger
      // should be able to reach any const be it a string or a useframe from here
      // meshRef.current.position.y += 0.1;
    }
    // https://stackoverflow.com/questions/60270678/using-multiple-refs-on-a-single-react-element
    return (
        <mesh
            {...props}
            sdfsdfref={meshRef}
            ref={refsDerp.mesh}
            receiveShadow castShadow
            asdfsdfscale={active ? 1 : 1}
            onClick={() => setActive(!active)}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
            sdfdfgsignal={()=>signal()}
            signal={signal}
            >
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'green'} />
        </mesh>
    );
}

export default forwardRef(Ball);
