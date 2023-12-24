// stooooore stuuuufff
const listeners = [];
const internals = {};

export const store = window.store = window._a = {
  state: {},
  setState: (newState) => {
    const changedSelectors = [];

    // Deep merge the new state
    internals.deepMerge(store.state, newState, changedSelectors);

    // Notify listeners with changed selectors
    internals.notifyListeners(changedSelectors);
  },
  subscribe: function (selector, callback) {
    // Add a callback listener for updates with optional deep selector
    listeners.push({ selector, callback });

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
    return { ...this.state };
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

internals.notifyListeners = (changedSelectors) => {
  listeners.forEach(listener => {
    const selectorParts = listener.selector.split('.');
    const matchingSelectors = changedSelectors.filter(selector =>
      selectorParts.some(part => selector.startsWith(part))
    );

    // Check if any part of the deep selector matches the changed selectors
    if (!listener.selector || matchingSelectors.length > 0) {
      listener.callback();
    }
  });
};
