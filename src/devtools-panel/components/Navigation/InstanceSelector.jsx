import React, { useState, useEffect } from 'react';
import { MdAddCircle } from "react-icons/md";

import AddInstanceModal from './AddInstance';
import remoteLocalForage from '../../modules/remoteLocalForage';
import { iconButton, input } from '../../styles/controls';

export default function InstanceSelector({ setInstanceName, addInstance, instances, selectedInstance }) {
  const [ showAddModal, setShowAddModal ] = useState(false);
  const openModal = () => setShowAddModal(true);

  /**
   * Close the add modal
   * @param {boolean} instName - The name of the new instance.
   */
  function closeModal(instName) {
    setShowAddModal(false);
    if (instName) {
      setInstanceName(instName);
    }
  }

  /**
   * Selection changed
   */
  function onChange(event) {
    const name = event.target.value;
    if (typeof setInstanceName === 'function') {
      setInstanceName(name);
    }
  }

  return (
    <>
      <div>
        <select
          title="LocalForage Instances"
          onChange={onChange}
          value={selectedInstance || ''}
        >
          <option value="" className="default">Default</option>
          {instances.map((name) => (
            <option value={name} key={name}>
              {name}
            </option>
          ))}
        </select>
        <button className="icon-button">
          <MdAddCircle onClick={openModal} />
        </button>
      </div>
      <AddInstanceModal
        show={showAddModal}
        handleClose={closeModal}
        addInstance={addInstance}
      />
      <style jsx>{iconButton}</style>
      <style jsx>{input}</style>
      <style jsx>{`
        div {
          display: flex;
          justify-content: flex-end;
          max-width: 200px;
        }
        select {
          -moz-appearance: none;
          border-radius: 5px;
          padding: 0 5px;
        }
        .icon-button,
        .icon-button:active {
          margin-left: 3px;
        }
      `}</style>
    </>
  );
}
