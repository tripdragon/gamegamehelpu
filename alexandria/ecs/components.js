import { defineComponent, Types } from 'bitecs';

const { f32 } = Types;

const Vector3 = { x: f32, y: f32, z: f32 };
const Quaternion = { x: f32, y: f32, z: f32, w: f32 };

export const TransformComponent = defineComponent({
  position: Vector3,
  rotation: Quaternion,
  scale: Vector3
});

export const VelocityComponent = defineComponent(Vector3);

export const Object3DComponent = defineComponent();

export const DynamicPhysicsComponent = defineComponent({
  objectId: [Types.ui32],
  objForColliderHandle: [Types.f64]
});

export const SleepingPhysicsComponent = defineComponent({
  objectId: [Types.ui32]
});
