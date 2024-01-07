export default function timeSystem(core) {

  const { time } = core;
  const now = performance.now();
  const delta = now - time.then;
  time.delta = delta;
  time.elapsed += delta;
  time.then = now;

  return core;
}
