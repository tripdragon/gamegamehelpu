import { Object3DComponent } from 'alexandria/ecs/components';
import { addEntity } from 'bitecs';
import { store } from 'alexandria/store';

export const initECS = (obj) => {

  if (obj.eid) {
    return obj;
  }

  const ecsCore = store.state.ecs.core;
  const eid = addEntity(ecsCore, Object3DComponent);
  obj.eid = eid;

  return obj;
};
