import { store } from 'alexandria/store';

export class Entities {
  entities = [];
  owner = null;
  constructor(owner) {
    this.owner = owner;
  }
  // this is redundant
  setOwner(owner) {
    this.owner = owner;
  }
  add(item) {
    this.entities.push(item);
    // item.owner = this.owner;
    item.setup(item.owner);
  }
  run() {
    for (var i = 0; i < this.entities.length; i++) {
      this.entities[i].update.call(this.owner);
    }
  }
}

export class Enty {
  // owner = null;
  name = '';
  update() {}
  start() {}
  setup() {}
  constructor(name = ''){
    this.name = name;
  }
}

export class Move extends Enty {
  update(){
    this.position.x += 0.01;
    // console.log(this.name);
  }
}

export class Spin extends Enty {
  update(){
    this.rotation.y += 0.01;
  }
}

export class KeyWalk extends Enty {
  setup() {
    // document.addEventListener( 'mousemove', onDocumentMouseMove );
    // document.addEventListener("keydown", (event) => this.stuff.bind(owner, event) );
  }
  constructor(walkSpeed = 0.1, spinSpeed = 0.05){
    super();
    // these wont read due to the .call above
    this.walkSpeed = walkSpeed;
    this.spinSpeed = spinSpeed;
  }
  //
  // stuff(ev){
  //   // debugger
  //   if(ev.key === "w") {
  //     // this.pos
  //     debugger
  //     this.translateZ( 0.1 );
  //   }
  //   if(ev.key === "s") {
  //     // this.pos
  //     this.translateZ( -0.1 );
  //   }
  // }
  update() {
    // if(store.state.keyboard.keys.w || store.state.keyboard.keys.ArrowUp) {
    //   debugger
    //   this.translateZ( this.walkSpeed );
    // }
    // if(store.state.keyboard.keys.s || store.state.keyboard.keys.ArrowDown) {
    //   this.translateZ( -this.walkSpeed );
    // }
    // if(store.state.keyboard.keys.a || store.state.keyboard.keys.ArrowLeft) {
    //   this.rotation.y += -this.spinSpeed;
    // }
    // if(store.state.keyboard.keys.d || store.state.keyboard.keys.ArrowRight) {
    //   this.rotation.y += this.spinSpeed;
    // }
    // debugger
    // doubling up the keys gives more POWER!!!
    // cant yet use the this.speed attrs cause this is from .call
    if(store.state.keyboard.keys.w) {
      this.translateZ( 0.05 );
    }
    if(store.state.keyboard.keys.ArrowUp) {
      this.translateZ( 0.05 );
    }
    if(store.state.keyboard.keys.s) {
      this.translateZ( -0.05);
    }
    if(store.state.keyboard.keys.ArrowDown) {
      this.translateZ( -0.05);
    }
    if(store.state.keyboard.keys.a) {
      this.rotation.y += 0.05;
    }
    if(store.state.keyboard.keys.ArrowLeft) {
      this.rotation.y += 0.05;
    }
    if(store.state.keyboard.keys.d) {
      this.rotation.y += -0.05;
    }
    if(store.state.keyboard.keys.ArrowRight) {
      this.rotation.y += -0.05;
    }
  }
  // update()
  // update(){
  //   // debugger
  //   let _this = this;
  //   document.onkeydown = function(ev) {
  //     if(ev.key === "w") {
  //       // this.pos
  //       // debugger
  //       _this.translateZ( 0.1 );
  //     }
  //     if(ev.key === "s") {
  //       // this.pos
  //       _this.translateZ( -0.1 );
  //     }
  //   }
  // }
}

export function Meep(name, func) {
  const aa = new Enty();
  aa.update = func;
  return aa;
}
