import { Mesh, BoxGeometry, MeshStandardMaterial, AxesHelper} from 'three';

export class RectangleMesh extends Mesh {

  constructor(props = {}){

    const {
      width = 1,
      height = 1,
      depth = 2,
      color = 0x00ff00,
      debug = false
    } = props;

    const geometry = new BoxGeometry(width, height, depth);
    const material = new MeshStandardMaterial({ color });

    super(geometry, material);

    this.castShadow = true;

    if (debug) {
      const axesHelper = new AxesHelper(1);
      this.add(axesHelper);
    }

    this.name = 'rectangley';

    // pick.matrixWorldAutoUpdate
    // debugger
    this.matrixAutoUpdate = false;
  }
}
