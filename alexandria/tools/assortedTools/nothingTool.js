
// makes the pointer do nothing null void

import { Tool } from "../tool.js";

export class NothingTool extends Tool {


  constructor({domElement, system, name = "NothingTool", displayName = "Nothing Tool"} = {}){
    super({domElement, system, name, displayName});
  }
  
  
  pointerDown(){}
  pointerUp(){}
  pointerMoving(){}

}
