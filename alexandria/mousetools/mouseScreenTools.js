

import { Vector2, Raycaster } from 'three';

var rect;
const localPointer = new Vector2();
const vectortempppp = new Vector2();

const raycaster = new Raycaster();


// GetMousePositionToScreen(touchStartPos.x, touchStartPos.y, _o.renderer.domElement,  pointer2D);

export function GetMousePositionToScreen(xx,yy, domElement, vector2In){
  rect = domElement.getBoundingClientRect();
  vector2In.x = ( ( xx - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
  vector2In.y = - ( ( yy - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
}



/*

blegh 6 arguments
this mutates the vector3in to give a position to use
raycasterCube.position.copy(vector3in);

:D use

var floorPlane = new Plane(new Vector3(0,1,0), 0);
GetPositionOfRaycasterFromFloor({renderer:_o.renderer, ev:ev, camera: _o.camera, floorPlane: floorPlane, vector3in: targetVecOfPlane});
_o.raycasterCube.position.copy(targetVecOfPlane);

:x

*/

export function GetPositionOfRaycasterFromFloor({domElement, ev, camera, floorPlane, vector3in}){

  GetMousePositionToScreen(ev.clientX, ev.clientY, domElement,  localPointer);

  raycaster.setFromCamera( localPointer, camera );
  raycaster.ray.intersectPlane ( floorPlane, vector3in);
  
}
