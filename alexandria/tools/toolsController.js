
// Pulled and edited from infini project

// rename, toolBox?
// Task is simply managing the tools as a statemachine
// and the display as a panel is elsewhere
// ToolsController is boring but it makes sense

// import { Tool } from "./tool.js";
import { CheapPool } from "alexandria/utils/cheapPool.js";



// this manages the database of tools thus far
// update is in EditorModeActions

export class ToolsController  {

  visualObject = null; // what will appear under the mouse

  currentTool = null; // type Class as state machine

  tools = {
    // select = null;
    // platform = null;
    // wobject = null;
    // player = null
  };
  toolsList = new CheapPool();
  
  addTool(tool){
    if(tool.isTool){
      this.tools[tool.name] = tool;
      this.toolsList.add(tool);
    }
    else {
      console.log("tool is not a tool!!!? lucky it");
    }
  }
  
  changeTool(tool){
    var index = this.toolsList.indexOf(tool);
    if(index === -1){
      console.log("tool missing ", tool.name);
      return;
    }
    if(this.currentTool !== null){
      this.currentTool.replace();
    }
    this.currentTool = tool;
    tool.start();
  }
  
  stopTool(tool){
    var index = this.toolsList.indexOf(tool);
    if(index === -1){
      console.log("tool missing ", tool.name);
      return;
    }
    if(this.currentTool !== null){
      this.currentTool.stop();
    }
  }
}
