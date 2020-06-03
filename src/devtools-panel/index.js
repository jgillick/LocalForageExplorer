import Bridge from 'crx-bridge';
import { BRIDGE_NEW_SEARCH, BRIDGE_CLEAR_SEARCH } from '../constants';

// Initialize the Chrome Devtools Panel
// https://developer.chrome.com/extensions/devtools
chrome.devtools.panels.create('LocalForage', null, 'devtools-panel/panel.html', (panel) => {
  /**
   * Handle search
   */
  panel.onSearch.addListener((action, query) => {
      switch (action) {
        case 'cancelSearch':
          Bridge.sendMessage(BRIDGE_CLEAR_SEARCH, null, 'devtools');
          break;
        case 'performSearch':
          Bridge.sendMessage(BRIDGE_NEW_SEARCH, { query }, 'devtools');
          break;
      }
  });
});
