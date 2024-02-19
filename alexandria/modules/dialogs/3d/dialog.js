import { DialogInterface } from '../dialogInterface';

export class Dialog3D extends DialogInterface {

  attach({ object3D, ...config }) {

    // Attach to object3D
    // Add ECS component to have it follow above bounding box of thingy thing
    // Do something w/ config
  }

  dismiss() {

    // Probly this.superDelete();
  }

  superDelete() {

    this.object3D.superDelete();
  }
}
