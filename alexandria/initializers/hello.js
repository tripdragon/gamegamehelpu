import { sayHello } from "utils/sayHello";
import { fish } from "narf";
import ECSThingy from "alexandria/initializers/ecs";

export default (store) => {

  console.log("fishfishfish", fish);
  console.log("ECSThingy", ECSThingy);
  sayHello(store);
};
