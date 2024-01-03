

// only to be used as a dbug tool

import { LineBasicMaterial, Vector2, BufferGeometry, Line } from 'three';
import { store } from 'alexandria/store';


export function quickDrawLine(p0,p1, color = 0x0000ff){
  
  const material = new LineBasicMaterial({
  	color: color
  });

  const points = [p0,p1];
  const geometry = new BufferGeometry().setFromPoints( points );

  const line = new Line( geometry, material );
  store.state.game.scene.add( line );
  // line.computeBoundingBox();
  // line.computeBoundingSphere();

}
