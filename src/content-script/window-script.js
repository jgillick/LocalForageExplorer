/**
 * A script injected into the page and used to connect the extension
 * to the page's localforage instance.
 */
(async function() {
  // import these here so they stay isolated from the page
  const { BRIDGE_NAMESPACE, BRIDGE_LOCALFORAGE_FN, BRIDGE_PAGE_LOAD } = require('../constants.js');
  const Bridge = require('crx-bridge').default;
  const LFWrapper = require('./LocalForageWrapper').default;
  const localForageWrapper = new LFWrapper();

  // Enable bridge communication
  Bridge.setNamespace(BRIDGE_NAMESPACE);

  // Forward function requests to LocalForageWrapper
  Bridge.onMessage(BRIDGE_LOCALFORAGE_FN, ({ data }) => {
    const { fn, args } = data;
    if (typeof localForageWrapper[fn] === 'undefined') {
      throw new Error(`Function '${fn}' doesn't exist on LocalForageWrapper`);
    }
    return localForageWrapper[fn].apply(localForageWrapper, args);
  });

  // Tell the dev panel that the page has loaded
  try {
    await Bridge.sendMessage(BRIDGE_PAGE_LOAD, {}, 'devtools');
  } catch(e) {
    // An error is thrown if the devtools panel is not open yet
  }
})();
