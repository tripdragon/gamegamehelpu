import React, { useRef, useState, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';

import { Vector3, Object3D } from 'three';

// import useKeyboard from 'useKeyboard';
// import useKeyboard from './alexandria/components/useKeyboard';
import useKeyboard from '../alexandria/components/useKeyboard';


const Controls_A = {
    forward : 'forward',
    back : 'back',
    left : 'left',
    right : 'right',
    jump : 'jump',
};


function PlayerControllerPad(props, ref) {
    
    // This reference will give us direct access to the mesh
    // const meshRef = useRef();
    
    var __ref = ref;
    
    // Set up state for the hovered and active state
    // const [player, setPlayer] = useState(false);
    // const [active, setActive] = useState(false);
    // const [narf, setNarf] = useState(false);
    
    // this do nothing
    const [walkSpeed, setWalkSpeed] = useState(false);
    const [turnSpeed, setTurnSpeed] = useState(false);
    
    // Subscribe this component to the render-loop, rotate the mesh every frame
    // useFrame((state, delta) => (meshRef.current.rotation.x += delta));
    
    // Return view, these are regular three.js elements expressed in JSX

    const keyMap = useKeyboard();


    var player = null;
    var camera = null;
    var orbit = null;


    const oldObjectPosition = new Vector3();
    const newObjectPosition = new Vector3();
    
    // function movePlayer(dir, camera, orbitRef){
    function movePlayer(player, dir, camera, orbit){

        player.getWorldPosition(oldObjectPosition);

        if (dir === 'KeyA') {
            player.turn("left", turnSpeed);
        }
        if (dir === 'KeyD') {
            player.turn("right", turnSpeed);
        }
        if (dir === 'KeyW') {
            player.move("forward", walkSpeed);
        }
        if (dir === 'KeyS') {
            player.move("backward", walkSpeed);
        }
        
        if(camera && orbit){
        
            // orbit.enabled = false;
        
            player.getWorldPosition(newObjectPosition);
        
            const deltaB = newObjectPosition.sub(oldObjectPosition);//.multiplyScalar(0.1);
        
            camera.position.add(deltaB);
        
            // orbit.enabled = true;
        
            orbit.target.copy(player.position);
            
            //   setTimeout(()=>{
            //   // camera.lookAt(player.position)
            // }, 1000)
        
        
        }
        
        
    }


    useFrame((_, delta) => {
       delta = 1;
       
       // debugger
       // if (ref) {
       //   debugger
       // 
       // }
       // if(__ref){
       //   debugger
       // }
       
       // if(player){
       //   debugger
       // }
       
       // if(ref.current.player){
       //   debugger
       // }
       
       let player = ref.current.player;
       let camera = ref.current.camera;
       let orbit = ref.current.orbit;
       


        if(player){
            // debugger
            keyMap['KeyA'] && ( movePlayer(player,'KeyA', camera, orbit, delta) );
            keyMap['KeyD'] && (movePlayer(player,'KeyD', camera, orbit, delta) );
            keyMap['KeyW'] && ( movePlayer(player,'KeyW', camera, orbit, delta) );
            keyMap['KeyS'] && ( movePlayer(player,'KeyS', camera, orbit, delta) );
            keyMap['ArrowLeft'] && ( movePlayer(player,'KeyA', camera, orbit, delta) );
            keyMap['ArrowRight'] && ( movePlayer(player,'KeyD', camera, orbit, delta) );
            keyMap['ArrowDown'] && ( movePlayer(player,'KeyS', camera, orbit, delta) );
            keyMap['ArrowUp'] && ( movePlayer(player,'KeyW', camera, orbit, delta) );

        }


        // if(Object.keys(keyMap).length > 0){
        // Hate _this, figure out the p[roper]
        // if(keyMap['KeyA'] || keyMap['KeyD'] || keyMap['KeyW'] || keyMap['KeyS'] ||
        //   keyMap['ArrowLeft'] || keyMap['ArrowRight'] || keyMap['ArrowDown'] || keyMap['ArrowUp']
        // ){
        //     mTime += swingSpeed;
        // 
        // }

        // _this should be an onchange from the menu instead
        // _this also goes into the player more so

    });
    
    



    
    // return(
    //   < player={player}>
    //   </>
    // );
    // return(null);
    
    // this SHOULD not be an object3d 
var mm = new Object3D();    
    // return <primitive object={mm}  ref={ref} player={player}  />;
    return <primitive object={mm}  ref={ref} walkSpeed={walkSpeed} turnSpeed={turnSpeed}  />;
    // return <primitive ref={ref} object={mm}  />;


}

export default forwardRef(PlayerControllerPad);
