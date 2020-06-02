import { BRIDGE_NAMESPACE } from '../constants.js';
import Bridge from 'crx-bridge';

// Bridge communications to injected script
Bridge.allowWindowMessaging(BRIDGE_NAMESPACE);

// Inject LocalForage wrapper in the page
let script = document.createElement('script');
script.src = chrome.extension.getURL('content-script/window-script.js');
(document.body || document.documentElement).appendChild(script);
