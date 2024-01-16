import {
  Mesh,
  PlaneGeometry,
  MeshStandardMaterial,
  AxesHelper
} from 'three';

export class PlaneMesh extends Mesh {
  
  isPlaneMesh = true;
  isPrimitive = true;
  
  constructor(props = {}) {

    const {
      length = 1,
      width = 1,
      color = 0x00ff00,
      debug = false
    } = props;

    const geometry = new PlaneGeometry(length, width);
    const material = new MeshStandardMaterial({ color });

    super(geometry, material);

    if (debug) {
      const axesHelper = new AxesHelper(1);
      this.add(axesHelper);
    }

    this.name = 'planey';

    // debugger
    this.matrixAutoUpdate = false;
  }
}
