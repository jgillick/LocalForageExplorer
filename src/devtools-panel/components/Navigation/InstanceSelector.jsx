import React, { useState, useEffect } from 'react';
import { MdAddCircle } from "react-icons/md";

import remoteLocalForage from '../../modules/remoteLocalForage';
import { button, input } from '../styles';

export default function InstanceSelector({ setInstanceName }) {
  const [ instances, setInstances ] = useState([]);
  const [ selected, setSelected ] = useState(null);

  /**
   * Load instances
   */
  async function loadInstances() {
    const list = await remoteLocalForage.getCustomInstances();
    list.sort();
    setInstances(list);
  }

  /**
   * Create new localforage instance
   */
  async function createInstance() {
    let name = prompt('New instance name?');
    if (name === null || name.trim() === '') {
      return;
    }

    name = name.trim();
    await remoteLocalForage.createCustomInstance(name);

    setSelected(name);
    setInstanceName(name);
    loadInstances();
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
        <button>
          <MdAddCircle onClick={createInstance} />
        </button>
      </div>
      <style jsx>{button}</style>
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
        button,
        button:active {
          margin-left: 5px;
        }
      `}</style>
    </>
  );
}
