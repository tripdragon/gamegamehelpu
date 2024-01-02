
import { ToolsController } from 'alexandria/tools/toolsController.js';



// Ideally you subclass this to add in the logics for which tools and such

export class Editor{
  
  toolsShelf = null;
  
  // dont know where this goes yet
  modes = {
    select : "select",
    draw : "draw"
  }
  
  toolsController = new ToolsController();

  constructor(props){
    // if(props){
    //   this.toolsController = props.toolsController || 
    // }
  }
  
  addTool(tool){
    this.toolsController.addTool(tool);
  }
  
  changeTool(tool){
    this.toolsController.changeTool(tool);
  }
  
  stopTool(tool){
    this.toolsController.stopTool(tool);
  }
    
  launch_CM(){}
  
  hide(){}
  
  remove(){}
  
}
