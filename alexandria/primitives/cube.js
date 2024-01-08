import { Mesh, BoxGeometry, MeshStandardMaterial, AxesHelper} from 'three';

export class Cube extends Mesh {

  constructor(props){

    const {
      size = 1,
      color = 0x00ff00,
      debug = false
    } = props;

    const geometry = new BoxGeometry(size, size, size);
    const material = new MeshStandardMaterial( { color } );

    super(geometry, material);

    this.castShadow = true;

    if (debug) {
      const axesHelper = new AxesHelper( 1 );
      this.add( axesHelper );
    }

    this.name = 'cubey';

    // pick.matrixWorldAutoUpdate
    // debugger
    this.matrixAutoUpdate = false;
  }
}
