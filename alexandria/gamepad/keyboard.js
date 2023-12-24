

// swap out for state system

// for now heres the basic example

export class Keyboard{
  
  
  keys = {};
  // keyCodes = {};
  mKeys = {};
  
  constructor(){
    const _this = this;
    window.onkeyup = function(ev) { 
      // _this.keysCode[ev.keyCode] = false; 
      _this.keys[ev.key] = false; 
    }
    window.onkeydown = function(ev) { 
      // _this.keysCode[ev.keyCode] = true; 
      _this.keys[ev.key] = true; 
      // console.log(pressedKeysCode);
      console.log(_this.keys);
    }
  }
  
}
