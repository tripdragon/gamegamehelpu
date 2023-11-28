


Need an osolating technique
with peek and amp
so its always 0-1 and mid is 0.5
remap however
but it auto spins back and winds down

otherwise need a spring 



class Swinglite{
  
  canSwing = true;
  id = 0;
  callSpeed = 0.01;
  constructor( min=0, max=1, start= 0.5, speed=0.2, runtime=2 ){
    this.min = min;
    this.max = max;
    this.start = start;
    this.speed = speed;
    this.runtime = runtime;
  }
  run(){
    const _this = this;
    let savetime = 0;
    this.id = setInterval((x)=>{
      savetime += _this.speed;
      console.log("¿¿¿", savetime);
      if (savetime > this.runtime) {
        clearInterval(_this.id);
        console.log("stop");
      }
    },this.callSpeed)
  }
  
  stop(){
    clearInterval(this.id);
    console.log("stop");
  }
  
}

gg = new Swinglite()
gg.run()
