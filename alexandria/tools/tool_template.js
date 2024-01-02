// 
// 
// // 
// // 
// // 
// export class Tool {
//   displayName = "";
// 
//   system = null;
//   domElement = null;
// 
//   isTool = true;
//   // editorModeActions = null;
// 
// 
//   // these are caches to allow proper scope and proper
//   // removeEvent signature
//   pointerUpEvent = null;
//   pointerDownEvent = null;
//   pointerMoveEvent = null;
// 
//   hasStarted = false;
// 
// 
//   pointerUp(){}
//   pointerDown(){}
//   pointerMove(){}
// 
//   start(){}
//   update(){}
// 
//   // @ system is store in this app
//   constructor({domElement, system, name = "tool", displayName = ""} = {}){
//     this.name = name;
//     this.displayName = displayName;
//     this.system = system;
//     if (!domElement) {
//       console.warn("domElement is Suuuuuper required");
//     }
//     else {
//       this.domElement = domElement;
//     }
//   }
// 
// 
//   // use these to bind as needed, they are not assigned automaticly
// 
//   bindUpEvent(){
//     if( this.pointerUpEvent === null){
//       this.pointerUpEvent = this.pointerUp.bind(this);
//     }
//     // common place for mouse events, otherwise fork this function
//     this.domElement.addEventListener( 'pointerup', this.pointerUpEvent );
//   }
// 
//   bindDownEvent(){
//     if( this.pointerDownEvent === null){
//       this.pointerDownEvent = this.pointerDown.bind(this);
//     }
//     // common place for mouse events, otherwise fork this function
//     this.domElement.addEventListener( 'pointerdown', this.pointerDownEvent );
//   }
// 
//   bindMoveEvent(){
//     if( this.pointerMoveEvent === null){
//       this.pointerMoveEvent = this.pointerDown.bind(this);
//     }
//     // common place for mouse events, otherwise fork this function
//     this.domElement.addEventListener( 'pointermove', this.pointerMoveEvent );
//   }
// 
// 
//   replace(){
//     this.stop();
//   }
// 
//   stop(){
//     this.domElement.removeEventListener( 'pointerup', this.pointerUpEvent );
//     this.domElement.removeEventListener( 'pointerdown', this.pointerDownEvent );
//     this.domElement.removeEventListener( 'pointermove', this.pointerMoveEvent );
//     this.hasStarted = false;
//   }
// 
// 
// 
// }
