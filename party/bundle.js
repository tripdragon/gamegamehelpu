
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
// use
// const st = store.state.game;
// see GameGrapth for main global list of things
// #code: gaaame238 #

// stooooore stuuuufff
const listeners = [];
const internals = {};
const store = window.store = window._a = {
  state: {},
  setState: newState => {
    const changedSelectors = [];

    // Deep merge the new state
    internals.deepMerge(store.state, newState, changedSelectors);

    // Notify listeners with changed selectors
    internals.notifyListeners(changedSelectors);
  },
  subscribe: function (selector, callback) {
    // Add a callback listener for updates with optional deep selector
    listeners.push({
      selector,
      callback
    });

    // Return an unsubscribe function
    return () => {
      const index = listeners.findIndex(listener => listener.callback === callback);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    };
  },
  getState: function () {
    // Return a copy of the state to ensure immutability
    return {
      ...this.state
    };
  }
};
internals.deepMerge = (target, source, changedSelectors, currentSelector = '') => {
  for (const key in source) {
    // eslint-disable-next-line no-prototype-builtins
    if (source.hasOwnProperty(key)) {
      const propertyPath = currentSelector ? `${currentSelector}.${key}` : key;
      if (source[key] instanceof Object && key in target) {
        internals.deepMerge(target[key], source[key], changedSelectors, propertyPath);
      } else {
        if (target[key] !== source[key]) {
          changedSelectors.push(propertyPath);
        }
        target[key] = source[key];
      }
    }
  }
};
internals.notifyListeners = changedSelectors => {
  listeners.forEach(listener => {
    const selectorParts = listener.selector.split('.');
    const matchingSelectors = changedSelectors.filter(selector => selectorParts.some(part => selector.startsWith(part)));

    // Check if any part of the deep selector matches the changed selectors
    if (!listener.selector || matchingSelectors.length > 0) {
      listener.callback();
    }
  });
};

// src/Constants.js
var TYPES_ENUM = {
  i8: "i8",
  ui8: "ui8",
  ui8c: "ui8c",
  i16: "i16",
  ui16: "ui16",
  i32: "i32",
  ui32: "ui32",
  f32: "f32",
  f64: "f64",
  eid: "eid"
};
var TYPES_NAMES = {
  i8: "Int8",
  ui8: "Uint8",
  ui8c: "Uint8Clamped",
  i16: "Int16",
  ui16: "Uint16",
  i32: "Int32",
  ui32: "Uint32",
  eid: "Uint32",
  f32: "Float32",
  f64: "Float64"
};
var TYPES = {
  i8: Int8Array,
  ui8: Uint8Array,
  ui8c: Uint8ClampedArray,
  i16: Int16Array,
  ui16: Uint16Array,
  i32: Int32Array,
  ui32: Uint32Array,
  f32: Float32Array,
  f64: Float64Array,
  eid: Uint32Array
};
var UNSIGNED_MAX = {
  uint8: 2 ** 8,
  uint16: 2 ** 16,
  uint32: 2 ** 32
};

// src/Storage.js
var roundToMultiple = mul => x => Math.ceil(x / mul) * mul;
var roundToMultiple4 = roundToMultiple(4);
var $storeRef = Symbol("storeRef");
var $storeSize = Symbol("storeSize");
var $storeMaps = Symbol("storeMaps");
var $storeFlattened = Symbol("storeFlattened");
var $storeBase = Symbol("storeBase");
var $storeType = Symbol("storeType");
var $storeArrayElementCounts = Symbol("storeArrayElementCounts");
var $storeSubarrays = Symbol("storeSubarrays");
var $subarrayCursors = Symbol("subarrayCursors");
var $subarray = Symbol("subarray");
var $parentArray = Symbol("parentArray");
var $tagStore = Symbol("tagStore");
var $indexType = Symbol("indexType");
var $indexBytes = Symbol("indexBytes");
var $isEidType = Symbol("isEidType");
var stores = {};
var resize = (ta, size) => {
  const newBuffer = new ArrayBuffer(size * ta.BYTES_PER_ELEMENT);
  const newTa = new ta.constructor(newBuffer);
  newTa.set(ta, 0);
  return newTa;
};
var createShadow = (store, key) => {
  if (!ArrayBuffer.isView(store)) {
    const shadowStore = store[$parentArray].slice(0);
    store[key] = store.map((_, eid) => {
      const {
        length
      } = store[eid];
      const start = length * eid;
      const end = start + length;
      return shadowStore.subarray(start, end);
    });
  } else {
    store[key] = store.slice(0);
  }
};
var resetStoreFor = (store, eid) => {
  if (store[$storeFlattened]) {
    store[$storeFlattened].forEach(ta => {
      if (ArrayBuffer.isView(ta)) ta[eid] = 0;else ta[eid].fill(0);
    });
  }
};
var createTypeStore = (type, length) => {
  const totalBytes = length * TYPES[type].BYTES_PER_ELEMENT;
  const buffer = new ArrayBuffer(totalBytes);
  const store = new TYPES[type](buffer);
  store[$isEidType] = type === TYPES_ENUM.eid;
  return store;
};
var parentArray = store => store[$parentArray];
var createArrayStore = (metadata, type, length) => {
  const storeSize = metadata[$storeSize];
  const store = Array(storeSize).fill(0);
  store[$storeType] = type;
  store[$isEidType] = type === TYPES_ENUM.eid;
  const cursors = metadata[$subarrayCursors];
  const indexType = length <= UNSIGNED_MAX.uint8 ? TYPES_ENUM.ui8 : length <= UNSIGNED_MAX.uint16 ? TYPES_ENUM.ui16 : TYPES_ENUM.ui32;
  if (!length) throw new Error("bitECS - Must define component array length");
  if (!TYPES[type]) throw new Error(`bitECS - Invalid component array property type ${type}`);
  if (!metadata[$storeSubarrays][type]) {
    const arrayElementCount = metadata[$storeArrayElementCounts][type];
    const array = new TYPES[type](roundToMultiple4(arrayElementCount * storeSize));
    array[$indexType] = TYPES_NAMES[indexType];
    array[$indexBytes] = TYPES[indexType].BYTES_PER_ELEMENT;
    metadata[$storeSubarrays][type] = array;
  }
  const start = cursors[type];
  const end = start + storeSize * length;
  cursors[type] = end;
  store[$parentArray] = metadata[$storeSubarrays][type].subarray(start, end);
  for (let eid = 0; eid < storeSize; eid++) {
    const start2 = length * eid;
    const end2 = start2 + length;
    store[eid] = store[$parentArray].subarray(start2, end2);
    store[eid][$indexType] = TYPES_NAMES[indexType];
    store[eid][$indexBytes] = TYPES[indexType].BYTES_PER_ELEMENT;
    store[eid][$subarray] = true;
  }
  return store;
};
var isArrayType = x => Array.isArray(x) && typeof x[0] === "string" && typeof x[1] === "number";
var createStore = (schema, size) => {
  const $store = Symbol("store");
  if (!schema || !Object.keys(schema).length) {
    stores[$store] = {
      [$storeSize]: size,
      [$tagStore]: true,
      [$storeBase]: () => stores[$store]
    };
    return stores[$store];
  }
  schema = JSON.parse(JSON.stringify(schema));
  const arrayElementCounts = {};
  const collectArrayElementCounts = s => {
    const keys = Object.keys(s);
    for (const k of keys) {
      if (isArrayType(s[k])) {
        if (!arrayElementCounts[s[k][0]]) arrayElementCounts[s[k][0]] = 0;
        arrayElementCounts[s[k][0]] += s[k][1];
      } else if (s[k] instanceof Object) {
        collectArrayElementCounts(s[k]);
      }
    }
  };
  collectArrayElementCounts(schema);
  const metadata = {
    [$storeSize]: size,
    [$storeMaps]: {},
    [$storeSubarrays]: {},
    [$storeRef]: $store,
    [$subarrayCursors]: Object.keys(TYPES).reduce((a, type) => ({
      ...a,
      [type]: 0
    }), {}),
    [$storeFlattened]: [],
    [$storeArrayElementCounts]: arrayElementCounts
  };
  if (schema instanceof Object && Object.keys(schema).length) {
    const recursiveTransform = (a, k) => {
      if (typeof a[k] === "string") {
        a[k] = createTypeStore(a[k], size);
        a[k][$storeBase] = () => stores[$store];
        metadata[$storeFlattened].push(a[k]);
      } else if (isArrayType(a[k])) {
        const [type, length] = a[k];
        a[k] = createArrayStore(metadata, type, length);
        a[k][$storeBase] = () => stores[$store];
        metadata[$storeFlattened].push(a[k]);
      } else if (a[k] instanceof Object) {
        a[k] = Object.keys(a[k]).reduce(recursiveTransform, a[k]);
      }
      return a;
    };
    stores[$store] = Object.assign(Object.keys(schema).reduce(recursiveTransform, schema), metadata);
    stores[$store][$storeBase] = () => stores[$store];
    return stores[$store];
  }
};

// src/Util.js
var SparseSet = () => {
  const dense = [];
  const sparse = [];
  dense.sort = function (comparator) {
    const result = Array.prototype.sort.call(this, comparator);
    for (let i = 0; i < dense.length; i++) {
      sparse[dense[i]] = i;
    }
    return result;
  };
  const has = val => dense[sparse[val]] === val;
  const add = val => {
    if (has(val)) return;
    sparse[val] = dense.push(val) - 1;
  };
  const remove = val => {
    if (!has(val)) return;
    const index = sparse[val];
    const swapped = dense.pop();
    if (swapped !== val) {
      dense[index] = swapped;
      sparse[swapped] = index;
    }
  };
  const reset = () => {
    dense.length = 0;
    sparse.length = 0;
  };
  return {
    add,
    remove,
    has,
    sparse,
    dense,
    reset
  };
};

// src/Serialize.js
var DESERIALIZE_MODE = {
  REPLACE: 0,
  APPEND: 1,
  MAP: 2
};
var resized = false;
var setSerializationResized = v => {
  resized = v;
};
var concat = (a, v) => a.concat(v);
var not = fn => v => !fn(v);
var storeFlattened = c => c[$storeFlattened];
var isFullComponent = storeFlattened;
var isProperty = not(isFullComponent);
var isModifier = c => typeof c === "function" && c[$modifier];
var isNotModifier = not(isModifier);
var isChangedModifier = c => isModifier(c) && c()[1] === "changed";
var isWorld = w => Object.getOwnPropertySymbols(w).includes($componentMap);
var fromModifierToComponent = c => c()[0];
var canonicalize = target => {
  if (isWorld(target)) return [[], /* @__PURE__ */new Map()];
  const fullComponentProps = target.filter(isNotModifier).filter(isFullComponent).map(storeFlattened).reduce(concat, []);
  const changedComponentProps = target.filter(isChangedModifier).map(fromModifierToComponent).filter(isFullComponent).map(storeFlattened).reduce(concat, []);
  const props = target.filter(isNotModifier).filter(isProperty);
  const changedProps = target.filter(isChangedModifier).map(fromModifierToComponent).filter(isProperty);
  const componentProps = [...fullComponentProps, ...props, ...changedComponentProps, ...changedProps];
  const allChangedProps = [...changedComponentProps, ...changedProps].reduce((map, prop) => {
    const $ = Symbol();
    createShadow(prop, $);
    map.set(prop, $);
    return map;
  }, /* @__PURE__ */new Map());
  return [componentProps, allChangedProps];
};
var defineSerializer = (target, maxBytes = 2e7) => {
  const worldSerializer = isWorld(target);
  let [componentProps, changedProps] = canonicalize(target);
  const buffer = new ArrayBuffer(maxBytes);
  const view = new DataView(buffer);
  const entityComponentCache = /* @__PURE__ */new Map();
  return ents => {
    if (resized) {
      [componentProps, changedProps] = canonicalize(target);
      resized = false;
    }
    if (worldSerializer) {
      componentProps = [];
      target[$componentMap].forEach((c, component) => {
        if (component[$storeFlattened]) componentProps.push(...component[$storeFlattened]);else componentProps.push(component);
      });
    }
    let world;
    if (Object.getOwnPropertySymbols(ents).includes($componentMap)) {
      world = ents;
      ents = ents[$entityArray];
    } else {
      world = eidToWorld.get(ents[0]);
    }
    let where = 0;
    if (!ents.length) return buffer.slice(0, where);
    const cache = /* @__PURE__ */new Map();
    for (let pid = 0; pid < componentProps.length; pid++) {
      const prop = componentProps[pid];
      const component = prop[$storeBase]();
      const $diff = changedProps.get(prop);
      const shadow = $diff ? prop[$diff] : null;
      if (!cache.has(component)) cache.set(component, /* @__PURE__ */new Map());
      view.setUint8(where, pid);
      where += 1;
      const countWhere = where;
      where += 4;
      let writeCount = 0;
      for (let i = 0; i < ents.length; i++) {
        const eid = ents[i];
        let componentCache = entityComponentCache.get(eid);
        if (!componentCache) componentCache = entityComponentCache.set(eid, /* @__PURE__ */new Set()).get(eid);
        componentCache.add(eid);
        const newlyAddedComponent = shadow && cache.get(component).get(eid) || !componentCache.has(component) && hasComponent(world, component, eid);
        cache.get(component).set(eid, newlyAddedComponent);
        if (newlyAddedComponent) {
          componentCache.add(component);
        } else if (!hasComponent(world, component, eid)) {
          componentCache.delete(component);
          continue;
        }
        const rewindWhere = where;
        view.setUint32(where, eid);
        where += 4;
        if (prop[$tagStore]) {
          writeCount++;
          continue;
        }
        if (ArrayBuffer.isView(prop[eid])) {
          const type = prop[eid].constructor.name.replace("Array", "");
          const indexType = prop[eid][$indexType];
          const indexBytes = prop[eid][$indexBytes];
          const countWhere2 = where;
          where += indexBytes;
          let arrayWriteCount = 0;
          for (let i2 = 0; i2 < prop[eid].length; i2++) {
            if (shadow) {
              const changed = shadow[eid][i2] !== prop[eid][i2];
              shadow[eid][i2] = prop[eid][i2];
              if (!changed && !newlyAddedComponent) {
                continue;
              }
            }
            view[`set${indexType}`](where, i2);
            where += indexBytes;
            const value = prop[eid][i2];
            view[`set${type}`](where, value);
            where += prop[eid].BYTES_PER_ELEMENT;
            arrayWriteCount++;
          }
          if (arrayWriteCount > 0) {
            view[`set${indexType}`](countWhere2, arrayWriteCount);
            writeCount++;
          } else {
            where = rewindWhere;
            continue;
          }
        } else {
          if (shadow) {
            const changed = shadow[eid] !== prop[eid];
            shadow[eid] = prop[eid];
            if (!changed && !newlyAddedComponent) {
              where = rewindWhere;
              continue;
            }
          }
          const type = prop.constructor.name.replace("Array", "");
          view[`set${type}`](where, prop[eid]);
          where += prop.BYTES_PER_ELEMENT;
          writeCount++;
        }
      }
      if (writeCount > 0) {
        view.setUint32(countWhere, writeCount);
      } else {
        where -= 5;
      }
    }
    return buffer.slice(0, where);
  };
};
var newEntities = /* @__PURE__ */new Map();
var defineDeserializer = target => {
  const isWorld2 = Object.getOwnPropertySymbols(target).includes($componentMap);
  let [componentProps] = canonicalize(target);
  const deserializedEntities = /* @__PURE__ */new Set();
  return (world, packet, mode = 0) => {
    newEntities.clear();
    if (resized) {
      [componentProps] = canonicalize(target);
      resized = false;
    }
    if (isWorld2) {
      componentProps = [];
      target[$componentMap].forEach((c, component) => {
        if (component[$storeFlattened]) componentProps.push(...component[$storeFlattened]);else componentProps.push(component);
      });
    }
    const localEntities = world[$localEntities];
    const localEntityLookup = world[$localEntityLookup];
    const view = new DataView(packet);
    let where = 0;
    while (where < packet.byteLength) {
      const pid = view.getUint8(where);
      where += 1;
      const entityCount = view.getUint32(where);
      where += 4;
      const prop = componentProps[pid];
      for (let i = 0; i < entityCount; i++) {
        let eid = view.getUint32(where);
        where += 4;
        if (mode === DESERIALIZE_MODE.MAP) {
          if (localEntities.has(eid)) {
            eid = localEntities.get(eid);
          } else if (newEntities.has(eid)) {
            eid = newEntities.get(eid);
          } else {
            const newEid = addEntity(world);
            localEntities.set(eid, newEid);
            localEntityLookup.set(newEid, eid);
            newEntities.set(eid, newEid);
            eid = newEid;
          }
        }
        if (mode === DESERIALIZE_MODE.APPEND || mode === DESERIALIZE_MODE.REPLACE && !world[$entitySparseSet].has(eid)) {
          const newEid = newEntities.get(eid) || addEntity(world);
          newEntities.set(eid, newEid);
          eid = newEid;
        }
        const component = prop[$storeBase]();
        if (!hasComponent(world, component, eid)) {
          addComponent(world, component, eid);
        }
        deserializedEntities.add(eid);
        if (component[$tagStore]) {
          continue;
        }
        if (ArrayBuffer.isView(prop[eid])) {
          const array = prop[eid];
          const count = view[`get${array[$indexType]}`](where);
          where += array[$indexBytes];
          for (let i2 = 0; i2 < count; i2++) {
            const index = view[`get${array[$indexType]}`](where);
            where += array[$indexBytes];
            const value = view[`get${array.constructor.name.replace("Array", "")}`](where);
            where += array.BYTES_PER_ELEMENT;
            if (prop[$isEidType]) {
              let localEid;
              if (localEntities.has(value)) {
                localEid = localEntities.get(value);
              } else if (newEntities.has(value)) {
                localEid = newEntities.get(value);
              } else {
                const newEid = addEntity(world);
                localEntities.set(value, newEid);
                localEntityLookup.set(newEid, value);
                newEntities.set(value, newEid);
                localEid = newEid;
              }
              prop[eid][index] = localEid;
            } else prop[eid][index] = value;
          }
        } else {
          const value = view[`get${prop.constructor.name.replace("Array", "")}`](where);
          where += prop.BYTES_PER_ELEMENT;
          if (prop[$isEidType]) {
            let localEid;
            if (localEntities.has(value)) {
              localEid = localEntities.get(value);
            } else if (newEntities.has(value)) {
              localEid = newEntities.get(value);
            } else {
              const newEid = addEntity(world);
              localEntities.set(value, newEid);
              localEntityLookup.set(newEid, value);
              newEntities.set(value, newEid);
              localEid = newEid;
            }
            prop[eid] = localEid;
          } else prop[eid] = value;
        }
      }
    }
    const ents = Array.from(deserializedEntities);
    deserializedEntities.clear();
    return ents;
  };
};

