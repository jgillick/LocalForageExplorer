import Bridge from 'crx-bridge';
import { BRIDGE_LOCALFORAGE_FN } from '../../constants.js';
import LocalForageWrapper from '../../content-script/LocalForageWrapper';

let localForageWrapper = new LocalForageWrapper();

/**
 * Connect to the remote localForage instance through crx-bridge.
 */
export function connectToRemoteLocalForage() {
  localForageWrapper = null;
}

/**
 * A proxy object which calls functions of the LocalForageWrapper via
 * a communication bridge to the browser window.
 */
export default new Proxy({}, {
  get(_target, name) {
    // Return function to call
    return (...args) => {
      // Use local version
      if (localForageWrapper) {
        return localForageWrapper[name].apply(localForageWrapper, args);
      }
      const fnData = { args, fn: name };
      return Bridge.sendMessage(BRIDGE_LOCALFORAGE_FN, fnData, 'window');
    }
  },
});
