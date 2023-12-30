
// might be based on lilgui
// might not
// task is to get selector and transform tools
// this or somethingelse might deal with thumbnails shelf

// none of these import systems work now with scss also doing something
// import './notlilguistyle.css';
// import './notlilguistyle.scss'; /* import the styles as a string */
// import styles from './notlilguistyle.css'; /* import the styles as a CSSStyleSheet */

// import styles from './notlilguistyle.scss'; /* import the styles as a CSSStyleSheet */

// import styles from './notlilguistyle.css' assert { type: 'css' }; /* import the styles as a CSSStyleSheet */

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
    // console.log(styles);

    // YUCK.....
    // its fugllllly but it works vs trying to make node imports work
    const inlinestyles = `

    #notlilgui {
      position: absolute;
      overflow: auto;
      height: auto;
      top: 0px;
      left: 0px;
      z-index: 2;
      background: #000000ba;
      width: 120px;
      /* min-height: 600px; */
      padding: 20px 0;
      border-right : 1px #3c3c3c solid;
      /* flex box */
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      justify-content: flex-start;
      align-content: stretch;
      align-items: center;
    }

    #notlilgui .item{

      background: white;
      width: 40px;
      height: 40px;
      margin-bottom: 12px;
      /* ___padding: 20px 0 0 0px; */
      border : 1px white solid;
      border-radius: 12px;
      appearance: none;
      background-position: center center;
      background-size: cover;
      background-repeat: no-repeat;
      background-color: transparent;
      overflow: hidden;

      /* order: 0; */
      /* flex: 0 1 auto; */
      /* align-self: auto; */

    }

    #notlilgui .item:checked {
      appearance: checkbox;
      border-radius: 12px;
    }
    `;

    document.head.insertAdjacentHTML("beforeend", `<style>${inlinestyles}</style>`);

    var panel = document.createElement('div');
    this.panel = panel;
    panel.id = 'notlilgui';

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
  addItem({type = '', imageurl = ''} = {}){
    // var item = document.createElement('div');
    // item.classList.add('item');
    // this.panel.appendChild(item);

    const box = this.buildCheckbox({imageurl});
    this.panel.appendChild(box);
    this.cache.add(box);
    this.checkboxes.add(box);
  }

  buildCheckbox({imageurl} = {}){

    // this.tool = tool;

    // needs more robotting
    const box = document.createElement('input');
    box.classList.add('item');
    box.classList.add('checkbox');
    box.type = 'checkbox';
    // item.style.backgroundImage = 'url(./Cast/Alien2.png)';
    console.log(imageurl);
    box.style.backgroundImage = `url(${imageurl})`;
    // box.style.backgroundColor = '#000000';
    // parent.appendChild(box);
    // cache.push(box);

    var _this = this;

    box.onclick = function(ev){
      _this.checkBoxChanged(ev.target);
      console.log(ev.target.checked);
      if(ev.target.checked){
        console.log('checked yes');
        // EditorMagic.changeTool(_this.tool);
        // make this an event
      }
      else if( ! ev.target.checked){
        console.log('checked no');
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
