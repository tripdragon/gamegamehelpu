import { Mesh, BoxGeometry, MeshStandardMaterial, AxesHelper} from 'three';


// rectangle is the name for a 2d form, not 3d
// so research says Prism is correct
// Can also go with BoxMesh BUT Box conotates in the form of min max and that is not the task of this object
// Volume solves that
export class RectangularPrismMesh extends Mesh {
  
  isRectangularPrismMesh = true;
  isPrimitive = true;
  
  constructor(props = {}){

    const {
      width = 1,
      height = 1,
      depth = 1,
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
