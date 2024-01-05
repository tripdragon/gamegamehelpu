

Preface this by saying we should just build the geometry instead of using 
cubeGeometry, BUT this makes it a little fail safe if three changes something


need to just group the verts by 3's so two sides = array of 8 points
since we dont compute the entire geo ourselves
8 arrays
3 points each since they overlap for each tri
3*3*2*2
3 pos floats, for 3 verts for 2 tris for 2 sides


so now we need full indexes 0 ~ 72
8 arrays, of indexes of positions representing a vertice [ [x,y,z], [a,b,c], [a,b,c] ]
Next we need to skip repeats of the next matches without yet another loop
we will mutate the array with 2's and skip those

mm here was from 
const pp = this.boxMesh.geometry.attributes.position.array;
when the initial size is 2

```js

mm = [1,1,1,1,1,-1,1,-1,1,1,-1,-1,-1,1,-1,-1,1,1,-1,-1,-1,-1,-1,1,-1,1,-1,1,1,-1,-1,1,1,1,1,1,-1,-1,1,1,-1,1,-1,-1,-1,1,-1,-1,-1,1,1,1,1,1,-1,-1,1,1,-1,1,1,1,-1,-1,1,-1,1,-1,-1,-1,-1,-1];

indexes = []
for (var ii = 0; ii < 8; ii++) {
  let aa = [ mm[ii*3], mm[ii*3+1], mm[ii*3+2] ];
  if( match(aa,[2,2,2]) ){
    continue;
  }
  let selects = [];
  
  for (var rr = 0; rr < len; rr++) {
    let bb = [ mm[rr*3], mm[rr*3+1], mm[rr*3+2] ];
    if(match(aa,bb)){
      selects.push( [ rr*3, rr*3+1, rr*3+2 ] );
      mm[rr*3] = 2; mm[rr*3+1] = 2; mm[rr*3+2] = 2;
    }
  }
  indexes.push(selects)
}
indexes

nn = indexes.flat()
nnn = nn.flat()
bb = nnn.sort(function(a, b) {
  return a - b;
});
// LOOKS like 0-71 !!!!

```
