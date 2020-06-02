/**
 * A script injected into the page and used to connect the extension
 * to the page's localforage instance.
 */
(function() {
  // import these here so they stay isolated from the page
  const { BRIDGE_NAMESPACE, BRIDGE_LOCALFORAGE_FN } = require('../constants.js');
  const Bridge = require('crx-bridge').default;
  const LFWrapper = require('./LocalForageWrapper').default;
  const localForageWrapper = new LFWrapper();

  console.log('Register bridge', BRIDGE_NAMESPACE, BRIDGE_LOCALFORAGE_FN);

  // Enable bridge communication
  Bridge.setNamespace(BRIDGE_NAMESPACE);

  // Forward function requests to LocalForageWrapper
  Bridge.onMessage(BRIDGE_LOCALFORAGE_FN, ({ data }) => {
    console.log('Received fn request', data);
    const { fn, args } = data;
    if (typeof localForageWrapper[fn] === 'undefined') {
      throw new Error(`Function '${fn}' doesn't exist on LocalForageWrapper`);
    }
    return localForageWrapper[fn].apply(localForageWrapper, args);
  })
})();
