import { DialogInterface } from '../dialogInterface';

export class PlainDialog3D extends DialogInterface {

  show() {

    // if (!this.object3D), create it here
  }

  attach({ object3D, ...config }) {

    // Attach to object3D
    // Add ECS component to have it follow above bounding box of thingy thing
    // Do something w/ config
  }

  hide() {

    //
  }

  ref() {

    //
  }
}
