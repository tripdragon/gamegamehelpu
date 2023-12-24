// tiny tiny version of the viewport plugin
// we have limited time to hammer this together
// since typescript and 8thwall are at ods along with various other 8thwall anoyances

// a skiff is a tiny fishing boat, tiiiiny


// WAS gonna make this module based but PIXI is ALSO a mess

export var SKIFF = {

  // https://en.wikipedia.org/wiki/Linear_interpolation
  lerp : function( x, y, t ) {

  	return ( 1 - t ) * x + t * y;

  },
  
  // Linear mapping from range <a1, a2> to range <b1, b2>
  mapLinear : function( x, a1, a2, b1, b2 ) {

  	return b1 + ( x - a1 ) * ( b2 - b1 ) / ( a2 - a1 );

  },

  clamp : function(min, max, val){
    return Math.min(Math.max(min, val), max);
  },
  
  
  // needs to self update
  // var appsBounds = {width: window.innerWidth, height: window.innerHeight};
  // stageCenter(window.innerWidth, window.innerHeight){
  stageCenter : function(width, height){
    return {
      // x: appsBounds.width / 2, y: appsBounds.height / 2
      x: width / 2, y: height / 2
    }
  },

  computeScalarToFit : function(width, height, targetWidth, targetHeight){
      
      let widthRatio = targetWidth / width;
      let heightRatio = targetHeight / height;
      
      let scaleFactor = Math.min(widthRatio, heightRatio);

      return scaleFactor
  }, 



  // get local to world
  // get world to local
  // position = localToWorld()
  // blueprints.children[0].getGlobalPosition()
  // the .getGlobalPosition() is returning 
  // blueprintsVisualCenter.position.scope.worldTransform.tx ty
  // which are not truely the values expected
  localToWorld : function(item, parent){
    
  },




  /*
  world.position.set(120,120)
  world.scale.set(0.2)
  recenterWorld()
  */
  // does not yet do the perfect visualCenters center
  // save that for when fixing the piviot point
  recenterWorld : function(blueprintsVisualCenter, world){
    var a = this.stageCenter(window.innerWidth, window.innerHeight);
    var b = blueprintsVisualCenter.getGlobalPosition();
    var c = {x: b.x - a.x, y: b.y - a.y};
    world.position.set( world.position.x - c.x, world.position.y - c.y );
  },

  
  /*
  world.scale.set(1)
  world.position.set(-920,-140)
  */
  snapWorldToEdge : function(){
    
  },

  


  getGlobalPosition : function(loc){
    // counter clockwise left right top bottom
    // lt, lb, rb, rt
    // width is updated from the scale
    
    /*
    world.scale.set(1)
    world.scale.set(0.8)
    world.position.set(-920,-140)
    b = getCornerPointOfWorld("rb")


    dots = PIXI.Sprite.from('img/beagle-mix-dog-with-ice-cream-toy-in-their-mouth-scaled.jpg');
    MapApp.stage.addChild(dots);
    dots.scale.set(0.032);
    dots.position.copyFrom(b)



    // right,top
    // width is updated from the scale
    world.scale.set(1)
    world.scale.set(0.8)
    world.position.set(-920,140)
    b = getCornerPointOfWorld("rt")


    dots = PIXI.Sprite.from('img/beagle-mix-dog-with-ice-cream-toy-in-their-mouth-scaled.jpg');
    MapApp.stage.addChild(dots);
    dots.scale.set(0.032);
    dots.position.copyFrom(b)


    // left bottom
    world.scale.set(1)
    world.scale.set(0.8)
    world.position.set(220,140)
    b = getCornerPointOfWorld("lb")


    dots = PIXI.Sprite.from('img/beagle-mix-dog-with-ice-cream-toy-in-their-mouth-scaled.jpg');
    MapApp.stage.addChild(dots);
    dots.scale.set(0.032);
    dots.position.copyFrom(b)


    // left top
    world.scale.set(1)
    world.scale.set(0.8)
    world.position.set(320,240)
    b = getCornerPointOfWorld("lt")


    dots = PIXI.Sprite.from('img/beagle-mix-dog-with-ice-cream-toy-in-their-mouth-scaled.jpg');
    MapApp.stage.addChild(dots);
    dots.scale.set(0.032);
    dots.position.copyFrom(b)

    */
    var a = world.position, w, h;
    if (loc === "lt"){
      w = 0;
      h = 0;
    }
    else if (loc === "lb"){
      w = 0;
      h = world.height;
    }
    else if (loc === "rb"){
      w = world.width;
      h = world.height;
    }
    else if (loc === "rt"){
      w = world.width;
      h = 0;
    }
    // return {x:a.x + w , y: a.y + h}
    return {x:w , y: h}
  
  },
  
  

  
  
}