// src/Entity.js
var $entityMasks = Symbol("entityMasks");
var $entityComponents = Symbol("entityComponents");
var $entitySparseSet = Symbol("entitySparseSet");
var $entityArray = Symbol("entityArray");
var defaultSize = 1e5;
var globalEntityCursor = 0;
var globalSize = defaultSize;
var getGlobalSize = () => globalSize;
var removed = [];
var recycled = [];
var defaultRemovedReuseThreshold = 0.01;
var removedReuseThreshold = defaultRemovedReuseThreshold;
var resetGlobals = () => {
  globalSize = defaultSize;
  globalEntityCursor = 0;
  removedReuseThreshold = defaultRemovedReuseThreshold;
  removed.length = 0;
  recycled.length = 0;
};
var setDefaultSize = newSize => {
  defaultSize = newSize;
  resetGlobals();
  globalSize = newSize;
  resizeWorlds(newSize);
  setSerializationResized(true);
};
var setRemovedRecycleThreshold = newThreshold => {
  removedReuseThreshold = newThreshold;
};
var getEntityCursor = () => globalEntityCursor;
var eidToWorld = /* @__PURE__ */new Map();
var flushRemovedEntities = world => {
  if (!world[$manualEntityRecycling]) {
    throw new Error("bitECS - cannot flush removed entities, enable feature with the enableManualEntityRecycling function");
  }
  removed.push(...recycled);
  recycled.length = 0;
};
var addEntity = world => {
  const eid = world[$manualEntityRecycling] ? removed.length ? removed.shift() : globalEntityCursor++ : removed.length > Math.round(globalSize * removedReuseThreshold) ? removed.shift() : globalEntityCursor++;
  if (eid > world[$size]) throw new Error("bitECS - max entities reached");
  world[$entitySparseSet].add(eid);
  eidToWorld.set(eid, world);
  world[$notQueries].forEach(q => {
    const match = queryCheckEntity(world, q, eid);
    if (match) queryAddEntity(q, eid);
  });
  world[$entityComponents].set(eid, /* @__PURE__ */new Set());
  return eid;
};
var removeEntity = (world, eid) => {
  if (!world[$entitySparseSet].has(eid)) return;
  world[$queries].forEach(q => {
    queryRemoveEntity(world, q, eid);
  });
  if (world[$manualEntityRecycling]) recycled.push(eid);else removed.push(eid);
  world[$entitySparseSet].remove(eid);
  world[$entityComponents].delete(eid);
  world[$localEntities].delete(world[$localEntityLookup].get(eid));
  world[$localEntityLookup].delete(eid);
  for (let i = 0; i < world[$entityMasks].length; i++) world[$entityMasks][i][eid] = 0;
};
var getEntityComponents = (world, eid) => {
  if (eid === void 0) throw new Error("bitECS - entity is undefined.");
  if (!world[$entitySparseSet].has(eid)) throw new Error("bitECS - entity does not exist in the world.");
  return Array.from(world[$entityComponents].get(eid));
};
var entityExists = (world, eid) => world[$entitySparseSet].has(eid);

// src/Query.js
var $modifier = Symbol("$modifier");
function modifier(c, mod) {
  const inner = () => [c, mod];
  inner[$modifier] = true;
  return inner;
}
var Not = c => modifier(c, "not");
var Changed = c => modifier(c, "changed");
var $queries = Symbol("queries");
var $notQueries = Symbol("notQueries");
var $queryAny = Symbol("queryAny");
var $queryAll = Symbol("queryAll");
var $queryNone = Symbol("queryNone");
var $queryMap = Symbol("queryMap");
var $dirtyQueries = Symbol("$dirtyQueries");
var $queryComponents = Symbol("queryComponents");
var empty = Object.freeze([]);
var enterQuery = query => world => {
  if (!world[$queryMap].has(query)) registerQuery(world, query);
  const q = world[$queryMap].get(query);
  if (q.entered.dense.length === 0) {
    return empty;
  } else {
    const results = q.entered.dense.slice();
    q.entered.reset();
    return results;
  }
};
var exitQuery = query => world => {
  if (!world[$queryMap].has(query)) registerQuery(world, query);
  const q = world[$queryMap].get(query);
  if (q.exited.dense.length === 0) {
    return empty;
  } else {
    const results = q.exited.dense.slice();
    q.exited.reset();
    return results;
  }
};
var registerQuery = (world, query) => {
  const components2 = [];
  const notComponents = [];
  const changedComponents = [];
  query[$queryComponents].forEach(c => {
    if (typeof c === "function" && c[$modifier]) {
      const [comp, mod] = c();
      if (!world[$componentMap].has(comp)) registerComponent(world, comp);
      if (mod === "not") {
        notComponents.push(comp);
      }
      if (mod === "changed") {
        changedComponents.push(comp);
        components2.push(comp);
      }
    } else {
      if (!world[$componentMap].has(c)) registerComponent(world, c);
      components2.push(c);
    }
  });
  const mapComponents = c => world[$componentMap].get(c);
  const allComponents = components2.concat(notComponents).map(mapComponents);
  const sparseSet = SparseSet();
  const archetypes = [];
  const changed = [];
  const toRemove = SparseSet();
  const entered = SparseSet();
  const exited = SparseSet();
  const generations = allComponents.map(c => c.generationId).reduce((a, v) => {
    if (a.includes(v)) return a;
    a.push(v);
    return a;
  }, []);
  const reduceBitflags = (a, c) => {
    if (!a[c.generationId]) a[c.generationId] = 0;
    a[c.generationId] |= c.bitflag;
    return a;
  };
  const masks = components2.map(mapComponents).reduce(reduceBitflags, {});
  const notMasks = notComponents.map(mapComponents).reduce(reduceBitflags, {});
  const hasMasks = allComponents.reduce(reduceBitflags, {});
  const flatProps = components2.filter(c => !c[$tagStore]).map(c => Object.getOwnPropertySymbols(c).includes($storeFlattened) ? c[$storeFlattened] : [c]).reduce((a, v) => a.concat(v), []);
  const shadows = [];
  const q = Object.assign(sparseSet, {
    archetypes,
    changed,
    components: components2,
    notComponents,
    changedComponents,
    allComponents,
    masks,
    notMasks,
    hasMasks,
    generations,
    flatProps,
    toRemove,
    entered,
    exited,
    shadows
  });
  world[$queryMap].set(query, q);
  world[$queries].add(q);
  allComponents.forEach(c => {
    c.queries.add(q);
  });
  if (notComponents.length) world[$notQueries].add(q);
  for (let eid = 0; eid < getEntityCursor(); eid++) {
    if (!world[$entitySparseSet].has(eid)) continue;
    const match = queryCheckEntity(world, q, eid);
    if (match) queryAddEntity(q, eid);
  }
};
var generateShadow = (q, pid) => {
  const $ = Symbol();
  const prop = q.flatProps[pid];
  createShadow(prop, $);
  q.shadows[pid] = prop[$];
  return prop[$];
};
var diff = (q, clearDiff) => {
  if (clearDiff) q.changed = [];
  const {
    flatProps,
    shadows
  } = q;
  for (let i = 0; i < q.dense.length; i++) {
    const eid = q.dense[i];
    let dirty = false;
    for (let pid = 0; pid < flatProps.length; pid++) {
      const prop = flatProps[pid];
      const shadow = shadows[pid] || generateShadow(q, pid);
      if (ArrayBuffer.isView(prop[eid])) {
        for (let i2 = 0; i2 < prop[eid].length; i2++) {
          if (prop[eid][i2] !== shadow[eid][i2]) {
            dirty = true;
            break;
          }
        }
        shadow[eid].set(prop[eid]);
      } else {
        if (prop[eid] !== shadow[eid]) {
          dirty = true;
          shadow[eid] = prop[eid];
        }
      }
    }
    if (dirty) q.changed.push(eid);
  }
  return q.changed;
};
var defineQuery = (...args) => {
  let components2;
  let any, all, none;
  if (Array.isArray(args[0])) {
    components2 = args[0];
  }
  if (components2 === void 0 || components2[$componentMap] !== void 0) {
    return world => world ? world[$entityArray] : components2[$entityArray];
  }
  const query = function (world, clearDiff = true) {
    if (!world[$queryMap].has(query)) registerQuery(world, query);
    const q = world[$queryMap].get(query);
    commitRemovals(world);
    if (q.changedComponents.length) return diff(q, clearDiff);
    return q.dense;
  };
  query[$queryComponents] = components2;
  query[$queryAny] = any;
  query[$queryAll] = all;
  query[$queryNone] = none;
  return query;
};
var queryCheckEntity = (world, q, eid) => {
  const {
    masks,
    notMasks,
    generations
  } = q;
  for (let i = 0; i < generations.length; i++) {
    const generationId = generations[i];
    const qMask = masks[generationId];
    const qNotMask = notMasks[generationId];
    const eMask = world[$entityMasks][generationId][eid];
    if (qNotMask && (eMask & qNotMask) !== 0) {
      return false;
    }
    if (qMask && (eMask & qMask) !== qMask) {
      return false;
    }
  }
  return true;
};
var queryAddEntity = (q, eid) => {
  q.toRemove.remove(eid);
  q.entered.add(eid);
  q.add(eid);
};
var queryCommitRemovals = q => {
  for (let i = q.toRemove.dense.length - 1; i >= 0; i--) {
    const eid = q.toRemove.dense[i];
    q.toRemove.remove(eid);
    q.remove(eid);
  }
};
var commitRemovals = world => {
  if (!world[$dirtyQueries].size) return;
  world[$dirtyQueries].forEach(queryCommitRemovals);
  world[$dirtyQueries].clear();
};
var queryRemoveEntity = (world, q, eid) => {
  if (!q.has(eid) || q.toRemove.has(eid)) return;
  q.toRemove.add(eid);
  world[$dirtyQueries].add(q);
  q.exited.add(eid);
};
var resetChangedQuery = (world, query) => {
  const q = world[$queryMap].get(query);
  q.changed = [];
};
var removeQuery = (world, query) => {
  const q = world[$queryMap].get(query);
  world[$queries].delete(q);
  world[$queryMap].delete(query);
};

// src/Component.js
var $componentMap = Symbol("componentMap");
var defineComponent = (schema, size) => {
  const component = createStore(schema, size || getGlobalSize());
  if (schema && Object.keys(schema).length) ;
  return component;
};
var incrementBitflag = world => {
  world[$bitflag] *= 2;
  if (world[$bitflag] >= 2 ** 31) {
    world[$bitflag] = 1;
    world[$entityMasks].push(new Uint32Array(world[$size]));
  }
};
var registerComponent = (world, component) => {
  if (!component) throw new Error(`bitECS - Cannot register null or undefined component`);
  const queries = /* @__PURE__ */new Set();
  const notQueries = /* @__PURE__ */new Set();
  const changedQueries = /* @__PURE__ */new Set();
  world[$queries].forEach(q => {
    if (q.allComponents.includes(component)) {
      queries.add(q);
    }
  });
  world[$componentMap].set(component, {
    generationId: world[$entityMasks].length - 1,
    bitflag: world[$bitflag],
    store: component,
    queries,
    notQueries,
    changedQueries
  });
  incrementBitflag(world);
};
var registerComponents = (world, components2) => {
  components2.forEach(c => registerComponent(world, c));
};
var hasComponent = (world, component, eid) => {
  const registeredComponent = world[$componentMap].get(component);
  if (!registeredComponent) return false;
  const {
    generationId,
    bitflag
  } = registeredComponent;
  const mask = world[$entityMasks][generationId][eid];
  return (mask & bitflag) === bitflag;
};
var addComponent = (world, component, eid, reset = false) => {
  if (eid === void 0) throw new Error("bitECS - entity is undefined.");
  if (!world[$entitySparseSet].has(eid)) throw new Error("bitECS - entity does not exist in the world.");
  if (!world[$componentMap].has(component)) registerComponent(world, component);
  if (hasComponent(world, component, eid)) return;
  const c = world[$componentMap].get(component);
  const {
    generationId,
    bitflag,
    queries,
    notQueries
  } = c;
  world[$entityMasks][generationId][eid] |= bitflag;
  queries.forEach(q => {
    q.toRemove.remove(eid);
    const match = queryCheckEntity(world, q, eid);
    if (match) {
      q.exited.remove(eid);
      queryAddEntity(q, eid);
    }
    if (!match) {
      q.entered.remove(eid);
      queryRemoveEntity(world, q, eid);
    }
  });
  world[$entityComponents].get(eid).add(component);
  if (reset) resetStoreFor(component, eid);
};
var removeComponent = (world, component, eid, reset = true) => {
  if (eid === void 0) throw new Error("bitECS - entity is undefined.");
  if (!world[$entitySparseSet].has(eid)) throw new Error("bitECS - entity does not exist in the world.");
  if (!hasComponent(world, component, eid)) return;
  const c = world[$componentMap].get(component);
  const {
    generationId,
    bitflag,
    queries
  } = c;
  world[$entityMasks][generationId][eid] &= ~bitflag;
  queries.forEach(q => {
    q.toRemove.remove(eid);
    const match = queryCheckEntity(world, q, eid);
    if (match) {
      q.exited.remove(eid);
      queryAddEntity(q, eid);
    }
    if (!match) {
      q.entered.remove(eid);
      queryRemoveEntity(world, q, eid);
    }
  });
  world[$entityComponents].get(eid).delete(component);
  if (reset) resetStoreFor(component, eid);
};

