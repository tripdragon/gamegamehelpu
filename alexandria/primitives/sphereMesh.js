import { Mesh, SphereGeometry, MeshStandardMaterial, AxesHelper } from 'three';

export class SphereMesh extends Mesh {
  
  isSphereMesh = true;
  isPrimitive = true;
  
  constructor(props = {}) {

    const {
      radius = 1,
      widthSegments = 12,
      heightSegments = 12,
      color = 0x00ff00,
      debug = false
    } = props;

    const geometry = new SphereGeometry(radius, widthSegments, heightSegments);
    const material = new MeshStandardMaterial({ color });

    super(geometry, material);

    this.castShadow = true;

    if (debug) {
      const axesHelper = new AxesHelper(1);
      this.add(axesHelper);
    }

    this.name = 'spherey';

    this.matrixAutoUpdate = false;
  }
}
