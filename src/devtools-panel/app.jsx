import React from 'react';
import ReactDOM from 'react-dom';
import Panel from './components/Panel.jsx';
import { connectToRemoteLocalForage } from './modules/RemoteLocalForage';

const rootEl = document.getElementById('root');

// Tag the browser type
if (navigator.userAgent.includes("Chrome")) {
  rootEl.classList.add('chrome-browser');
} else if (navigator.userAgent.includes('Firefox')) {
  rootEl.classList.add('firefox-browser');
}

// Connect to remote localforage
if (chrome.devtools) {
  connectToRemoteLocalForage();
}

ReactDOM.render(
  <Panel />,
  rootEl,
);