// src/World.js
var $size = Symbol("size");
var $resizeThreshold = Symbol("resizeThreshold");
var $bitflag = Symbol("bitflag");
var $archetypes = Symbol("archetypes");
var $localEntities = Symbol("localEntities");
var $localEntityLookup = Symbol("localEntityLookup");
var $manualEntityRecycling = Symbol("manualEntityRecycling");
var worlds = [];
var resizeWorlds = size => {
  worlds.forEach(world => {
    world[$size] = size;
    for (let i = 0; i < world[$entityMasks].length; i++) {
      const masks = world[$entityMasks][i];
      world[$entityMasks][i] = resize(masks, size);
    }
    world[$resizeThreshold] = world[$size] - world[$size] / 5;
  });
};
var createWorld = (...args) => {
  const world = typeof args[0] === "object" ? args[0] : {};
  const size = typeof args[0] === "number" ? args[0] : typeof args[1] === "number" ? args[1] : getGlobalSize();
  resetWorld(world, size);
  worlds.push(world);
  return world;
};
var enableManualEntityRecycling = world => {
  world[$manualEntityRecycling] = true;
};
var resetWorld = (world, size = getGlobalSize()) => {
  world[$size] = size;
  if (world[$entityArray]) world[$entityArray].forEach(eid => removeEntity(world, eid));
  world[$entityMasks] = [new Uint32Array(size)];
  world[$entityComponents] = /* @__PURE__ */new Map();
  world[$archetypes] = [];
  world[$entitySparseSet] = SparseSet();
  world[$entityArray] = world[$entitySparseSet].dense;
  world[$bitflag] = 1;
  world[$componentMap] = /* @__PURE__ */new Map();
  world[$queryMap] = /* @__PURE__ */new Map();
  world[$queries] = /* @__PURE__ */new Set();
  world[$notQueries] = /* @__PURE__ */new Set();
  world[$dirtyQueries] = /* @__PURE__ */new Set();
  world[$localEntities] = /* @__PURE__ */new Map();
  world[$localEntityLookup] = /* @__PURE__ */new Map();
  world[$manualEntityRecycling] = false;
  return world;
};
var deleteWorld = world => {
  Object.getOwnPropertySymbols(world).forEach($ => {
    delete world[$];
  });
  Object.keys(world).forEach(key => {
    delete world[key];
  });
  worlds.splice(worlds.indexOf(world), 1);
};
var getWorldComponents = world => Array.from(world[$componentMap].keys());
var getAllEntities = world => world[$entitySparseSet].dense.slice(0);

// src/System.js
var defineSystem = update => (world, ...args) => {
  update(world, ...args);
  return world;
};

// src/index.js
var pipe = (...fns) => input => {
  let tmp = input;
  for (let i = 0; i < fns.length; i++) {
    const fn = fns[i];
    tmp = fn(tmp);
  }
  return tmp;
};
var Types = TYPES_ENUM;

var BitECS = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Changed: Changed,
  DESERIALIZE_MODE: DESERIALIZE_MODE,
  Not: Not,
  Types: Types,
  addComponent: addComponent,
  addEntity: addEntity,
  commitRemovals: commitRemovals,
  createWorld: createWorld,
  defineComponent: defineComponent,
  defineDeserializer: defineDeserializer,
  defineQuery: defineQuery,
  defineSerializer: defineSerializer,
  defineSystem: defineSystem,
  deleteWorld: deleteWorld,
  enableManualEntityRecycling: enableManualEntityRecycling,
  enterQuery: enterQuery,
  entityExists: entityExists,
  exitQuery: exitQuery,
  flushRemovedEntities: flushRemovedEntities,
  getAllEntities: getAllEntities,
  getEntityComponents: getEntityComponents,
  getWorldComponents: getWorldComponents,
  hasComponent: hasComponent,
  parentArray: parentArray,
  pipe: pipe,
  registerComponent: registerComponent,
  registerComponents: registerComponents,
  removeComponent: removeComponent,
  removeEntity: removeEntity,
  removeQuery: removeQuery,
  resetChangedQuery: resetChangedQuery,
  resetGlobals: resetGlobals,
  resetWorld: resetWorld,
  setDefaultSize: setDefaultSize,
  setRemovedRecycleThreshold: setRemovedRecycleThreshold
});

var ECS = (store => {
  store.setState({
    ecs: {
      lib: BitECS,
      world: createWorld()
    }
  });
});

// swap out for state system

// for now heres the basic example

// https://stackoverflow.com/questions/1828613/check-if-a-key-is-down

let Keyboard$1 = class Keyboard {
  keys = {};
  // keyCodes = {};
  mKeys = {};
  constructor() {
    const _this = this;
    window.onkeyup = function (ev) {
      // _this.keysCode[ev.keyCode] = false;
      _this.keys[ev.key] = false;
    };
    window.onkeydown = function (ev) {
      // _this.keysCode[ev.keyCode] = true;
      _this.keys[ev.key] = true;
      // console.log(pressedKeysCode);
      // console.log(_this.keys);
    };
  }
};

var Keyboard = (store => {
  store.setState({
    keyboard: new Keyboard$1()
  });
});


var Physics = (async store => {
  await PI.init();
  store.setState({
    physics: {
      lib: PI,
      // fyi val 9 is hard on games in goofyness styles
      world: new PI.World({
        x: 0.0,
        y: -9.81,
        z: 0.0
      })
    }
  });
});

