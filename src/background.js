import 'regenerator-runtime/runtime'
import Bridge from 'crx-bridge'

Bridge.onMessage('setup', () => {

})

/**
 * Proxies messages from the content script to the devtools panel.
 * https://developer.chrome.com/extensions/devtools#content-script-to-devtools
 */
let connections = {};

/**
 * Messages from dev tools
 */
chrome.runtime.onConnect.addListener((port) => {
    const listener = function (message, sender, sendResponse) {
      console.log('received message', message);
      // Init message registers the communication object to this browser tab.
      if (message.name == "init") {
        console.log('Init called!', message);
        connections[message.tabId] = port;
        return;
      }
    }

    // Listen to messages sent from the DevTools page
    port.onMessage.addListener(listener);

    // Remove listener
    port.onDisconnect.addListener((port) => {
      const tabs = Object.keys(connections);
      port.onMessage.removeListener(listener);
      for (let i = 0, len = tabs.length; i < len; i++) {
        if (connections[tabs[i]] == port) {
          delete connections[tabs[i]]
          break;
        }
      }
    });
});

/**
 * Messages from content script on the current tab
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received!', request)
  if (sender.tab) {
    const tabId = sender.tab.id;
    if (tabId in connections) {
      // Send to devtools for this tab
      connections[tabId].postMessage(request);
    } else {
      console.log("Tab not found in connection list.");
    }
  } else {
    console.log("sender.tab not defined.");
  }
  return true;
});
