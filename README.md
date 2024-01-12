
https://tripdragon.github.io/gamegamehelpu/party/
previous
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
# ```store.state.game```

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

## Settings
- Main settings in `alexandria/store` in the default `state` object.
- Pipeline settings in `GameGrapth` constructor, like `timeSystem`, `physics`, and `outOfBounds`.

## Store
- `state`: Main state object. Can access via `store.state` or `store.getState()` for a clone of state.
- `setState`: Use to set state and run any matching listeners. Deeply merges into state.
  - Ex: `store.setState({ physics: true })`
- `subscribe`: Register a callback to run when a piece of state changes.
  - Ex: `store.subscribe('game.physics', setGamePipeline);`
- `getState`: Returns clone of state object, don't see much use for it.

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

All ECS component types used are in `alexandria/ecs/components`.
There are a number of systems in `alexandria/ecs/systems`.
- `movement`: For tracking position, rotation, and velocity vectors, for movement outside the physics system.
`outOfBoundsCheck`: Runs on a slower tick, queries DynamicPhysicsComponent and deletes objects if their x, y, or z is further away than `store.state.game.outOfBounds`.
- `physics`:
  - Syncs object3D position, rotation w/ rigidBody/collider.
  - Responds to collisionEvents and contactForce events and runs callbacks.
  - Checks every frame if the rigidBody is asleep and removes the entity from `DynamicPhysicsComponent`, moves it onto `SleepingPhysicsComponent`.
  - Runs physics step to move phys simulation fwd.
- `sleepingPhysics`: 
- `render`:
  - Runs render loop callbacks stored in gameGrapth's `renderPool`. Register methods to run here via `store.state.game.registerRenderCallback(func)`.
  - After those callbacks run, the THREE scene is rendered using the `scene` and `camera` attached to `store.state.game`.
- `time`:
  - Timekeeping util to manage delta to be shared w/ all other systems in the same pipeline.

## Object3D + Physics
Object3D is a top level class in threejs, so then EVERYTHING in 3D is that. Mesh, Group, Loader gltf models, etc...
So it seems to be obvious the top level should handle rigidbody physics, like having a bounds and force. But by default Object3D does not have concept of geometry or force. We could make an external object and matrix match them like physics engines. And that is still totes a real plan, but for the most basic things like small pool collisions and selecting and force we might as well just force stuff into Object3D.prototype before anything loads~!!!
- Run `obj3D.initPhysics({...})` to configure and initialize physics for an obj3D.

## Game Loop
`logics/gameLoop`
- `initGameLoop()` configures ECS pipelines and kicks off the main RAF loop.
- Main RAF loop runs the ECS gamePipeline every frame.
- There are slower ticks for things that don't need to run every frame.
  - These include the sleepingPhysicsPipeline and outOfBoundsCheckPipeline.
- Also sets up listeners on the store for `game.physics` and `game.outOfBounds` to toggle those pipeline systems dynamically.
  - e.g. `store.subscribe('game.physics', setGamePipeline);`

## Rendering
The THREE renderer, main scene, and camera are on `gameGrapth`, avail at `store.state.game`
Can register methods on gameGrapth to be called before THREE renders by running `store.state.game.registerRenderCallback(func)`

## MeshBuilder
- `mesh`: One of our primitives. Needs to be maintained as we add primitives. ex: `mesh: 'plane'`
- `color`: Color
- `scale`: num
- `shadow`: 'receive' or 'cast'
- `texture`: Obj with keys to configure texture
  - `path`: Path to texture
  - `wrapping`: Input from THREE, ex: `RepeatWrapping`
  - `repeat`: num
  - `colorSpace`: Input from THREE, ex: `SRGBColorSpace`
- `physics`: Configure physics for obj
  - `rigidBody`: 'fixed' or 'dynamic'
  - `gravityScale`: num – Multiplier for how configured gravity effects this object. 0 for 0 grav.
  - `linvel`: [x, y, z] – init linear velocity
  - `collider`:
    - `type`: See ##Physics below for Collider types
    - Additional properties associated w/ the specified `type`, e.g. `borderRadius`
    - `friction`: num
    - `sensor`: bool
    - `collisionGroups`: num
    - `solverGroups`: num
    - `frictionCombineRule`: Physics.CoefficientCombineRule.*
    - `restitution`: num
    - `restitutionCombineRule`: Physics.CoefficientCombineRule.*
    - `density`: num
    - `mass`: num
    - `massProperties`: { mass: num, centerOfMass: vec3, principalAngularInertia: vec3, angularInertiaLocalFrame: quat }
    - `rotation`: quat
    - `translation`: vec3
    - `centerOfMass`: vec3
    - `enabled`: bool

## Physics
- Using https://rapier.rs via `@dimforge/rapier3d-compat`
- Collider types
  - `cuboid`: Computes bounding box and uses it
  - `roundCuboid`: Computes bounding box and uses it
    - `borderRadius` num
  - `ball`/`sphere` Computes bounding sphere and uses it
  - `capsule`
    - `halfHeight`: num
    - `radius`: num
  - `trimesh`: Computes points and indices and uses them
  - `convexHull`/`hull`: Clones geometry and computes from points
  - `roundConvexHull`/`roundHull`: Clones geometry and computes from points
    - `borderRadius`: num
  - `convexMesh`/`mesh`: Computes points and indices and uses them
  - `roundConvexMesh`/`roundMesh`: Computes points and indices and uses them
    - `borderRadius`: num
  - `cylinder`:
    - `halfHeight`: num
    - `radius`: num
  - `roundCylinder`
    - `halfHeight`: num
    - `radius`: num
    - `borderRadius`: num
    - `cone`
      - `halfHeight`: num
      - `radius`: num
    - `roundCone`
      - `halfHeight`: num
      - `radius`: num
      - `borderRadius`: num
    - `triangle`: Creates shape from 3 points a, b, and c
      - `a`: vec3
      - `b`: vec3
      - `c`: vec3
    - `roundTriangle`: Creates shape from 3 points a, b, c, then applies borderRadius
      - `a`: vec3
      - `b`: vec3
      - `c`: vec3
      - `borderRadius`: num
    - `segment`: Creates shape from 2 points a, b
      - `a`: vec3
      - `b`: vec3
    - `polyline`: Computes points and indices and uses them
    - `heightfield`: Creates shape from array of heights
      - `rows`: num
      - `cols`: num
      - `heights`: Float32Array The heights of the heightfield along its local y axis, provided as a matrix stored in column-major order.
      - `scale`: vec3


