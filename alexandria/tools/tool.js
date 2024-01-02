


// It would be nice to be able to use a tool without a ToolsController
// well we have Stop()

/*

should be as simplke as .start() .stop()

*/

// 
// 
// 
export class Tool {
  displayName = "";
  
  system = null;
  domElement = null;
  
  isTool = true;
  // editorModeActions = null;

  selectedObject = null;
  
  isMouseDown = false;
  
  usePreventCollide = false;
  
  
  tapTimer = 0;
  tapLimit = 0.2;
  
  
  useGrid = false;
  grid = null;
  
  
  data = {}
  
  modes = {
    mousing : "mousing",
    // canDrag : "canDrag",
    // canDraw : "canDraw"
  }
  
  mode = this.modes.mousing;
  
  
  // these are caches to allow proper scope and proper
  // removeEvent signature
  pointerUpEvent = null;
  pointerDownEvent = null;
  pointerMoveEvent = null;
  
  hasStarted = false;

  // pointerUp(){}
  // pointerDown(){}
  // pointerMove(){}
  
  pointerDown(ev){
    this.isMouseDown = true;
    // if(this.selectedObject !== null && this.selectedObject.moveyThingTool){
    //   // this.selectedObject.moveyThingTool.pointerDown(this.data);
    // }
    console.log("base down");
  }
  pointerUp(ev){
    this.isMouseDown = false;
    // if(this.selectedObject !== null && this.selectedObject.moveyThingTool){
    //   this.selectedObject.moveyThingTool.pointerUp(this.data);
    // }
    console.log("base up");
  }

  pointerMoving(ev){

  }
  
  
  // start(){}
  // update(){}
  
  
  start(){
    
    this.bindUpEvent();
    this.bindDownEvent();
    
    // this.system.loopHookPoints.editorBeforeDraw = () => {
    //   this.update();
    // };

  }
  
  update(){
    this.mouseSelecting();
    this.pointerMoving();
  }
  
  // @ system is store in this app
  constructor({domElement, system, name = "tool", displayName = ""} = {}){
    this.name = name;
    this.displayName = displayName;
    this.system = system;
    if (!domElement) {
      console.warn("domElement is Suuuuuper required");
    }
    else {
      this.domElement = domElement;
    }
  }
  
  
  // use these to bind as needed, they are not assigned automaticly
  
  bindUpEvent(){
    if( this.pointerUpEvent === null){
      this.pointerUpEvent = this.pointerUp.bind(this);
    }
    // common place for mouse events, otherwise fork this function
    this.domElement.addEventListener( 'pointerup', this.pointerUpEvent );
  }
  
  bindDownEvent(){
    if( this.pointerDownEvent === null){
      this.pointerDownEvent = this.pointerDown.bind(this);
    }
    // common place for mouse events, otherwise fork this function
    this.domElement.addEventListener( 'pointerdown', this.pointerDownEvent );
  }

  bindMoveEvent(){
    if( this.pointerMoveEvent === null){
      this.pointerMoveEvent = this.pointerDown.bind(this);
    }
    // common place for mouse events, otherwise fork this function
    this.domElement.addEventListener( 'pointermove', this.pointerMoveEvent );
  }
  
  
  replace(){
    this.stop();
  }

  stop(){
    this.domElement.removeEventListener( 'pointerup', this.pointerUpEvent );
    this.domElement.removeEventListener( 'pointerdown', this.pointerDownEvent );
    this.domElement.removeEventListener( 'pointermove', this.pointerMoveEvent );
    this.hasStarted = false;
  }


  
}
