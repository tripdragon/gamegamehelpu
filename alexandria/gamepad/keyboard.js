// swap out for state system

// for now heres the basic example

// https://stackoverflow.com/questions/1828613/check-if-a-key-is-down

export class Keyboard {

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
      // console.log(_this.keys);
    }
  }
}
