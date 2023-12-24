
https://tripdragon.github.io/gamegamehelpu/react_toss/party/

# gamegamehelpu
game help u


# Abouty
Threejs React Fiber r3j t3rj whatever its called. It was kicked from the project. You can view it in /react_toss
It was ~ok~ it did not really add anything that is not doable in straight THREE.js. In practice the hooks system handicapped the productivity and added complexity to the order and control of setting up objects. A renderloop hook is simply an array of functions, so theres no real need for useFrame(). useEffect() is just a weird name for "has loaded" and sits at the top of the code page further making a mess of reading. useRef() was messy and enforced the .current namespace EVERYWHERE

Overall back to THREE but thus far it does remain in node.js. There is some added complexity to now having a more data centric store class instead of a simple object. It should produce fruit and have some new utilty like snapshots or events.

## importmaps
a KEY feature of nested js imports is not yet supported properly in vite.js or rollup.js. We had to use babel plugins BUT it works!!
edit ```.babelrc```

## ECS's
The latest hotness
Ideally you can add a behavior/trait to an object and it just does it or does not
So if we would like barking pigeons
```
pidgeon
  + bark
```
Should be that simple...
There are plugins, oh joy. But the core concept is simple. Store arrays of functions in a cache and run in the gameloop

## Object3D + Physics
Object3D is a top level class in threejs, so then EVERYTHING in 3D is that. Mesh, Group, Loader gltf models, etc...
So it seems to be obvious the top level should handle rigidbody physics, like having a bounds and force. But by default Object3D does not have concept of geometry or force. We could make an external object and matrix match them like physics engines. And that is still totes a real plan, but for the most basic things like small pool collisions and selecting and force we might as well just force stuff into Object3D.prototype before anything loads~!!!
