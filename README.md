
https://tripdragon.github.io/gamegamehelpu/react_toss/party/

use pixel paint tool for icons, pow 2-12
https://tripdragon.github.io/infinitesimal-game-engine/System1/Demos/paintgrid.html?pow=6


# gamegamehelpu
game help u

## Path
+ index.html should hold the css
+ main.js boots app
+ Initializers /alexandria/initializers/index.js holds stuff that loads for async. You have to duplicate one of them to get a template

+ access global enough object grapth
# ```_a.state.game.scene``` 
also 
# ```store.getState().game```

# codes
when something is super related in source there are codes like so
// #code: gaaame238 #
which act as bookmarks in search all

#early optimisations #code: scene28475#
https://discourse.threejs.org/t/question-about-object3d-updatematrixworld/6925/4
https://github.com/mrdoob/three.js/pull/14138
https://github.com/mrdoob/three.js/pull/15706
scene.matrixAutoUpdate = false;
but this also means any transform you do you HAVE to run
piece3.updateMatrix(); right after, which is annoying and forgetfull
but it saves performance with lots of things!!!!


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
