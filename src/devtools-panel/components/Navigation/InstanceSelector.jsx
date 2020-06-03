import React, { useState, useEffect } from 'react';
import { MdAddCircle } from "react-icons/md";

import AddInstance from './AddInstance';
import remoteLocalForage from '../../modules/remoteLocalForage';
import { iconButton, input } from '../../styles/controls';

export default function InstanceSelector({ setInstanceName }) {
  const [ instances, setInstances ] = useState([]);
  const [ selected, setSelected ] = useState(null);
  const [ showAddModal, setShowAddModal ] = useState(false);
  const openModal = () => setShowAddModal(true);

  /**
   * Close the add modal
   * @param {boolean} instName - The name of the new instance.
   */
  function closeModal(instName) {
    setShowAddModal(false);
    if (instName) {
      setSelected(instName);
      setInstanceName(instName);
      loadInstances();
    }
  }

  /**
   * Load instances
   */
  async function loadInstances() {
    const list = await remoteLocalForage.getCustomInstances();
    list.sort();
    setInstances(list);
  }

  /**
   * Selection changed
   */
  function onChange(event) {
    const name = event.target.value;
    setSelected(name);
    if (typeof setInstanceName === 'function') {
      setInstanceName(name);
    }
  }

  useEffect(() => {
    loadInstances();
  }, []);

  return (
    <>
      <div>
        <select
          title="LocalForage Instances"
          onChange={onChange}
          value={selected || ''}
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
      <AddInstance show={showAddModal} handleClose={closeModal} />
      <style jsx>{iconButton}</style>
      <style jsx>{input}</style>
      <style jsx>{`
        div {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          max-width: 200px;
        }
        select option.default {
          font-style: italic;
        }
        .icon-button,
        .icon-button:active {
          margin-left: 5px;
        }
      `}</style>
    </>
  );
}
