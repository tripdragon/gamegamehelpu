
import { SphereGeometry, MeshBasicMaterial, Mesh} from 'three';
import { store } from 'alexandria/store';


export function quickDrawBall(p0, size, color = 0x0000ff){
    
  const geometry = new SphereGeometry( size, 12, 12 ); 
  const material = new MeshBasicMaterial( { color: color } ); 
  const sphere = new Mesh( geometry, material );
  sphere.position.copy(p0);
  store.state.game.scene.add( sphere );
  sphere.geometry.computeBoundingBox();
  sphere.geometry.computeBoundingSphere();
  
}
