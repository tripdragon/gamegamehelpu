


import { Editor } from './editor';
import { Notlilgui } from 'notlilgui/notlilgui.js';
import { SelectTool } from './assortedTools/selectTool.js';
import { NothingTool } from './assortedTools/nothingTool.js';
import { StampTool } from './assortedTools/stampTool.js';

import { store } from 'alexandria/store';

export class ToolsShelfEditor extends Editor {
  constructor(props){
    super(props);
    this.launch_CM();
  }

  launch_CM(){
    
    


    let gg = new Notlilgui();
    gg.attach();
    // these urls are based on the servers path
    // the .add here is going into the dom shelf, no events yet
    const nothingItem = gg.addItem({imageurl:"./icons/void_NFT_mices_within.png"});
    const selectItem = gg.addItem({imageurl:"./icons/cursor_a_NFT_cash_mices.png"});
    const treeItem = gg.addItem({imageurl:"./icons/tree_NFT_NFT_NFT_upon.png"});
    const benchItem = gg.addItem({imageurl:"./icons/bench_NFT_apples_upon.png"});
    
    
    const nerf = this;
    const st = store.state.game;

    // here we are assigning logic factories to each item now
    
    // these are so boilerplate they can be factories
    
    const selectTool = new SelectTool({domElement:st.domElement});
    this.addTool(selectTool);
    
    selectItem.addEventListener("checkedOn",(ev) => {
        console.log("ev", ev.detail);
        console.log("nerf", nerf);
        nerf.changeTool(selectTool);
      },false
    );
    selectItem.addEventListener("checkedOff",(ev) => {
        console.log("ev", ev.detail);
        console.log("nerf", nerf);
        nerf.stopTool(selectTool);
      },false
    );
    
    
    
    const nothingTool = new NothingTool({domElement:st.domElement});
    this.addTool(nothingTool);
    
    nothingItem.addEventListener("checkedOn",(ev) => {
        // console.log("ev", ev.detail);
        // console.log("nerf", nerf);
        nerf.changeTool(nothingTool);
      },false
    );
    nothingItem.addEventListener("checkedOff",(ev) => {
        // console.log("ev", ev.detail);
        // console.log("nerf", nerf);
        nerf.stopTool(nothingTool);
      },false
    );
    
    
    
    // let piece2 = foundItem1.clone();
    // debugger
    const treeTool = new StampTool({
      store:store, 
      // the object is not yet loaded, so ref by name
      // targetObject:foundItem1,
      targetObjectName: "trees_mwoie_1",
      targetScene:st.currentLevelMap, 
      domElement:st.domElement});
    this.addTool(treeTool);
    
    treeItem.addEventListener("checkedOn",(ev) => {

        console.log("tree on");
        nerf.changeTool(treeTool);
      },false
    );
    treeItem.addEventListener("checkedOff",(ev) => {
        
        console.log("tree off");
        nerf.stopTool(treeTool);
      },false
    );
    

  }
}
