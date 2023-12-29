
// might be based on lilgui
// might not
// task is to get selector and transform tools
// this or somethingelse might deal with thumbnails shelf

// import './notlilguistyle.css';
// import stylesgg from "./notlilguistyle.css"; /* import the styles as a string */

// import styles from "./notlilguistyle.css" assert { type: "css" }; /* import the styles as a CSSStyleSheet */


class MiniCache extends Array{
  add(item){
    this.push(item);
  }
}

export class Notlilgui{
  
  panel;
  cache = new MiniCache();
  checkboxes = new MiniCache();
  
  constructor(){}
  
  attach(){
    
    
    
    // var gg = document.getElementById("gamespace");
    // gg.innerHTML = "";
    // document.body.appendChild(controls);
    // var gamestyles = document.getElementById("gamestyles");
    var panel = document.createElement('div');
    this.panel = panel;
    panel.id = "notlilgui";
    
    // debugger
    // panel.style.cssText = stylesgg;
    
    // ugh inine
    // panel.style.cssText = `
    //   position: absolute;
    //   ___overflow: hidden;
    //   top: 0px;
    //   left: 0px;
    //   z-index: 2;
    //   background: #000000ba;
    //   width: 120px;
    //   min-height: 600px;
    //   padding: 20px 0 0 0;
    //   border-right : 1px #3c3c3c solid;
    //   /* flex box */
    //   display: flex;
    //   flex-direction: column;
    //   flex-wrap: nowrap;
    //   justify-content: flex-start;
    //   align-content: stretch;
    //   align-items: center;
    // `;
    
    document.body.appendChild(panel);

  }
  
  

  checkBoxChanged(item) {
    for (var i = 0; i < this.checkboxes.length; i++) {
      if(item !== this.checkboxes[i]){
        this.checkboxes[i].checked = false;
      }
    }
  }


  // @ type checkbox etc
  // function ToolCheckBoxFactory(parent, cache, tool, imageURL){
  addItem({type = "", imageurl = ""} = {}){
    // var item = document.createElement('div');
    // item.classList.add('item');
    // this.panel.appendChild(item);
    
    const box = this.buildCheckbox();
    this.panel.appendChild(box);
    this.cache.add(box);
    this.checkboxes.add(box);
  }
  
  buildCheckbox({imageurl} = {}){
    
    // this.tool = tool;
    
    // needs more robotting
    const box = document.createElement('input');
    box.classList.add("item");
    box.classList.add("checkbox");
    box.type = "checkbox";
    // item.style.backgroundImage = "url(./Cast/Alien2.png)";
    box.style.backgroundImage = imageurl;
    box.style.backgroundColor = "#000000";
    // parent.appendChild(box);
    // cache.push(box);
    
    var _this = this;
    
    box.onclick = function(ev){
      _this.checkBoxChanged(ev.target);
      console.log(ev.target.checked);
      if(ev.target.checked){
        console.log("checked yes");
        // EditorMagic.changeTool(_this.tool);
        // make this an event
      }
      else if( ! ev.target.checked){
        console.log("checked no");
        // EditorMagic.stopTool(_this.tool);
        // make this an event
      }
    }
    
    return box;
    
    // this.click = function(){
    //   box.click();
    // }
    
  }
  
  

  
}
