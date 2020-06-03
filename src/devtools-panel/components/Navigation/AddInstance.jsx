import React, { useState, useEffect, useRef } from 'react';
import remoteLocalForage from '../../modules/remoteLocalForage';
import colors from '../../styles/colors';

/**
 * Modal used to add a LocalForage instance to the panel.
 */
export default function AddInstance({ show, handleClose }) {
  const [ value, setValue ] = useState('');
  const [ canSubmit, setCanSubmit ] = useState(false);
  const inputField = useRef();

  /**
   * Validate entered value
   */
  useEffect(() => {
    setCanSubmit((value.trim() !== ''));
  }, [value]);

  /**
   * Focus field on open
   */
  useEffect(() => {
    if (show && inputField.current) {
      inputField.current.focus();
    }
  }, [show]);

  /**
   * Create instance
   */
  async function handleSave() {
    try {
      let name = value.trim();
      if (name === '') return;
      await remoteLocalForage.createCustomInstance(name);
      handleClose(name);
    } catch(e) {
      alert(`An error occurred!\n${e.toString()}`);
    }
  }

  /**
   * Key pressed in the field
   */
  function onKeyPress(evt) {
    switch (evt.key) {
      case 'Escape':
        handleClose(null);
        break;
      case 'Enter':
        handleSave();
        break;
    }
  }

  return (
    <div className={(show) ? 'container open' : 'container'}>
      <section className="modal">
        <header>
          <h1>Add LocalForage Instance</h1>
        </header>
        <section className="main">
          <p>
            Adds a new, or existing, localForage instance to the explorer.
          </p>
          <p>
            <input
              ref={inputField}
              type="text"
              placeholder="Instance Name"
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={onKeyPress}
            />
          </p>
        </section>
        <footer>
          <button
            onClick={handleSave}
            disabled={!canSubmit}
          >
            Add
          </button>
          <button onClick={() => handleClose(null)}>Cancel</button>
        </footer>
      </section>
      <style jsx>{colors}</style>
      <style jsx>{`
          .container {
            display: none;
          }
          .container.open {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--modal-mask-background);
            z-index: 2;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: auto;
          }
          .modal {
            color: var(--modal-color);
            background: var(--modal-background);
            border-radius: 5px;
            max-width: 300px;
            max-height: 300px;
            overflow: auto;
          }
          header,
          footer {
            padding: 10px;
            text-align: center;
          }
          header {
            background: var(--modal-header-background);
          }
          footer {
            background: var(--modal-actions-background);
          }
          header h1 {
            font-size: 16px;
            margin: 0;
            font-style: none;
            font-weight: 500;
          }
          .main {
            padding: 5px 10px;
            text-align: center;
            font-size: 14px;
          }
          .main input {
            text-align: left;
            padding: 5px;
            font-size: 16px;
          }
          .main p {
            margin: 10px 0 12px;
          }
          footer button {
            font-size: 16px;
            padding: 5px;
            margin: 0 10px;
            color: var(--modal-button-color);
            background: var(--modal-button-background);
            border: 1px solid var(--modal-button-border);
          }
          footer button:hover {
            border-color: var(--modal-button-hover-border);
          }
          footer button:focus {
            border-color: var(--modal-button-focus-border);
            outline: none;
          }
          footer button:disabled {
            opacity: 0.5;
          }
          footer button:disabled:hover {
            border-color: var(--modal-button-border);
          }
        `}</style>
      </div>
  )
}
