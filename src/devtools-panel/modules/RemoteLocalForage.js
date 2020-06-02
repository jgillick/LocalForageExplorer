import Bridge from 'crx-bridge';
import { BRIDGE_LOCALFORAGE_FN } from '../../constants.js';
import LocalForageWrapper from '../../content-script/LocalForageWrapper';

// Local developement, connect directly to it
let localForageWrapper;
if (process.env.WEB_SERVER) {
  localForageWrapper = new LocalForageWrapper();
}

/**
 * A proxy object which calls functions of the LocalForageWrapper via
 * a communication bridge to the browser window.
 */
export default new Proxy({}, {
  get(_target, name) {
    return (...args) => {
      // Local developement, connect directly to it
      if (process.env.WEB_SERVER) {
        return localForageWrapper[name].apply(localForageWrapper, args);
      }
      const fnData = { args, fn: name };
      console.log('Request', fnData);
      return Bridge.sendMessage(BRIDGE_LOCALFORAGE_FN, fnData, 'window');
    }
  }
});
