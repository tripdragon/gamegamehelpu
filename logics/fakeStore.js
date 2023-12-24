

class CheapPool{
  cache = [];
  add(item){
    this.cache.push(item);
  }
}


class AnimationPool extends CheapPool{
  constructor(){
    super();
  }
}

class SceneGrapth extends CheapPool{
  constructor(){
    super();
  }
}

export const fakeStore = {
  camera : null,
  scene : null,
  renderer : null,
  animationPool : new AnimationPool(),
  sceneGrapth : new SceneGrapth()
}