/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const REVISION='160';const MOUSE={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2};const TOUCH={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3};const CullFaceNone=0;const CullFaceBack=1;const CullFaceFront=2;const PCFShadowMap=1;const PCFSoftShadowMap=2;const VSMShadowMap=3;const FrontSide=0;const BackSide=1;const DoubleSide=2;const NoBlending=0;const NormalBlending=1;const AdditiveBlending=2;const SubtractiveBlending=3;const MultiplyBlending=4;const CustomBlending=5;const AddEquation=100;const SubtractEquation=101;const ReverseSubtractEquation=102;const MinEquation=103;const MaxEquation=104;const ZeroFactor=200;const OneFactor=201;const SrcColorFactor=202;const OneMinusSrcColorFactor=203;const SrcAlphaFactor=204;const OneMinusSrcAlphaFactor=205;const DstAlphaFactor=206;const OneMinusDstAlphaFactor=207;const DstColorFactor=208;const OneMinusDstColorFactor=209;const SrcAlphaSaturateFactor=210;const ConstantColorFactor=211;const OneMinusConstantColorFactor=212;const ConstantAlphaFactor=213;const OneMinusConstantAlphaFactor=214;const NeverDepth=0;const AlwaysDepth=1;const LessDepth=2;const LessEqualDepth=3;const EqualDepth=4;const GreaterEqualDepth=5;const GreaterDepth=6;const NotEqualDepth=7;const MultiplyOperation=0;const MixOperation=1;const AddOperation=2;const NoToneMapping=0;const LinearToneMapping=1;const ReinhardToneMapping=2;const CineonToneMapping=3;const ACESFilmicToneMapping=4;const CustomToneMapping=5;const AgXToneMapping=6;const AttachedBindMode='attached';const DetachedBindMode='detached';const UVMapping=300;const CubeReflectionMapping=301;const CubeRefractionMapping=302;const EquirectangularReflectionMapping=303;const EquirectangularRefractionMapping=304;const CubeUVReflectionMapping=306;const RepeatWrapping=1000;const ClampToEdgeWrapping=1001;const MirroredRepeatWrapping=1002;const NearestFilter=1003;const NearestMipmapNearestFilter=1004;const NearestMipmapLinearFilter=1005;const LinearFilter=1006;const LinearMipmapNearestFilter=1007;const LinearMipmapLinearFilter=1008;const UnsignedByteType=1009;const ByteType=1010;const ShortType=1011;const UnsignedShortType=1012;const IntType=1013;const UnsignedIntType=1014;const FloatType=1015;const HalfFloatType=1016;const UnsignedShort4444Type=1017;const UnsignedShort5551Type=1018;const UnsignedInt248Type=1020;const AlphaFormat=1021;const RGBAFormat=1023;const LuminanceFormat=1024;const LuminanceAlphaFormat=1025;const DepthFormat=1026;const DepthStencilFormat=1027;const RedFormat=1028;const RedIntegerFormat=1029;const RGFormat=1030;const RGIntegerFormat=1031;const RGBAIntegerFormat=1033;const RGB_S3TC_DXT1_Format=33776;const RGBA_S3TC_DXT1_Format=33777;const RGBA_S3TC_DXT3_Format=33778;const RGBA_S3TC_DXT5_Format=33779;const RGB_PVRTC_4BPPV1_Format=35840;const RGB_PVRTC_2BPPV1_Format=35841;const RGBA_PVRTC_4BPPV1_Format=35842;const RGBA_PVRTC_2BPPV1_Format=35843;const RGB_ETC1_Format=36196;const RGB_ETC2_Format=37492;const RGBA_ETC2_EAC_Format=37496;const RGBA_ASTC_4x4_Format=37808;const RGBA_ASTC_5x4_Format=37809;const RGBA_ASTC_5x5_Format=37810;const RGBA_ASTC_6x5_Format=37811;const RGBA_ASTC_6x6_Format=37812;const RGBA_ASTC_8x5_Format=37813;const RGBA_ASTC_8x6_Format=37814;const RGBA_ASTC_8x8_Format=37815;const RGBA_ASTC_10x5_Format=37816;const RGBA_ASTC_10x6_Format=37817;const RGBA_ASTC_10x8_Format=37818;const RGBA_ASTC_10x10_Format=37819;const RGBA_ASTC_12x10_Format=37820;const RGBA_ASTC_12x12_Format=37821;const RGBA_BPTC_Format=36492;const RGB_BPTC_SIGNED_Format=36494;const RGB_BPTC_UNSIGNED_Format=36495;const RED_RGTC1_Format=36283;const SIGNED_RED_RGTC1_Format=36284;const RED_GREEN_RGTC2_Format=36285;const SIGNED_RED_GREEN_RGTC2_Format=36286;const InterpolateDiscrete=2300;const InterpolateLinear=2301;const InterpolateSmooth=2302;const ZeroCurvatureEnding=2400;const ZeroSlopeEnding=2401;const WrapAroundEnding=2402;const NormalAnimationBlendMode=2500;const TrianglesDrawMode=0;const TriangleStripDrawMode=1;const TriangleFanDrawMode=2;/** @deprecated Use LinearSRGBColorSpace or NoColorSpace in three.js r152+. */const LinearEncoding=3000;/** @deprecated Use SRGBColorSpace in three.js r152+. */const sRGBEncoding=3001;const BasicDepthPacking=3200;const RGBADepthPacking=3201;const TangentSpaceNormalMap=0;const ObjectSpaceNormalMap=1;// Color space string identifiers, matching CSS Color Module Level 4 and WebGPU names where available.
const NoColorSpace='';const SRGBColorSpace='srgb';const LinearSRGBColorSpace='srgb-linear';const DisplayP3ColorSpace='display-p3';const LinearDisplayP3ColorSpace='display-p3-linear';const LinearTransfer='linear';const SRGBTransfer='srgb';const Rec709Primaries='rec709';const P3Primaries='p3';const KeepStencilOp=7680;const AlwaysStencilFunc=519;const NeverCompare=512;const LessCompare=513;const EqualCompare=514;const LessEqualCompare=515;const GreaterCompare=516;const NotEqualCompare=517;const GreaterEqualCompare=518;const AlwaysCompare=519;const StaticDrawUsage=35044;const GLSL3='300 es';const _SRGBAFormat=1035;// fallback for WebGL 1
const WebGLCoordinateSystem=2000;const WebGPUCoordinateSystem=2001;/**
 * https://github.com/mrdoob/eventdispatcher.js/
 */class EventDispatcher{addEventListener(type,listener){if(this._listeners===undefined)this._listeners={};const listeners=this._listeners;if(listeners[type]===undefined){listeners[type]=[];}if(listeners[type].indexOf(listener)===-1){listeners[type].push(listener);}}hasEventListener(type,listener){if(this._listeners===undefined)return false;const listeners=this._listeners;return listeners[type]!==undefined&&listeners[type].indexOf(listener)!==-1;}removeEventListener(type,listener){if(this._listeners===undefined)return;const listeners=this._listeners;const listenerArray=listeners[type];if(listenerArray!==undefined){const index=listenerArray.indexOf(listener);if(index!==-1){listenerArray.splice(index,1);}}}dispatchEvent(event){if(this._listeners===undefined)return;const listeners=this._listeners;const listenerArray=listeners[event.type];if(listenerArray!==undefined){event.target=this;// Make a copy, in case listeners are removed while iterating.
const array=listenerArray.slice(0);for(let i=0,l=array.length;i<l;i++){array[i].call(this,event);}event.target=null;}}}const _lut=['00','01','02','03','04','05','06','07','08','09','0a','0b','0c','0d','0e','0f','10','11','12','13','14','15','16','17','18','19','1a','1b','1c','1d','1e','1f','20','21','22','23','24','25','26','27','28','29','2a','2b','2c','2d','2e','2f','30','31','32','33','34','35','36','37','38','39','3a','3b','3c','3d','3e','3f','40','41','42','43','44','45','46','47','48','49','4a','4b','4c','4d','4e','4f','50','51','52','53','54','55','56','57','58','59','5a','5b','5c','5d','5e','5f','60','61','62','63','64','65','66','67','68','69','6a','6b','6c','6d','6e','6f','70','71','72','73','74','75','76','77','78','79','7a','7b','7c','7d','7e','7f','80','81','82','83','84','85','86','87','88','89','8a','8b','8c','8d','8e','8f','90','91','92','93','94','95','96','97','98','99','9a','9b','9c','9d','9e','9f','a0','a1','a2','a3','a4','a5','a6','a7','a8','a9','aa','ab','ac','ad','ae','af','b0','b1','b2','b3','b4','b5','b6','b7','b8','b9','ba','bb','bc','bd','be','bf','c0','c1','c2','c3','c4','c5','c6','c7','c8','c9','ca','cb','cc','cd','ce','cf','d0','d1','d2','d3','d4','d5','d6','d7','d8','d9','da','db','dc','dd','de','df','e0','e1','e2','e3','e4','e5','e6','e7','e8','e9','ea','eb','ec','ed','ee','ef','f0','f1','f2','f3','f4','f5','f6','f7','f8','f9','fa','fb','fc','fd','fe','ff'];let _seed=1234567;const DEG2RAD=Math.PI/180;const RAD2DEG=180/Math.PI;// http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
function generateUUID(){const d0=Math.random()*0xffffffff|0;const d1=Math.random()*0xffffffff|0;const d2=Math.random()*0xffffffff|0;const d3=Math.random()*0xffffffff|0;const uuid=_lut[d0&0xff]+_lut[d0>>8&0xff]+_lut[d0>>16&0xff]+_lut[d0>>24&0xff]+'-'+_lut[d1&0xff]+_lut[d1>>8&0xff]+'-'+_lut[d1>>16&0x0f|0x40]+_lut[d1>>24&0xff]+'-'+_lut[d2&0x3f|0x80]+_lut[d2>>8&0xff]+'-'+_lut[d2>>16&0xff]+_lut[d2>>24&0xff]+_lut[d3&0xff]+_lut[d3>>8&0xff]+_lut[d3>>16&0xff]+_lut[d3>>24&0xff];// .toLowerCase() here flattens concatenated strings to save heap memory space.
return uuid.toLowerCase();}function clamp(value,min,max){return Math.max(min,Math.min(max,value));}// compute euclidean modulo of m % n
// https://en.wikipedia.org/wiki/Modulo_operation
function euclideanModulo(n,m){return (n%m+m)%m;}// Linear mapping from range <a1, a2> to range <b1, b2>
function mapLinear(x,a1,a2,b1,b2){return b1+(x-a1)*(b2-b1)/(a2-a1);}// https://www.gamedev.net/tutorials/programming/general-and-gameplay-programming/inverse-lerp-a-super-useful-yet-often-overlooked-function-r5230/
function inverseLerp(x,y,value){if(x!==y){return (value-x)/(y-x);}else {return 0;}}// https://en.wikipedia.org/wiki/Linear_interpolation
function lerp(x,y,t){return (1-t)*x+t*y;}// http://www.rorydriscoll.com/2016/03/07/frame-rate-independent-damping-using-lerp/
function damp(x,y,lambda,dt){return lerp(x,y,1-Math.exp(-lambda*dt));}// https://www.desmos.com/calculator/vcsjnyz7x4
function pingpong(x,length=1){return length-Math.abs(euclideanModulo(x,length*2)-length);}// http://en.wikipedia.org/wiki/Smoothstep
function smoothstep(x,min,max){if(x<=min)return 0;if(x>=max)return 1;x=(x-min)/(max-min);return x*x*(3-2*x);}function smootherstep(x,min,max){if(x<=min)return 0;if(x>=max)return 1;x=(x-min)/(max-min);return x*x*x*(x*(x*6-15)+10);}// Random integer from <low, high> interval
function randInt(low,high){return low+Math.floor(Math.random()*(high-low+1));}// Random float from <low, high> interval
function randFloat(low,high){return low+Math.random()*(high-low);}// Random float from <-range/2, range/2> interval
function randFloatSpread(range){return range*(0.5-Math.random());}// Deterministic pseudo-random float in the interval [ 0, 1 ]
function seededRandom(s){if(s!==undefined)_seed=s;// Mulberry32 generator
let t=_seed+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;}function degToRad(degrees){return degrees*DEG2RAD;}function radToDeg(radians){return radians*RAD2DEG;}function isPowerOfTwo(value){return (value&value-1)===0&&value!==0;}function ceilPowerOfTwo(value){return Math.pow(2,Math.ceil(Math.log(value)/Math.LN2));}function floorPowerOfTwo(value){return Math.pow(2,Math.floor(Math.log(value)/Math.LN2));}function setQuaternionFromProperEuler(q,a,b,c,order){// Intrinsic Proper Euler Angles - see https://en.wikipedia.org/wiki/Euler_angles
// rotations are applied to the axes in the order specified by 'order'
// rotation by angle 'a' is applied first, then by angle 'b', then by angle 'c'
// angles are in radians
const cos=Math.cos;const sin=Math.sin;const c2=cos(b/2);const s2=sin(b/2);const c13=cos((a+c)/2);const s13=sin((a+c)/2);const c1_3=cos((a-c)/2);const s1_3=sin((a-c)/2);const c3_1=cos((c-a)/2);const s3_1=sin((c-a)/2);switch(order){case'XYX':q.set(c2*s13,s2*c1_3,s2*s1_3,c2*c13);break;case'YZY':q.set(s2*s1_3,c2*s13,s2*c1_3,c2*c13);break;case'ZXZ':q.set(s2*c1_3,s2*s1_3,c2*s13,c2*c13);break;case'XZX':q.set(c2*s13,s2*s3_1,s2*c3_1,c2*c13);break;case'YXY':q.set(s2*c3_1,c2*s13,s2*s3_1,c2*c13);break;case'ZYZ':q.set(s2*s3_1,s2*c3_1,c2*s13,c2*c13);break;default:console.warn('THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: '+order);}}function denormalize(value,array){switch(array.constructor){case Float32Array:return value;case Uint32Array:return value/4294967295.0;case Uint16Array:return value/65535.0;case Uint8Array:return value/255.0;case Int32Array:return Math.max(value/2147483647.0,-1.0);case Int16Array:return Math.max(value/32767.0,-1.0);case Int8Array:return Math.max(value/127.0,-1.0);default:throw new Error('Invalid component type.');}}function normalize(value,array){switch(array.constructor){case Float32Array:return value;case Uint32Array:return Math.round(value*4294967295.0);case Uint16Array:return Math.round(value*65535.0);case Uint8Array:return Math.round(value*255.0);case Int32Array:return Math.round(value*2147483647.0);case Int16Array:return Math.round(value*32767.0);case Int8Array:return Math.round(value*127.0);default:throw new Error('Invalid component type.');}}const MathUtils={DEG2RAD:DEG2RAD,RAD2DEG:RAD2DEG,generateUUID:generateUUID,clamp:clamp,euclideanModulo:euclideanModulo,mapLinear:mapLinear,inverseLerp:inverseLerp,lerp:lerp,damp:damp,pingpong:pingpong,smoothstep:smoothstep,smootherstep:smootherstep,randInt:randInt,randFloat:randFloat,randFloatSpread:randFloatSpread,seededRandom:seededRandom,degToRad:degToRad,radToDeg:radToDeg,isPowerOfTwo:isPowerOfTwo,ceilPowerOfTwo:ceilPowerOfTwo,floorPowerOfTwo:floorPowerOfTwo,setQuaternionFromProperEuler:setQuaternionFromProperEuler,normalize:normalize,denormalize:denormalize};class Vector2{constructor(x=0,y=0){Vector2.prototype.isVector2=true;this.x=x;this.y=y;}get width(){return this.x;}set width(value){this.x=value;}get height(){return this.y;}set height(value){this.y=value;}set(x,y){this.x=x;this.y=y;return this;}setScalar(scalar){this.x=scalar;this.y=scalar;return this;}setX(x){this.x=x;return this;}setY(y){this.y=y;return this;}setComponent(index,value){switch(index){case 0:this.x=value;break;case 1:this.y=value;break;default:throw new Error('index is out of range: '+index);}return this;}getComponent(index){switch(index){case 0:return this.x;case 1:return this.y;default:throw new Error('index is out of range: '+index);}}clone(){return new this.constructor(this.x,this.y);}copy(v){this.x=v.x;this.y=v.y;return this;}add(v){this.x+=v.x;this.y+=v.y;return this;}addScalar(s){this.x+=s;this.y+=s;return this;}addVectors(a,b){this.x=a.x+b.x;this.y=a.y+b.y;return this;}addScaledVector(v,s){this.x+=v.x*s;this.y+=v.y*s;return this;}sub(v){this.x-=v.x;this.y-=v.y;return this;}subScalar(s){this.x-=s;this.y-=s;return this;}subVectors(a,b){this.x=a.x-b.x;this.y=a.y-b.y;return this;}multiply(v){this.x*=v.x;this.y*=v.y;return this;}multiplyScalar(scalar){this.x*=scalar;this.y*=scalar;return this;}divide(v){this.x/=v.x;this.y/=v.y;return this;}divideScalar(scalar){return this.multiplyScalar(1/scalar);}applyMatrix3(m){const x=this.x,y=this.y;const e=m.elements;this.x=e[0]*x+e[3]*y+e[6];this.y=e[1]*x+e[4]*y+e[7];return this;}min(v){this.x=Math.min(this.x,v.x);this.y=Math.min(this.y,v.y);return this;}max(v){this.x=Math.max(this.x,v.x);this.y=Math.max(this.y,v.y);return this;}clamp(min,max){// assumes min < max, componentwise
this.x=Math.max(min.x,Math.min(max.x,this.x));this.y=Math.max(min.y,Math.min(max.y,this.y));return this;}clampScalar(minVal,maxVal){this.x=Math.max(minVal,Math.min(maxVal,this.x));this.y=Math.max(minVal,Math.min(maxVal,this.y));return this;}clampLength(min,max){const length=this.length();return this.divideScalar(length||1).multiplyScalar(Math.max(min,Math.min(max,length)));}floor(){this.x=Math.floor(this.x);this.y=Math.floor(this.y);return this;}ceil(){this.x=Math.ceil(this.x);this.y=Math.ceil(this.y);return this;}round(){this.x=Math.round(this.x);this.y=Math.round(this.y);return this;}roundToZero(){this.x=Math.trunc(this.x);this.y=Math.trunc(this.y);return this;}negate(){this.x=-this.x;this.y=-this.y;return this;}dot(v){return this.x*v.x+this.y*v.y;}cross(v){return this.x*v.y-this.y*v.x;}lengthSq(){return this.x*this.x+this.y*this.y;}length(){return Math.sqrt(this.x*this.x+this.y*this.y);}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y);}normalize(){return this.divideScalar(this.length()||1);}angle(){// computes the angle in radians with respect to the positive x-axis
const angle=Math.atan2(-this.y,-this.x)+Math.PI;return angle;}angleTo(v){const denominator=Math.sqrt(this.lengthSq()*v.lengthSq());if(denominator===0)return Math.PI/2;const theta=this.dot(v)/denominator;// clamp, to handle numerical problems
return Math.acos(clamp(theta,-1,1));}distanceTo(v){return Math.sqrt(this.distanceToSquared(v));}distanceToSquared(v){const dx=this.x-v.x,dy=this.y-v.y;return dx*dx+dy*dy;}manhattanDistanceTo(v){return Math.abs(this.x-v.x)+Math.abs(this.y-v.y);}setLength(length){return this.normalize().multiplyScalar(length);}lerp(v,alpha){this.x+=(v.x-this.x)*alpha;this.y+=(v.y-this.y)*alpha;return this;}lerpVectors(v1,v2,alpha){this.x=v1.x+(v2.x-v1.x)*alpha;this.y=v1.y+(v2.y-v1.y)*alpha;return this;}equals(v){return v.x===this.x&&v.y===this.y;}fromArray(array,offset=0){this.x=array[offset];this.y=array[offset+1];return this;}toArray(array=[],offset=0){array[offset]=this.x;array[offset+1]=this.y;return array;}fromBufferAttribute(attribute,index){this.x=attribute.getX(index);this.y=attribute.getY(index);return this;}rotateAround(center,angle){const c=Math.cos(angle),s=Math.sin(angle);const x=this.x-center.x;const y=this.y-center.y;this.x=x*c-y*s+center.x;this.y=x*s+y*c+center.y;return this;}random(){this.x=Math.random();this.y=Math.random();return this;}*[Symbol.iterator](){yield this.x;yield this.y;}}class Matrix3{constructor(n11,n12,n13,n21,n22,n23,n31,n32,n33){Matrix3.prototype.isMatrix3=true;this.elements=[1,0,0,0,1,0,0,0,1];if(n11!==undefined){this.set(n11,n12,n13,n21,n22,n23,n31,n32,n33);}}set(n11,n12,n13,n21,n22,n23,n31,n32,n33){const te=this.elements;te[0]=n11;te[1]=n21;te[2]=n31;te[3]=n12;te[4]=n22;te[5]=n32;te[6]=n13;te[7]=n23;te[8]=n33;return this;}identity(){this.set(1,0,0,0,1,0,0,0,1);return this;}copy(m){const te=this.elements;const me=m.elements;te[0]=me[0];te[1]=me[1];te[2]=me[2];te[3]=me[3];te[4]=me[4];te[5]=me[5];te[6]=me[6];te[7]=me[7];te[8]=me[8];return this;}extractBasis(xAxis,yAxis,zAxis){xAxis.setFromMatrix3Column(this,0);yAxis.setFromMatrix3Column(this,1);zAxis.setFromMatrix3Column(this,2);return this;}setFromMatrix4(m){const me=m.elements;this.set(me[0],me[4],me[8],me[1],me[5],me[9],me[2],me[6],me[10]);return this;}multiply(m){return this.multiplyMatrices(this,m);}premultiply(m){return this.multiplyMatrices(m,this);}multiplyMatrices(a,b){const ae=a.elements;const be=b.elements;const te=this.elements;const a11=ae[0],a12=ae[3],a13=ae[6];const a21=ae[1],a22=ae[4],a23=ae[7];const a31=ae[2],a32=ae[5],a33=ae[8];const b11=be[0],b12=be[3],b13=be[6];const b21=be[1],b22=be[4],b23=be[7];const b31=be[2],b32=be[5],b33=be[8];te[0]=a11*b11+a12*b21+a13*b31;te[3]=a11*b12+a12*b22+a13*b32;te[6]=a11*b13+a12*b23+a13*b33;te[1]=a21*b11+a22*b21+a23*b31;te[4]=a21*b12+a22*b22+a23*b32;te[7]=a21*b13+a22*b23+a23*b33;te[2]=a31*b11+a32*b21+a33*b31;te[5]=a31*b12+a32*b22+a33*b32;te[8]=a31*b13+a32*b23+a33*b33;return this;}multiplyScalar(s){const te=this.elements;te[0]*=s;te[3]*=s;te[6]*=s;te[1]*=s;te[4]*=s;te[7]*=s;te[2]*=s;te[5]*=s;te[8]*=s;return this;}determinant(){const te=this.elements;const a=te[0],b=te[1],c=te[2],d=te[3],e=te[4],f=te[5],g=te[6],h=te[7],i=te[8];return a*e*i-a*f*h-b*d*i+b*f*g+c*d*h-c*e*g;}invert(){const te=this.elements,n11=te[0],n21=te[1],n31=te[2],n12=te[3],n22=te[4],n32=te[5],n13=te[6],n23=te[7],n33=te[8],t11=n33*n22-n32*n23,t12=n32*n13-n33*n12,t13=n23*n12-n22*n13,det=n11*t11+n21*t12+n31*t13;if(det===0)return this.set(0,0,0,0,0,0,0,0,0);const detInv=1/det;te[0]=t11*detInv;te[1]=(n31*n23-n33*n21)*detInv;te[2]=(n32*n21-n31*n22)*detInv;te[3]=t12*detInv;te[4]=(n33*n11-n31*n13)*detInv;te[5]=(n31*n12-n32*n11)*detInv;te[6]=t13*detInv;te[7]=(n21*n13-n23*n11)*detInv;te[8]=(n22*n11-n21*n12)*detInv;return this;}transpose(){let tmp;const m=this.elements;tmp=m[1];m[1]=m[3];m[3]=tmp;tmp=m[2];m[2]=m[6];m[6]=tmp;tmp=m[5];m[5]=m[7];m[7]=tmp;return this;}getNormalMatrix(matrix4){return this.setFromMatrix4(matrix4).invert().transpose();}transposeIntoArray(r){const m=this.elements;r[0]=m[0];r[1]=m[3];r[2]=m[6];r[3]=m[1];r[4]=m[4];r[5]=m[7];r[6]=m[2];r[7]=m[5];r[8]=m[8];return this;}setUvTransform(tx,ty,sx,sy,rotation,cx,cy){const c=Math.cos(rotation);const s=Math.sin(rotation);this.set(sx*c,sx*s,-sx*(c*cx+s*cy)+cx+tx,-sy*s,sy*c,-sy*(-s*cx+c*cy)+cy+ty,0,0,1);return this;}//
scale(sx,sy){this.premultiply(_m3.makeScale(sx,sy));return this;}rotate(theta){this.premultiply(_m3.makeRotation(-theta));return this;}translate(tx,ty){this.premultiply(_m3.makeTranslation(tx,ty));return this;}// for 2D Transforms
makeTranslation(x,y){if(x.isVector2){this.set(1,0,x.x,0,1,x.y,0,0,1);}else {this.set(1,0,x,0,1,y,0,0,1);}return this;}makeRotation(theta){// counterclockwise
const c=Math.cos(theta);const s=Math.sin(theta);this.set(c,-s,0,s,c,0,0,0,1);return this;}makeScale(x,y){this.set(x,0,0,0,y,0,0,0,1);return this;}//
equals(matrix){const te=this.elements;const me=matrix.elements;for(let i=0;i<9;i++){if(te[i]!==me[i])return false;}return true;}fromArray(array,offset=0){for(let i=0;i<9;i++){this.elements[i]=array[i+offset];}return this;}toArray(array=[],offset=0){const te=this.elements;array[offset]=te[0];array[offset+1]=te[1];array[offset+2]=te[2];array[offset+3]=te[3];array[offset+4]=te[4];array[offset+5]=te[5];array[offset+6]=te[6];array[offset+7]=te[7];array[offset+8]=te[8];return array;}clone(){return new this.constructor().fromArray(this.elements);}}const _m3=/*@__PURE__*/new Matrix3();function arrayNeedsUint32(array){// assumes larger values usually on last
for(let i=array.length-1;i>=0;--i){if(array[i]>=65535)return true;// account for PRIMITIVE_RESTART_FIXED_INDEX, #24565
}return false;}function createElementNS(name){return document.createElementNS('http://www.w3.org/1999/xhtml',name);}function createCanvasElement(){const canvas=createElementNS('canvas');canvas.style.display='block';return canvas;}const _cache={};function warnOnce(message){if(message in _cache)return;_cache[message]=true;console.warn(message);}/**
 * Matrices converting P3 <-> Rec. 709 primaries, without gamut mapping
 * or clipping. Based on W3C specifications for sRGB and Display P3,
 * and ICC specifications for the D50 connection space. Values in/out
 * are _linear_ sRGB and _linear_ Display P3.
 *
 * Note that both sRGB and Display P3 use the sRGB transfer functions.
 *
 * Reference:
 * - http://www.russellcottrell.com/photo/matrixCalculator.htm
 */const LINEAR_SRGB_TO_LINEAR_DISPLAY_P3=/*@__PURE__*/new Matrix3().set(0.8224621,0.177538,0.0,0.0331941,0.9668058,0.0,0.0170827,0.0723974,0.9105199);const LINEAR_DISPLAY_P3_TO_LINEAR_SRGB=/*@__PURE__*/new Matrix3().set(1.2249401,-0.2249404,0.0,-0.0420569,1.0420571,0.0,-0.0196376,-0.0786361,1.0982735);/**
 * Defines supported color spaces by transfer function and primaries,
 * and provides conversions to/from the Linear-sRGB reference space.
 */const COLOR_SPACES={[LinearSRGBColorSpace]:{transfer:LinearTransfer,primaries:Rec709Primaries,toReference:color=>color,fromReference:color=>color},[SRGBColorSpace]:{transfer:SRGBTransfer,primaries:Rec709Primaries,toReference:color=>color.convertSRGBToLinear(),fromReference:color=>color.convertLinearToSRGB()},[LinearDisplayP3ColorSpace]:{transfer:LinearTransfer,primaries:P3Primaries,toReference:color=>color.applyMatrix3(LINEAR_DISPLAY_P3_TO_LINEAR_SRGB),fromReference:color=>color.applyMatrix3(LINEAR_SRGB_TO_LINEAR_DISPLAY_P3)},[DisplayP3ColorSpace]:{transfer:SRGBTransfer,primaries:P3Primaries,toReference:color=>color.convertSRGBToLinear().applyMatrix3(LINEAR_DISPLAY_P3_TO_LINEAR_SRGB),fromReference:color=>color.applyMatrix3(LINEAR_SRGB_TO_LINEAR_DISPLAY_P3).convertLinearToSRGB()}};const SUPPORTED_WORKING_COLOR_SPACES=new Set([LinearSRGBColorSpace,LinearDisplayP3ColorSpace]);const ColorManagement={enabled:true,_workingColorSpace:LinearSRGBColorSpace,get workingColorSpace(){return this._workingColorSpace;},set workingColorSpace(colorSpace){if(!SUPPORTED_WORKING_COLOR_SPACES.has(colorSpace)){throw new Error(`Unsupported working color space, "${colorSpace}".`);}this._workingColorSpace=colorSpace;},convert:function(color,sourceColorSpace,targetColorSpace){if(this.enabled===false||sourceColorSpace===targetColorSpace||!sourceColorSpace||!targetColorSpace){return color;}const sourceToReference=COLOR_SPACES[sourceColorSpace].toReference;const targetFromReference=COLOR_SPACES[targetColorSpace].fromReference;return targetFromReference(sourceToReference(color));},fromWorkingColorSpace:function(color,targetColorSpace){return this.convert(color,this._workingColorSpace,targetColorSpace);},toWorkingColorSpace:function(color,sourceColorSpace){return this.convert(color,sourceColorSpace,this._workingColorSpace);},getPrimaries:function(colorSpace){return COLOR_SPACES[colorSpace].primaries;},getTransfer:function(colorSpace){if(colorSpace===NoColorSpace)return LinearTransfer;return COLOR_SPACES[colorSpace].transfer;}};function SRGBToLinear(c){return c<0.04045?c*0.0773993808:Math.pow(c*0.9478672986+0.0521327014,2.4);}function LinearToSRGB(c){return c<0.0031308?c*12.92:1.055*Math.pow(c,0.41666)-0.055;}let _canvas;class ImageUtils{static getDataURL(image){if(/^data:/i.test(image.src)){return image.src;}if(typeof HTMLCanvasElement==='undefined'){return image.src;}let canvas;if(image instanceof HTMLCanvasElement){canvas=image;}else {if(_canvas===undefined)_canvas=createElementNS('canvas');_canvas.width=image.width;_canvas.height=image.height;const context=_canvas.getContext('2d');if(image instanceof ImageData){context.putImageData(image,0,0);}else {context.drawImage(image,0,0,image.width,image.height);}canvas=_canvas;}if(canvas.width>2048||canvas.height>2048){console.warn('THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons',image);return canvas.toDataURL('image/jpeg',0.6);}else {return canvas.toDataURL('image/png');}}static sRGBToLinear(image){if(typeof HTMLImageElement!=='undefined'&&image instanceof HTMLImageElement||typeof HTMLCanvasElement!=='undefined'&&image instanceof HTMLCanvasElement||typeof ImageBitmap!=='undefined'&&image instanceof ImageBitmap){const canvas=createElementNS('canvas');canvas.width=image.width;canvas.height=image.height;const context=canvas.getContext('2d');context.drawImage(image,0,0,image.width,image.height);const imageData=context.getImageData(0,0,image.width,image.height);const data=imageData.data;for(let i=0;i<data.length;i++){data[i]=SRGBToLinear(data[i]/255)*255;}context.putImageData(imageData,0,0);return canvas;}else if(image.data){const data=image.data.slice(0);for(let i=0;i<data.length;i++){if(data instanceof Uint8Array||data instanceof Uint8ClampedArray){data[i]=Math.floor(SRGBToLinear(data[i]/255)*255);}else {// assuming float
data[i]=SRGBToLinear(data[i]);}}return {data:data,width:image.width,height:image.height};}else {console.warn('THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.');return image;}}}let _sourceId=0;class Source{constructor(data=null){this.isSource=true;Object.defineProperty(this,'id',{value:_sourceId++});this.uuid=generateUUID();this.data=data;this.version=0;}set needsUpdate(value){if(value===true)this.version++;}toJSON(meta){const isRootObject=meta===undefined||typeof meta==='string';if(!isRootObject&&meta.images[this.uuid]!==undefined){return meta.images[this.uuid];}const output={uuid:this.uuid,url:''};const data=this.data;if(data!==null){let url;if(Array.isArray(data)){// cube texture
url=[];for(let i=0,l=data.length;i<l;i++){if(data[i].isDataTexture){url.push(serializeImage(data[i].image));}else {url.push(serializeImage(data[i]));}}}else {// texture
url=serializeImage(data);}output.url=url;}if(!isRootObject){meta.images[this.uuid]=output;}return output;}}function serializeImage(image){if(typeof HTMLImageElement!=='undefined'&&image instanceof HTMLImageElement||typeof HTMLCanvasElement!=='undefined'&&image instanceof HTMLCanvasElement||typeof ImageBitmap!=='undefined'&&image instanceof ImageBitmap){// default images
return ImageUtils.getDataURL(image);}else {if(image.data){// images of DataTexture
return {data:Array.from(image.data),width:image.width,height:image.height,type:image.data.constructor.name};}else {console.warn('THREE.Texture: Unable to serialize Texture.');return {};}}}let _textureId=0;class Texture extends EventDispatcher{constructor(image=Texture.DEFAULT_IMAGE,mapping=Texture.DEFAULT_MAPPING,wrapS=ClampToEdgeWrapping,wrapT=ClampToEdgeWrapping,magFilter=LinearFilter,minFilter=LinearMipmapLinearFilter,format=RGBAFormat,type=UnsignedByteType,anisotropy=Texture.DEFAULT_ANISOTROPY,colorSpace=NoColorSpace){super();this.isTexture=true;Object.defineProperty(this,'id',{value:_textureId++});this.uuid=generateUUID();this.name='';this.source=new Source(image);this.mipmaps=[];this.mapping=mapping;this.channel=0;this.wrapS=wrapS;this.wrapT=wrapT;this.magFilter=magFilter;this.minFilter=minFilter;this.anisotropy=anisotropy;this.format=format;this.internalFormat=null;this.type=type;this.offset=new Vector2(0,0);this.repeat=new Vector2(1,1);this.center=new Vector2(0,0);this.rotation=0;this.matrixAutoUpdate=true;this.matrix=new Matrix3();this.generateMipmaps=true;this.premultiplyAlpha=false;this.flipY=true;this.unpackAlignment=4;// valid values: 1, 2, 4, 8 (see http://www.khronos.org/opengles/sdk/docs/man/xhtml/glPixelStorei.xml)
if(typeof colorSpace==='string'){this.colorSpace=colorSpace;}else {// @deprecated, r152
warnOnce('THREE.Texture: Property .encoding has been replaced by .colorSpace.');this.colorSpace=colorSpace===sRGBEncoding?SRGBColorSpace:NoColorSpace;}this.userData={};this.version=0;this.onUpdate=null;this.isRenderTargetTexture=false;// indicates whether a texture belongs to a render target or not
this.needsPMREMUpdate=false;// indicates whether this texture should be processed by PMREMGenerator or not (only relevant for render target textures)
}get image(){return this.source.data;}set image(value=null){this.source.data=value;}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y);}clone(){return new this.constructor().copy(this);}copy(source){this.name=source.name;this.source=source.source;this.mipmaps=source.mipmaps.slice(0);this.mapping=source.mapping;this.channel=source.channel;this.wrapS=source.wrapS;this.wrapT=source.wrapT;this.magFilter=source.magFilter;this.minFilter=source.minFilter;this.anisotropy=source.anisotropy;this.format=source.format;this.internalFormat=source.internalFormat;this.type=source.type;this.offset.copy(source.offset);this.repeat.copy(source.repeat);this.center.copy(source.center);this.rotation=source.rotation;this.matrixAutoUpdate=source.matrixAutoUpdate;this.matrix.copy(source.matrix);this.generateMipmaps=source.generateMipmaps;this.premultiplyAlpha=source.premultiplyAlpha;this.flipY=source.flipY;this.unpackAlignment=source.unpackAlignment;this.colorSpace=source.colorSpace;this.userData=JSON.parse(JSON.stringify(source.userData));this.needsUpdate=true;return this;}toJSON(meta){const isRootObject=meta===undefined||typeof meta==='string';if(!isRootObject&&meta.textures[this.uuid]!==undefined){return meta.textures[this.uuid];}const output={metadata:{version:4.6,type:'Texture',generator:'Texture.toJSON'},uuid:this.uuid,name:this.name,image:this.source.toJSON(meta).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};if(Object.keys(this.userData).length>0)output.userData=this.userData;if(!isRootObject){meta.textures[this.uuid]=output;}return output;}dispose(){this.dispatchEvent({type:'dispose'});}transformUv(uv){if(this.mapping!==UVMapping)return uv;uv.applyMatrix3(this.matrix);if(uv.x<0||uv.x>1){switch(this.wrapS){case RepeatWrapping:uv.x=uv.x-Math.floor(uv.x);break;case ClampToEdgeWrapping:uv.x=uv.x<0?0:1;break;case MirroredRepeatWrapping:if(Math.abs(Math.floor(uv.x)%2)===1){uv.x=Math.ceil(uv.x)-uv.x;}else {uv.x=uv.x-Math.floor(uv.x);}break;}}if(uv.y<0||uv.y>1){switch(this.wrapT){case RepeatWrapping:uv.y=uv.y-Math.floor(uv.y);break;case ClampToEdgeWrapping:uv.y=uv.y<0?0:1;break;case MirroredRepeatWrapping:if(Math.abs(Math.floor(uv.y)%2)===1){uv.y=Math.ceil(uv.y)-uv.y;}else {uv.y=uv.y-Math.floor(uv.y);}break;}}if(this.flipY){uv.y=1-uv.y;}return uv;}set needsUpdate(value){if(value===true){this.version++;this.source.needsUpdate=true;}}get encoding(){// @deprecated, r152
warnOnce('THREE.Texture: Property .encoding has been replaced by .colorSpace.');return this.colorSpace===SRGBColorSpace?sRGBEncoding:LinearEncoding;}set encoding(encoding){// @deprecated, r152
warnOnce('THREE.Texture: Property .encoding has been replaced by .colorSpace.');this.colorSpace=encoding===sRGBEncoding?SRGBColorSpace:NoColorSpace;}}Texture.DEFAULT_IMAGE=null;Texture.DEFAULT_MAPPING=UVMapping;Texture.DEFAULT_ANISOTROPY=1;class Vector4{constructor(x=0,y=0,z=0,w=1){Vector4.prototype.isVector4=true;this.x=x;this.y=y;this.z=z;this.w=w;}get width(){return this.z;}set width(value){this.z=value;}get height(){return this.w;}set height(value){this.w=value;}set(x,y,z,w){this.x=x;this.y=y;this.z=z;this.w=w;return this;}setScalar(scalar){this.x=scalar;this.y=scalar;this.z=scalar;this.w=scalar;return this;}setX(x){this.x=x;return this;}setY(y){this.y=y;return this;}setZ(z){this.z=z;return this;}setW(w){this.w=w;return this;}setComponent(index,value){switch(index){case 0:this.x=value;break;case 1:this.y=value;break;case 2:this.z=value;break;case 3:this.w=value;break;default:throw new Error('index is out of range: '+index);}return this;}getComponent(index){switch(index){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error('index is out of range: '+index);}}clone(){return new this.constructor(this.x,this.y,this.z,this.w);}copy(v){this.x=v.x;this.y=v.y;this.z=v.z;this.w=v.w!==undefined?v.w:1;return this;}add(v){this.x+=v.x;this.y+=v.y;this.z+=v.z;this.w+=v.w;return this;}addScalar(s){this.x+=s;this.y+=s;this.z+=s;this.w+=s;return this;}addVectors(a,b){this.x=a.x+b.x;this.y=a.y+b.y;this.z=a.z+b.z;this.w=a.w+b.w;return this;}addScaledVector(v,s){this.x+=v.x*s;this.y+=v.y*s;this.z+=v.z*s;this.w+=v.w*s;return this;}sub(v){this.x-=v.x;this.y-=v.y;this.z-=v.z;this.w-=v.w;return this;}subScalar(s){this.x-=s;this.y-=s;this.z-=s;this.w-=s;return this;}subVectors(a,b){this.x=a.x-b.x;this.y=a.y-b.y;this.z=a.z-b.z;this.w=a.w-b.w;return this;}multiply(v){this.x*=v.x;this.y*=v.y;this.z*=v.z;this.w*=v.w;return this;}multiplyScalar(scalar){this.x*=scalar;this.y*=scalar;this.z*=scalar;this.w*=scalar;return this;}applyMatrix4(m){const x=this.x,y=this.y,z=this.z,w=this.w;const e=m.elements;this.x=e[0]*x+e[4]*y+e[8]*z+e[12]*w;this.y=e[1]*x+e[5]*y+e[9]*z+e[13]*w;this.z=e[2]*x+e[6]*y+e[10]*z+e[14]*w;this.w=e[3]*x+e[7]*y+e[11]*z+e[15]*w;return this;}divideScalar(scalar){return this.multiplyScalar(1/scalar);}setAxisAngleFromQuaternion(q){// http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/index.htm
// q is assumed to be normalized
this.w=2*Math.acos(q.w);const s=Math.sqrt(1-q.w*q.w);if(s<0.0001){this.x=1;this.y=0;this.z=0;}else {this.x=q.x/s;this.y=q.y/s;this.z=q.z/s;}return this;}setAxisAngleFromRotationMatrix(m){// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToAngle/index.htm
// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
let angle,x,y,z;// variables for result
const epsilon=0.01,// margin to allow for rounding errors
epsilon2=0.1,// margin to distinguish between 0 and 180 degrees
te=m.elements,m11=te[0],m12=te[4],m13=te[8],m21=te[1],m22=te[5],m23=te[9],m31=te[2],m32=te[6],m33=te[10];if(Math.abs(m12-m21)<epsilon&&Math.abs(m13-m31)<epsilon&&Math.abs(m23-m32)<epsilon){// singularity found
// first check for identity matrix which must have +1 for all terms
// in leading diagonal and zero in other terms
if(Math.abs(m12+m21)<epsilon2&&Math.abs(m13+m31)<epsilon2&&Math.abs(m23+m32)<epsilon2&&Math.abs(m11+m22+m33-3)<epsilon2){// this singularity is identity matrix so angle = 0
this.set(1,0,0,0);return this;// zero angle, arbitrary axis
}// otherwise this singularity is angle = 180
angle=Math.PI;const xx=(m11+1)/2;const yy=(m22+1)/2;const zz=(m33+1)/2;const xy=(m12+m21)/4;const xz=(m13+m31)/4;const yz=(m23+m32)/4;if(xx>yy&&xx>zz){// m11 is the largest diagonal term
if(xx<epsilon){x=0;y=0.707106781;z=0.707106781;}else {x=Math.sqrt(xx);y=xy/x;z=xz/x;}}else if(yy>zz){// m22 is the largest diagonal term
if(yy<epsilon){x=0.707106781;y=0;z=0.707106781;}else {y=Math.sqrt(yy);x=xy/y;z=yz/y;}}else {// m33 is the largest diagonal term so base result on this
if(zz<epsilon){x=0.707106781;y=0.707106781;z=0;}else {z=Math.sqrt(zz);x=xz/z;y=yz/z;}}this.set(x,y,z,angle);return this;// return 180 deg rotation
}// as we have reached here there are no singularities so we can handle normally
let s=Math.sqrt((m32-m23)*(m32-m23)+(m13-m31)*(m13-m31)+(m21-m12)*(m21-m12));// used to normalize
if(Math.abs(s)<0.001)s=1;// prevent divide by zero, should not happen if matrix is orthogonal and should be
// caught by singularity test above, but I've left it in just in case
this.x=(m32-m23)/s;this.y=(m13-m31)/s;this.z=(m21-m12)/s;this.w=Math.acos((m11+m22+m33-1)/2);return this;}min(v){this.x=Math.min(this.x,v.x);this.y=Math.min(this.y,v.y);this.z=Math.min(this.z,v.z);this.w=Math.min(this.w,v.w);return this;}max(v){this.x=Math.max(this.x,v.x);this.y=Math.max(this.y,v.y);this.z=Math.max(this.z,v.z);this.w=Math.max(this.w,v.w);return this;}clamp(min,max){// assumes min < max, componentwise
this.x=Math.max(min.x,Math.min(max.x,this.x));this.y=Math.max(min.y,Math.min(max.y,this.y));this.z=Math.max(min.z,Math.min(max.z,this.z));this.w=Math.max(min.w,Math.min(max.w,this.w));return this;}clampScalar(minVal,maxVal){this.x=Math.max(minVal,Math.min(maxVal,this.x));this.y=Math.max(minVal,Math.min(maxVal,this.y));this.z=Math.max(minVal,Math.min(maxVal,this.z));this.w=Math.max(minVal,Math.min(maxVal,this.w));return this;}clampLength(min,max){const length=this.length();return this.divideScalar(length||1).multiplyScalar(Math.max(min,Math.min(max,length)));}floor(){this.x=Math.floor(this.x);this.y=Math.floor(this.y);this.z=Math.floor(this.z);this.w=Math.floor(this.w);return this;}ceil(){this.x=Math.ceil(this.x);this.y=Math.ceil(this.y);this.z=Math.ceil(this.z);this.w=Math.ceil(this.w);return this;}round(){this.x=Math.round(this.x);this.y=Math.round(this.y);this.z=Math.round(this.z);this.w=Math.round(this.w);return this;}roundToZero(){this.x=Math.trunc(this.x);this.y=Math.trunc(this.y);this.z=Math.trunc(this.z);this.w=Math.trunc(this.w);return this;}negate(){this.x=-this.x;this.y=-this.y;this.z=-this.z;this.w=-this.w;return this;}dot(v){return this.x*v.x+this.y*v.y+this.z*v.z+this.w*v.w;}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w;}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w);}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w);}normalize(){return this.divideScalar(this.length()||1);}setLength(length){return this.normalize().multiplyScalar(length);}lerp(v,alpha){this.x+=(v.x-this.x)*alpha;this.y+=(v.y-this.y)*alpha;this.z+=(v.z-this.z)*alpha;this.w+=(v.w-this.w)*alpha;return this;}lerpVectors(v1,v2,alpha){this.x=v1.x+(v2.x-v1.x)*alpha;this.y=v1.y+(v2.y-v1.y)*alpha;this.z=v1.z+(v2.z-v1.z)*alpha;this.w=v1.w+(v2.w-v1.w)*alpha;return this;}equals(v){return v.x===this.x&&v.y===this.y&&v.z===this.z&&v.w===this.w;}fromArray(array,offset=0){this.x=array[offset];this.y=array[offset+1];this.z=array[offset+2];this.w=array[offset+3];return this;}toArray(array=[],offset=0){array[offset]=this.x;array[offset+1]=this.y;array[offset+2]=this.z;array[offset+3]=this.w;return array;}fromBufferAttribute(attribute,index){this.x=attribute.getX(index);this.y=attribute.getY(index);this.z=attribute.getZ(index);this.w=attribute.getW(index);return this;}random(){this.x=Math.random();this.y=Math.random();this.z=Math.random();this.w=Math.random();return this;}*[Symbol.iterator](){yield this.x;yield this.y;yield this.z;yield this.w;}}/*
 In options, we can specify:
 * Texture parameters for an auto-generated target texture
 * depthBuffer/stencilBuffer: Booleans to indicate if we should generate these buffers
*/class RenderTarget extends EventDispatcher{constructor(width=1,height=1,options={}){super();this.isRenderTarget=true;this.width=width;this.height=height;this.depth=1;this.scissor=new Vector4(0,0,width,height);this.scissorTest=false;this.viewport=new Vector4(0,0,width,height);const image={width:width,height:height,depth:1};if(options.encoding!==undefined){// @deprecated, r152
warnOnce('THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace.');options.colorSpace=options.encoding===sRGBEncoding?SRGBColorSpace:NoColorSpace;}options=Object.assign({generateMipmaps:false,internalFormat:null,minFilter:LinearFilter,depthBuffer:true,stencilBuffer:false,depthTexture:null,samples:0},options);this.texture=new Texture(image,options.mapping,options.wrapS,options.wrapT,options.magFilter,options.minFilter,options.format,options.type,options.anisotropy,options.colorSpace);this.texture.isRenderTargetTexture=true;this.texture.flipY=false;this.texture.generateMipmaps=options.generateMipmaps;this.texture.internalFormat=options.internalFormat;this.depthBuffer=options.depthBuffer;this.stencilBuffer=options.stencilBuffer;this.depthTexture=options.depthTexture;this.samples=options.samples;}setSize(width,height,depth=1){if(this.width!==width||this.height!==height||this.depth!==depth){this.width=width;this.height=height;this.depth=depth;this.texture.image.width=width;this.texture.image.height=height;this.texture.image.depth=depth;this.dispose();}this.viewport.set(0,0,width,height);this.scissor.set(0,0,width,height);}clone(){return new this.constructor().copy(this);}copy(source){this.width=source.width;this.height=source.height;this.depth=source.depth;this.scissor.copy(source.scissor);this.scissorTest=source.scissorTest;this.viewport.copy(source.viewport);this.texture=source.texture.clone();this.texture.isRenderTargetTexture=true;// ensure image object is not shared, see #20328
const image=Object.assign({},source.texture.image);this.texture.source=new Source(image);this.depthBuffer=source.depthBuffer;this.stencilBuffer=source.stencilBuffer;if(source.depthTexture!==null)this.depthTexture=source.depthTexture.clone();this.samples=source.samples;return this;}dispose(){this.dispatchEvent({type:'dispose'});}}class WebGLRenderTarget extends RenderTarget{constructor(width=1,height=1,options={}){super(width,height,options);this.isWebGLRenderTarget=true;}}class DataArrayTexture extends Texture{constructor(data=null,width=1,height=1,depth=1){super(null);this.isDataArrayTexture=true;this.image={data,width,height,depth};this.magFilter=NearestFilter;this.minFilter=NearestFilter;this.wrapR=ClampToEdgeWrapping;this.generateMipmaps=false;this.flipY=false;this.unpackAlignment=1;}}class Data3DTexture extends Texture{constructor(data=null,width=1,height=1,depth=1){// We're going to add .setXXX() methods for setting properties later.
// Users can still set in DataTexture3D directly.
//
//	const texture = new THREE.DataTexture3D( data, width, height, depth );
// 	texture.anisotropy = 16;
//
// See #14839
super(null);this.isData3DTexture=true;this.image={data,width,height,depth};this.magFilter=NearestFilter;this.minFilter=NearestFilter;this.wrapR=ClampToEdgeWrapping;this.generateMipmaps=false;this.flipY=false;this.unpackAlignment=1;}}class Quaternion{constructor(x=0,y=0,z=0,w=1){this.isQuaternion=true;this._x=x;this._y=y;this._z=z;this._w=w;}static slerpFlat(dst,dstOffset,src0,srcOffset0,src1,srcOffset1,t){// fuzz-free, array-based Quaternion SLERP operation
let x0=src0[srcOffset0+0],y0=src0[srcOffset0+1],z0=src0[srcOffset0+2],w0=src0[srcOffset0+3];const x1=src1[srcOffset1+0],y1=src1[srcOffset1+1],z1=src1[srcOffset1+2],w1=src1[srcOffset1+3];if(t===0){dst[dstOffset+0]=x0;dst[dstOffset+1]=y0;dst[dstOffset+2]=z0;dst[dstOffset+3]=w0;return;}if(t===1){dst[dstOffset+0]=x1;dst[dstOffset+1]=y1;dst[dstOffset+2]=z1;dst[dstOffset+3]=w1;return;}if(w0!==w1||x0!==x1||y0!==y1||z0!==z1){let s=1-t;const cos=x0*x1+y0*y1+z0*z1+w0*w1,dir=cos>=0?1:-1,sqrSin=1-cos*cos;// Skip the Slerp for tiny steps to avoid numeric problems:
if(sqrSin>Number.EPSILON){const sin=Math.sqrt(sqrSin),len=Math.atan2(sin,cos*dir);s=Math.sin(s*len)/sin;t=Math.sin(t*len)/sin;}const tDir=t*dir;x0=x0*s+x1*tDir;y0=y0*s+y1*tDir;z0=z0*s+z1*tDir;w0=w0*s+w1*tDir;// Normalize in case we just did a lerp:
if(s===1-t){const f=1/Math.sqrt(x0*x0+y0*y0+z0*z0+w0*w0);x0*=f;y0*=f;z0*=f;w0*=f;}}dst[dstOffset]=x0;dst[dstOffset+1]=y0;dst[dstOffset+2]=z0;dst[dstOffset+3]=w0;}static multiplyQuaternionsFlat(dst,dstOffset,src0,srcOffset0,src1,srcOffset1){const x0=src0[srcOffset0];const y0=src0[srcOffset0+1];const z0=src0[srcOffset0+2];const w0=src0[srcOffset0+3];const x1=src1[srcOffset1];const y1=src1[srcOffset1+1];const z1=src1[srcOffset1+2];const w1=src1[srcOffset1+3];dst[dstOffset]=x0*w1+w0*x1+y0*z1-z0*y1;dst[dstOffset+1]=y0*w1+w0*y1+z0*x1-x0*z1;dst[dstOffset+2]=z0*w1+w0*z1+x0*y1-y0*x1;dst[dstOffset+3]=w0*w1-x0*x1-y0*y1-z0*z1;return dst;}get x(){return this._x;}set x(value){this._x=value;this._onChangeCallback();}get y(){return this._y;}set y(value){this._y=value;this._onChangeCallback();}get z(){return this._z;}set z(value){this._z=value;this._onChangeCallback();}get w(){return this._w;}set w(value){this._w=value;this._onChangeCallback();}set(x,y,z,w){this._x=x;this._y=y;this._z=z;this._w=w;this._onChangeCallback();return this;}clone(){return new this.constructor(this._x,this._y,this._z,this._w);}copy(quaternion){this._x=quaternion.x;this._y=quaternion.y;this._z=quaternion.z;this._w=quaternion.w;this._onChangeCallback();return this;}setFromEuler(euler,update=true){const x=euler._x,y=euler._y,z=euler._z,order=euler._order;// http://www.mathworks.com/matlabcentral/fileexchange/
// 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
//	content/SpinCalc.m
const cos=Math.cos;const sin=Math.sin;const c1=cos(x/2);const c2=cos(y/2);const c3=cos(z/2);const s1=sin(x/2);const s2=sin(y/2);const s3=sin(z/2);switch(order){case'XYZ':this._x=s1*c2*c3+c1*s2*s3;this._y=c1*s2*c3-s1*c2*s3;this._z=c1*c2*s3+s1*s2*c3;this._w=c1*c2*c3-s1*s2*s3;break;case'YXZ':this._x=s1*c2*c3+c1*s2*s3;this._y=c1*s2*c3-s1*c2*s3;this._z=c1*c2*s3-s1*s2*c3;this._w=c1*c2*c3+s1*s2*s3;break;case'ZXY':this._x=s1*c2*c3-c1*s2*s3;this._y=c1*s2*c3+s1*c2*s3;this._z=c1*c2*s3+s1*s2*c3;this._w=c1*c2*c3-s1*s2*s3;break;case'ZYX':this._x=s1*c2*c3-c1*s2*s3;this._y=c1*s2*c3+s1*c2*s3;this._z=c1*c2*s3-s1*s2*c3;this._w=c1*c2*c3+s1*s2*s3;break;case'YZX':this._x=s1*c2*c3+c1*s2*s3;this._y=c1*s2*c3+s1*c2*s3;this._z=c1*c2*s3-s1*s2*c3;this._w=c1*c2*c3-s1*s2*s3;break;case'XZY':this._x=s1*c2*c3-c1*s2*s3;this._y=c1*s2*c3-s1*c2*s3;this._z=c1*c2*s3+s1*s2*c3;this._w=c1*c2*c3+s1*s2*s3;break;default:console.warn('THREE.Quaternion: .setFromEuler() encountered an unknown order: '+order);}if(update===true)this._onChangeCallback();return this;}setFromAxisAngle(axis,angle){// http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
// assumes axis is normalized
const halfAngle=angle/2,s=Math.sin(halfAngle);this._x=axis.x*s;this._y=axis.y*s;this._z=axis.z*s;this._w=Math.cos(halfAngle);this._onChangeCallback();return this;}setFromRotationMatrix(m){// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
const te=m.elements,m11=te[0],m12=te[4],m13=te[8],m21=te[1],m22=te[5],m23=te[9],m31=te[2],m32=te[6],m33=te[10],trace=m11+m22+m33;if(trace>0){const s=0.5/Math.sqrt(trace+1.0);this._w=0.25/s;this._x=(m32-m23)*s;this._y=(m13-m31)*s;this._z=(m21-m12)*s;}else if(m11>m22&&m11>m33){const s=2.0*Math.sqrt(1.0+m11-m22-m33);this._w=(m32-m23)/s;this._x=0.25*s;this._y=(m12+m21)/s;this._z=(m13+m31)/s;}else if(m22>m33){const s=2.0*Math.sqrt(1.0+m22-m11-m33);this._w=(m13-m31)/s;this._x=(m12+m21)/s;this._y=0.25*s;this._z=(m23+m32)/s;}else {const s=2.0*Math.sqrt(1.0+m33-m11-m22);this._w=(m21-m12)/s;this._x=(m13+m31)/s;this._y=(m23+m32)/s;this._z=0.25*s;}this._onChangeCallback();return this;}setFromUnitVectors(vFrom,vTo){// assumes direction vectors vFrom and vTo are normalized
let r=vFrom.dot(vTo)+1;if(r<Number.EPSILON){// vFrom and vTo point in opposite directions
r=0;if(Math.abs(vFrom.x)>Math.abs(vFrom.z)){this._x=-vFrom.y;this._y=vFrom.x;this._z=0;this._w=r;}else {this._x=0;this._y=-vFrom.z;this._z=vFrom.y;this._w=r;}}else {// crossVectors( vFrom, vTo ); // inlined to avoid cyclic dependency on Vector3
this._x=vFrom.y*vTo.z-vFrom.z*vTo.y;this._y=vFrom.z*vTo.x-vFrom.x*vTo.z;this._z=vFrom.x*vTo.y-vFrom.y*vTo.x;this._w=r;}return this.normalize();}angleTo(q){return 2*Math.acos(Math.abs(clamp(this.dot(q),-1,1)));}rotateTowards(q,step){const angle=this.angleTo(q);if(angle===0)return this;const t=Math.min(1,step/angle);this.slerp(q,t);return this;}identity(){return this.set(0,0,0,1);}invert(){// quaternion is assumed to have unit length
return this.conjugate();}conjugate(){this._x*=-1;this._y*=-1;this._z*=-1;this._onChangeCallback();return this;}dot(v){return this._x*v._x+this._y*v._y+this._z*v._z+this._w*v._w;}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w;}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w);}normalize(){let l=this.length();if(l===0){this._x=0;this._y=0;this._z=0;this._w=1;}else {l=1/l;this._x=this._x*l;this._y=this._y*l;this._z=this._z*l;this._w=this._w*l;}this._onChangeCallback();return this;}multiply(q){return this.multiplyQuaternions(this,q);}premultiply(q){return this.multiplyQuaternions(q,this);}multiplyQuaternions(a,b){// from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm
const qax=a._x,qay=a._y,qaz=a._z,qaw=a._w;const qbx=b._x,qby=b._y,qbz=b._z,qbw=b._w;this._x=qax*qbw+qaw*qbx+qay*qbz-qaz*qby;this._y=qay*qbw+qaw*qby+qaz*qbx-qax*qbz;this._z=qaz*qbw+qaw*qbz+qax*qby-qay*qbx;this._w=qaw*qbw-qax*qbx-qay*qby-qaz*qbz;this._onChangeCallback();return this;}slerp(qb,t){if(t===0)return this;if(t===1)return this.copy(qb);const x=this._x,y=this._y,z=this._z,w=this._w;// http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
let cosHalfTheta=w*qb._w+x*qb._x+y*qb._y+z*qb._z;if(cosHalfTheta<0){this._w=-qb._w;this._x=-qb._x;this._y=-qb._y;this._z=-qb._z;cosHalfTheta=-cosHalfTheta;}else {this.copy(qb);}if(cosHalfTheta>=1.0){this._w=w;this._x=x;this._y=y;this._z=z;return this;}const sqrSinHalfTheta=1.0-cosHalfTheta*cosHalfTheta;if(sqrSinHalfTheta<=Number.EPSILON){const s=1-t;this._w=s*w+t*this._w;this._x=s*x+t*this._x;this._y=s*y+t*this._y;this._z=s*z+t*this._z;this.normalize();// normalize calls _onChangeCallback()
return this;}const sinHalfTheta=Math.sqrt(sqrSinHalfTheta);const halfTheta=Math.atan2(sinHalfTheta,cosHalfTheta);const ratioA=Math.sin((1-t)*halfTheta)/sinHalfTheta,ratioB=Math.sin(t*halfTheta)/sinHalfTheta;this._w=w*ratioA+this._w*ratioB;this._x=x*ratioA+this._x*ratioB;this._y=y*ratioA+this._y*ratioB;this._z=z*ratioA+this._z*ratioB;this._onChangeCallback();return this;}slerpQuaternions(qa,qb,t){return this.copy(qa).slerp(qb,t);}random(){// Derived from http://planning.cs.uiuc.edu/node198.html
// Note, this source uses w, x, y, z ordering,
// so we swap the order below.
const u1=Math.random();const sqrt1u1=Math.sqrt(1-u1);const sqrtu1=Math.sqrt(u1);const u2=2*Math.PI*Math.random();const u3=2*Math.PI*Math.random();return this.set(sqrt1u1*Math.cos(u2),sqrtu1*Math.sin(u3),sqrtu1*Math.cos(u3),sqrt1u1*Math.sin(u2));}equals(quaternion){return quaternion._x===this._x&&quaternion._y===this._y&&quaternion._z===this._z&&quaternion._w===this._w;}fromArray(array,offset=0){this._x=array[offset];this._y=array[offset+1];this._z=array[offset+2];this._w=array[offset+3];this._onChangeCallback();return this;}toArray(array=[],offset=0){array[offset]=this._x;array[offset+1]=this._y;array[offset+2]=this._z;array[offset+3]=this._w;return array;}fromBufferAttribute(attribute,index){this._x=attribute.getX(index);this._y=attribute.getY(index);this._z=attribute.getZ(index);this._w=attribute.getW(index);this._onChangeCallback();return this;}toJSON(){return this.toArray();}_onChange(callback){this._onChangeCallback=callback;return this;}_onChangeCallback(){}*[Symbol.iterator](){yield this._x;yield this._y;yield this._z;yield this._w;}}class Vector3{constructor(x=0,y=0,z=0){Vector3.prototype.isVector3=true;this.x=x;this.y=y;this.z=z;}set(x,y,z){if(z===undefined)z=this.z;// sprite.scale.set(x,y)
this.x=x;this.y=y;this.z=z;return this;}setScalar(scalar){this.x=scalar;this.y=scalar;this.z=scalar;return this;}setX(x){this.x=x;return this;}setY(y){this.y=y;return this;}setZ(z){this.z=z;return this;}setComponent(index,value){switch(index){case 0:this.x=value;break;case 1:this.y=value;break;case 2:this.z=value;break;default:throw new Error('index is out of range: '+index);}return this;}getComponent(index){switch(index){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error('index is out of range: '+index);}}clone(){return new this.constructor(this.x,this.y,this.z);}copy(v){this.x=v.x;this.y=v.y;this.z=v.z;return this;}add(v){this.x+=v.x;this.y+=v.y;this.z+=v.z;return this;}addScalar(s){this.x+=s;this.y+=s;this.z+=s;return this;}addVectors(a,b){this.x=a.x+b.x;this.y=a.y+b.y;this.z=a.z+b.z;return this;}addScaledVector(v,s){this.x+=v.x*s;this.y+=v.y*s;this.z+=v.z*s;return this;}sub(v){this.x-=v.x;this.y-=v.y;this.z-=v.z;return this;}subScalar(s){this.x-=s;this.y-=s;this.z-=s;return this;}subVectors(a,b){this.x=a.x-b.x;this.y=a.y-b.y;this.z=a.z-b.z;return this;}multiply(v){this.x*=v.x;this.y*=v.y;this.z*=v.z;return this;}multiplyScalar(scalar){this.x*=scalar;this.y*=scalar;this.z*=scalar;return this;}multiplyVectors(a,b){this.x=a.x*b.x;this.y=a.y*b.y;this.z=a.z*b.z;return this;}applyEuler(euler){return this.applyQuaternion(_quaternion$4.setFromEuler(euler));}applyAxisAngle(axis,angle){return this.applyQuaternion(_quaternion$4.setFromAxisAngle(axis,angle));}applyMatrix3(m){const x=this.x,y=this.y,z=this.z;const e=m.elements;this.x=e[0]*x+e[3]*y+e[6]*z;this.y=e[1]*x+e[4]*y+e[7]*z;this.z=e[2]*x+e[5]*y+e[8]*z;return this;}applyNormalMatrix(m){return this.applyMatrix3(m).normalize();}applyMatrix4(m){const x=this.x,y=this.y,z=this.z;const e=m.elements;const w=1/(e[3]*x+e[7]*y+e[11]*z+e[15]);this.x=(e[0]*x+e[4]*y+e[8]*z+e[12])*w;this.y=(e[1]*x+e[5]*y+e[9]*z+e[13])*w;this.z=(e[2]*x+e[6]*y+e[10]*z+e[14])*w;return this;}applyQuaternion(q){// quaternion q is assumed to have unit length
const vx=this.x,vy=this.y,vz=this.z;const qx=q.x,qy=q.y,qz=q.z,qw=q.w;// t = 2 * cross( q.xyz, v );
const tx=2*(qy*vz-qz*vy);const ty=2*(qz*vx-qx*vz);const tz=2*(qx*vy-qy*vx);// v + q.w * t + cross( q.xyz, t );
this.x=vx+qw*tx+qy*tz-qz*ty;this.y=vy+qw*ty+qz*tx-qx*tz;this.z=vz+qw*tz+qx*ty-qy*tx;return this;}project(camera){return this.applyMatrix4(camera.matrixWorldInverse).applyMatrix4(camera.projectionMatrix);}unproject(camera){return this.applyMatrix4(camera.projectionMatrixInverse).applyMatrix4(camera.matrixWorld);}transformDirection(m){// input: THREE.Matrix4 affine matrix
// vector interpreted as a direction
const x=this.x,y=this.y,z=this.z;const e=m.elements;this.x=e[0]*x+e[4]*y+e[8]*z;this.y=e[1]*x+e[5]*y+e[9]*z;this.z=e[2]*x+e[6]*y+e[10]*z;return this.normalize();}divide(v){this.x/=v.x;this.y/=v.y;this.z/=v.z;return this;}divideScalar(scalar){return this.multiplyScalar(1/scalar);}min(v){this.x=Math.min(this.x,v.x);this.y=Math.min(this.y,v.y);this.z=Math.min(this.z,v.z);return this;}max(v){this.x=Math.max(this.x,v.x);this.y=Math.max(this.y,v.y);this.z=Math.max(this.z,v.z);return this;}clamp(min,max){// assumes min < max, componentwise
this.x=Math.max(min.x,Math.min(max.x,this.x));this.y=Math.max(min.y,Math.min(max.y,this.y));this.z=Math.max(min.z,Math.min(max.z,this.z));return this;}clampScalar(minVal,maxVal){this.x=Math.max(minVal,Math.min(maxVal,this.x));this.y=Math.max(minVal,Math.min(maxVal,this.y));this.z=Math.max(minVal,Math.min(maxVal,this.z));return this;}clampLength(min,max){const length=this.length();return this.divideScalar(length||1).multiplyScalar(Math.max(min,Math.min(max,length)));}floor(){this.x=Math.floor(this.x);this.y=Math.floor(this.y);this.z=Math.floor(this.z);return this;}ceil(){this.x=Math.ceil(this.x);this.y=Math.ceil(this.y);this.z=Math.ceil(this.z);return this;}round(){this.x=Math.round(this.x);this.y=Math.round(this.y);this.z=Math.round(this.z);return this;}roundToZero(){this.x=Math.trunc(this.x);this.y=Math.trunc(this.y);this.z=Math.trunc(this.z);return this;}negate(){this.x=-this.x;this.y=-this.y;this.z=-this.z;return this;}dot(v){return this.x*v.x+this.y*v.y+this.z*v.z;}// TODO lengthSquared?
lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z;}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z);}normalize(){return this.divideScalar(this.length()||1);}setLength(length){return this.normalize().multiplyScalar(length);}lerp(v,alpha){this.x+=(v.x-this.x)*alpha;this.y+=(v.y-this.y)*alpha;this.z+=(v.z-this.z)*alpha;return this;}lerpVectors(v1,v2,alpha){this.x=v1.x+(v2.x-v1.x)*alpha;this.y=v1.y+(v2.y-v1.y)*alpha;this.z=v1.z+(v2.z-v1.z)*alpha;return this;}cross(v){return this.crossVectors(this,v);}crossVectors(a,b){const ax=a.x,ay=a.y,az=a.z;const bx=b.x,by=b.y,bz=b.z;this.x=ay*bz-az*by;this.y=az*bx-ax*bz;this.z=ax*by-ay*bx;return this;}projectOnVector(v){const denominator=v.lengthSq();if(denominator===0)return this.set(0,0,0);const scalar=v.dot(this)/denominator;return this.copy(v).multiplyScalar(scalar);}projectOnPlane(planeNormal){_vector$c.copy(this).projectOnVector(planeNormal);return this.sub(_vector$c);}reflect(normal){// reflect incident vector off plane orthogonal to normal
// normal is assumed to have unit length
return this.sub(_vector$c.copy(normal).multiplyScalar(2*this.dot(normal)));}angleTo(v){const denominator=Math.sqrt(this.lengthSq()*v.lengthSq());if(denominator===0)return Math.PI/2;const theta=this.dot(v)/denominator;// clamp, to handle numerical problems
return Math.acos(clamp(theta,-1,1));}distanceTo(v){return Math.sqrt(this.distanceToSquared(v));}distanceToSquared(v){const dx=this.x-v.x,dy=this.y-v.y,dz=this.z-v.z;return dx*dx+dy*dy+dz*dz;}manhattanDistanceTo(v){return Math.abs(this.x-v.x)+Math.abs(this.y-v.y)+Math.abs(this.z-v.z);}setFromSpherical(s){return this.setFromSphericalCoords(s.radius,s.phi,s.theta);}setFromSphericalCoords(radius,phi,theta){const sinPhiRadius=Math.sin(phi)*radius;this.x=sinPhiRadius*Math.sin(theta);this.y=Math.cos(phi)*radius;this.z=sinPhiRadius*Math.cos(theta);return this;}setFromCylindrical(c){return this.setFromCylindricalCoords(c.radius,c.theta,c.y);}setFromCylindricalCoords(radius,theta,y){this.x=radius*Math.sin(theta);this.y=y;this.z=radius*Math.cos(theta);return this;}setFromMatrixPosition(m){const e=m.elements;this.x=e[12];this.y=e[13];this.z=e[14];return this;}setFromMatrixScale(m){const sx=this.setFromMatrixColumn(m,0).length();const sy=this.setFromMatrixColumn(m,1).length();const sz=this.setFromMatrixColumn(m,2).length();this.x=sx;this.y=sy;this.z=sz;return this;}setFromMatrixColumn(m,index){return this.fromArray(m.elements,index*4);}setFromMatrix3Column(m,index){return this.fromArray(m.elements,index*3);}setFromEuler(e){this.x=e._x;this.y=e._y;this.z=e._z;return this;}setFromColor(c){this.x=c.r;this.y=c.g;this.z=c.b;return this;}equals(v){return v.x===this.x&&v.y===this.y&&v.z===this.z;}fromArray(array,offset=0){this.x=array[offset];this.y=array[offset+1];this.z=array[offset+2];return this;}toArray(array=[],offset=0){array[offset]=this.x;array[offset+1]=this.y;array[offset+2]=this.z;return array;}fromBufferAttribute(attribute,index){this.x=attribute.getX(index);this.y=attribute.getY(index);this.z=attribute.getZ(index);return this;}random(){this.x=Math.random();this.y=Math.random();this.z=Math.random();return this;}randomDirection(){// Derived from https://mathworld.wolfram.com/SpherePointPicking.html
const u=(Math.random()-0.5)*2;const t=Math.random()*Math.PI*2;const f=Math.sqrt(1-u**2);this.x=f*Math.cos(t);this.y=f*Math.sin(t);this.z=u;return this;}*[Symbol.iterator](){yield this.x;yield this.y;yield this.z;}}const _vector$c=/*@__PURE__*/new Vector3();const _quaternion$4=/*@__PURE__*/new Quaternion();class Box3{constructor(min=new Vector3(+Infinity,+Infinity,+Infinity),max=new Vector3(-Infinity,-Infinity,-Infinity)){this.isBox3=true;this.min=min;this.max=max;}set(min,max){this.min.copy(min);this.max.copy(max);return this;}setFromArray(array){this.makeEmpty();for(let i=0,il=array.length;i<il;i+=3){this.expandByPoint(_vector$b.fromArray(array,i));}return this;}setFromBufferAttribute(attribute){this.makeEmpty();for(let i=0,il=attribute.count;i<il;i++){this.expandByPoint(_vector$b.fromBufferAttribute(attribute,i));}return this;}setFromPoints(points){this.makeEmpty();for(let i=0,il=points.length;i<il;i++){this.expandByPoint(points[i]);}return this;}setFromCenterAndSize(center,size){const halfSize=_vector$b.copy(size).multiplyScalar(0.5);this.min.copy(center).sub(halfSize);this.max.copy(center).add(halfSize);return this;}setFromObject(object,precise=false){this.makeEmpty();return this.expandByObject(object,precise);}clone(){return new this.constructor().copy(this);}copy(box){this.min.copy(box.min);this.max.copy(box.max);return this;}makeEmpty(){this.min.x=this.min.y=this.min.z=+Infinity;this.max.x=this.max.y=this.max.z=-Infinity;return this;}isEmpty(){// this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes
return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z;}getCenter(target){return this.isEmpty()?target.set(0,0,0):target.addVectors(this.min,this.max).multiplyScalar(0.5);}getSize(target){return this.isEmpty()?target.set(0,0,0):target.subVectors(this.max,this.min);}expandByPoint(point){this.min.min(point);this.max.max(point);return this;}expandByVector(vector){this.min.sub(vector);this.max.add(vector);return this;}expandByScalar(scalar){this.min.addScalar(-scalar);this.max.addScalar(scalar);return this;}expandByObject(object,precise=false){// Computes the world-axis-aligned bounding box of an object (including its children),
// accounting for both the object's, and children's, world transforms
object.updateWorldMatrix(false,false);const geometry=object.geometry;if(geometry!==undefined){const positionAttribute=geometry.getAttribute('position');// precise AABB computation based on vertex data requires at least a position attribute.
// instancing isn't supported so far and uses the normal (conservative) code path.
if(precise===true&&positionAttribute!==undefined&&object.isInstancedMesh!==true){for(let i=0,l=positionAttribute.count;i<l;i++){if(object.isMesh===true){object.getVertexPosition(i,_vector$b);}else {_vector$b.fromBufferAttribute(positionAttribute,i);}_vector$b.applyMatrix4(object.matrixWorld);this.expandByPoint(_vector$b);}}else {if(object.boundingBox!==undefined){// object-level bounding box
if(object.boundingBox===null){object.computeBoundingBox();}_box$4.copy(object.boundingBox);}else {// geometry-level bounding box
if(geometry.boundingBox===null){geometry.computeBoundingBox();}_box$4.copy(geometry.boundingBox);}_box$4.applyMatrix4(object.matrixWorld);this.union(_box$4);}}const children=object.children;for(let i=0,l=children.length;i<l;i++){this.expandByObject(children[i],precise);}return this;}containsPoint(point){return point.x<this.min.x||point.x>this.max.x||point.y<this.min.y||point.y>this.max.y||point.z<this.min.z||point.z>this.max.z?false:true;}containsBox(box){return this.min.x<=box.min.x&&box.max.x<=this.max.x&&this.min.y<=box.min.y&&box.max.y<=this.max.y&&this.min.z<=box.min.z&&box.max.z<=this.max.z;}getParameter(point,target){// This can potentially have a divide by zero if the box
// has a size dimension of 0.
return target.set((point.x-this.min.x)/(this.max.x-this.min.x),(point.y-this.min.y)/(this.max.y-this.min.y),(point.z-this.min.z)/(this.max.z-this.min.z));}intersectsBox(box){// using 6 splitting planes to rule out intersections.
return box.max.x<this.min.x||box.min.x>this.max.x||box.max.y<this.min.y||box.min.y>this.max.y||box.max.z<this.min.z||box.min.z>this.max.z?false:true;}intersectsSphere(sphere){// Find the point on the AABB closest to the sphere center.
this.clampPoint(sphere.center,_vector$b);// If that point is inside the sphere, the AABB and sphere intersect.
return _vector$b.distanceToSquared(sphere.center)<=sphere.radius*sphere.radius;}intersectsPlane(plane){// We compute the minimum and maximum dot product values. If those values
// are on the same side (back or front) of the plane, then there is no intersection.
let min,max;if(plane.normal.x>0){min=plane.normal.x*this.min.x;max=plane.normal.x*this.max.x;}else {min=plane.normal.x*this.max.x;max=plane.normal.x*this.min.x;}if(plane.normal.y>0){min+=plane.normal.y*this.min.y;max+=plane.normal.y*this.max.y;}else {min+=plane.normal.y*this.max.y;max+=plane.normal.y*this.min.y;}if(plane.normal.z>0){min+=plane.normal.z*this.min.z;max+=plane.normal.z*this.max.z;}else {min+=plane.normal.z*this.max.z;max+=plane.normal.z*this.min.z;}return min<=-plane.constant&&max>=-plane.constant;}intersectsTriangle(triangle){if(this.isEmpty()){return false;}// compute box center and extents
this.getCenter(_center);_extents.subVectors(this.max,_center);// translate triangle to aabb origin
_v0$2.subVectors(triangle.a,_center);_v1$7.subVectors(triangle.b,_center);_v2$4.subVectors(triangle.c,_center);// compute edge vectors for triangle
_f0.subVectors(_v1$7,_v0$2);_f1.subVectors(_v2$4,_v1$7);_f2.subVectors(_v0$2,_v2$4);// test against axes that are given by cross product combinations of the edges of the triangle and the edges of the aabb
// make an axis testing of each of the 3 sides of the aabb against each of the 3 sides of the triangle = 9 axis of separation
// axis_ij = u_i x f_j (u0, u1, u2 = face normals of aabb = x,y,z axes vectors since aabb is axis aligned)
let axes=[0,-_f0.z,_f0.y,0,-_f1.z,_f1.y,0,-_f2.z,_f2.y,_f0.z,0,-_f0.x,_f1.z,0,-_f1.x,_f2.z,0,-_f2.x,-_f0.y,_f0.x,0,-_f1.y,_f1.x,0,-_f2.y,_f2.x,0];if(!satForAxes(axes,_v0$2,_v1$7,_v2$4,_extents)){return false;}// test 3 face normals from the aabb
axes=[1,0,0,0,1,0,0,0,1];if(!satForAxes(axes,_v0$2,_v1$7,_v2$4,_extents)){return false;}// finally testing the face normal of the triangle
// use already existing triangle edge vectors here
_triangleNormal.crossVectors(_f0,_f1);axes=[_triangleNormal.x,_triangleNormal.y,_triangleNormal.z];return satForAxes(axes,_v0$2,_v1$7,_v2$4,_extents);}clampPoint(point,target){return target.copy(point).clamp(this.min,this.max);}distanceToPoint(point){return this.clampPoint(point,_vector$b).distanceTo(point);}getBoundingSphere(target){if(this.isEmpty()){target.makeEmpty();}else {this.getCenter(target.center);target.radius=this.getSize(_vector$b).length()*0.5;}return target;}intersect(box){this.min.max(box.min);this.max.min(box.max);// ensure that if there is no overlap, the result is fully empty, not slightly empty with non-inf/+inf values that will cause subsequence intersects to erroneously return valid values.
if(this.isEmpty())this.makeEmpty();return this;}union(box){this.min.min(box.min);this.max.max(box.max);return this;}applyMatrix4(matrix){// transform of empty box is an empty box.
if(this.isEmpty())return this;// NOTE: I am using a binary pattern to specify all 2^3 combinations below
_points[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(matrix);// 000
_points[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(matrix);// 001
_points[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(matrix);// 010
_points[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(matrix);// 011
_points[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(matrix);// 100
_points[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(matrix);// 101
_points[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(matrix);// 110
_points[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(matrix);// 111
this.setFromPoints(_points);return this;}translate(offset){this.min.add(offset);this.max.add(offset);return this;}equals(box){return box.min.equals(this.min)&&box.max.equals(this.max);}}const _points=[/*@__PURE__*/new Vector3(),/*@__PURE__*/new Vector3(),/*@__PURE__*/new Vector3(),/*@__PURE__*/new Vector3(),/*@__PURE__*/new Vector3(),/*@__PURE__*/new Vector3(),/*@__PURE__*/new Vector3(),/*@__PURE__*/new Vector3()];const _vector$b=/*@__PURE__*/new Vector3();const _box$4=/*@__PURE__*/new Box3();// triangle centered vertices
const _v0$2=/*@__PURE__*/new Vector3();const _v1$7=/*@__PURE__*/new Vector3();const _v2$4=/*@__PURE__*/new Vector3();// triangle edge vectors
const _f0=/*@__PURE__*/new Vector3();const _f1=/*@__PURE__*/new Vector3();const _f2=/*@__PURE__*/new Vector3();const _center=/*@__PURE__*/new Vector3();const _extents=/*@__PURE__*/new Vector3();const _triangleNormal=/*@__PURE__*/new Vector3();const _testAxis=/*@__PURE__*/new Vector3();function satForAxes(axes,v0,v1,v2,extents){for(let i=0,j=axes.length-3;i<=j;i+=3){_testAxis.fromArray(axes,i);// project the aabb onto the separating axis
const r=extents.x*Math.abs(_testAxis.x)+extents.y*Math.abs(_testAxis.y)+extents.z*Math.abs(_testAxis.z);// project all 3 vertices of the triangle onto the separating axis
const p0=v0.dot(_testAxis);const p1=v1.dot(_testAxis);const p2=v2.dot(_testAxis);// actual test, basically see if either of the most extreme of the triangle points intersects r
if(Math.max(-Math.max(p0,p1,p2),Math.min(p0,p1,p2))>r){// points of the projected triangle are outside the projected half-length of the aabb
// the axis is separating and we can exit
return false;}}return true;}const _box$3=/*@__PURE__*/new Box3();const _v1$6=/*@__PURE__*/new Vector3();const _v2$3=/*@__PURE__*/new Vector3();class Sphere{constructor(center=new Vector3(),radius=-1){this.isSphere=true;this.center=center;this.radius=radius;}set(center,radius){this.center.copy(center);this.radius=radius;return this;}setFromPoints(points,optionalCenter){const center=this.center;if(optionalCenter!==undefined){center.copy(optionalCenter);}else {_box$3.setFromPoints(points).getCenter(center);}let maxRadiusSq=0;for(let i=0,il=points.length;i<il;i++){maxRadiusSq=Math.max(maxRadiusSq,center.distanceToSquared(points[i]));}this.radius=Math.sqrt(maxRadiusSq);return this;}copy(sphere){this.center.copy(sphere.center);this.radius=sphere.radius;return this;}isEmpty(){return this.radius<0;}makeEmpty(){this.center.set(0,0,0);this.radius=-1;return this;}containsPoint(point){return point.distanceToSquared(this.center)<=this.radius*this.radius;}distanceToPoint(point){return point.distanceTo(this.center)-this.radius;}intersectsSphere(sphere){const radiusSum=this.radius+sphere.radius;return sphere.center.distanceToSquared(this.center)<=radiusSum*radiusSum;}intersectsBox(box){return box.intersectsSphere(this);}intersectsPlane(plane){return Math.abs(plane.distanceToPoint(this.center))<=this.radius;}clampPoint(point,target){const deltaLengthSq=this.center.distanceToSquared(point);target.copy(point);if(deltaLengthSq>this.radius*this.radius){target.sub(this.center).normalize();target.multiplyScalar(this.radius).add(this.center);}return target;}getBoundingBox(target){if(this.isEmpty()){// Empty sphere produces empty bounding box
if(directionDistance<0){return this.origin.distanceToSquared(point);}_vector$a.copy(this.origin).addScaledVector(this.direction,directionDistance);return _vector$a.distanceToSquared(point);}distanceSqToSegment(v0,v1,optionalPointOnRay,optionalPointOnSegment){// from https://github.com/pmjoniak/GeometricTools/blob/master/GTEngine/Include/Mathematics/GteDistRaySegment.h
}// face region