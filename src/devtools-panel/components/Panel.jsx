import React, { useState, useEffect } from 'react';
import Bridge from 'crx-bridge';
import remoteLocalForage from '../modules/RemoteLocalForage';
import { BRIDGE_NEW_SEARCH, BRIDGE_CLEAR_SEARCH, BRIDGE_PAGE_LOAD } from '../../constants';
import colors from '../styles/colors';

import Navigation from './Navigation';
import DataTable from './DataTable';

export default function Panel(props) {
  const [ rowData, setRowData ] = useState([]);
  const [ filteredRows, setFilteredRows ] = useState([]);
  const [ instances, setInstances ] = useState([]);
  const [ instanceName, setInstanceName ] = useState(null);
  const [ filterValue, setFilterValue ] = useState('');

  /**
   * Filter row data
   */
  function filterRows() {
    if (!filterValue || typeof filterValue !== 'string' || filterValue.trim() === '') {
      setFilteredRows(rowData);
      return;
    }

    // Normalize a text value for the search
    const normVal = (val) => {
      let normed = val;
      if (normed === null || normed === 'undefined') {
        normed = '';
      } else if (typeof normed !== 'string') {
        normed = JSON.stringify(normed);
      }
      return normed.toLowerCase();
    }

    const search = normVal(filterValue).trim();
    const filtered = rowData.filter(({ key, value }) => {
      // const valueStr = value;
      return (normVal(key).includes(search) || normVal(value).includes(search));
    });
    setFilteredRows(filtered);
  }

  /**
   * Load localForage instances
   */
  async function loadInstances() {
    const list = await remoteLocalForage.getCustomInstances();
    list.sort();
    setInstances(list);
    console.log(instanceName, list);

    // Reset selected instance if it doesn't exist
    if (instanceName && !list.includes(instanceName)) {
      console.log('Reset instance name');
      setInstanceName(null);
    }
  }

  /**
   * Add a new localForage instance
   * @param {String} name - Name of instance to add
   */
  async function addInstance(name) {
    if (name === '') {
      throw new Error('Invalid instance name');
    }
    await remoteLocalForage.createCustomInstance(name);
    await loadInstances();
  }


  /**
   * Load data from localforage
   */
  async function loadData() {
    try {
      const storeData = await remoteLocalForage.getData(instanceName);
      const dataMap = new Map();

      // Use a map to maintain order
      rowData.forEach((item) => {
        dataMap.set(item.key, item.value);
      });

      // Add new elements
      Object.entries(storeData).forEach(([key, value]) => {
        dataMap.set(key, value);
      });

      // Export to array and pull values directly from storeData (most up-to-date)
      // Remove elements not included in store data
      const dataArr = [];
      dataMap.forEach((_v, key) => {
        if (typeof storeData[key] !== 'undefined') {
          let value = storeData[key];
          if (typeof value !== 'string' && typeof value !== 'number') {
            value = JSON.stringify(value);
          }
          dataArr.push({ key, value });
        }
      });

      setRowData(dataArr);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  /**
   * Fired when the data of a row has changed
   * @param {Object} oldData - The old key/value data
   * @param {Object} newData - The new key/value data
   */
  async function onItemChange(oldData, newData) {
    // Update array value (maintains order)
    const rows = rowData;
    let idx = rows.length;
    rows.find((row, i) => {
      if (row.key === oldData.key) {
        idx = i;
        return true;
      }
      return false;
    });
    rows[idx] = newData;
    setRowData(rows);

    // Key changed, remove old item
    if (oldData.key !== newData.key) {
      await remoteLocalForage.removeItem(oldData.key, instanceName);
    }

    // Add/Update value
    if (newData.key) {
      await remoteLocalForage.setItem(newData.key, newData.value, instanceName);
    }

    loadData();
  }

  /**
   * Delete an item
   * @param {String} key
   */
  async function removeItem(key) {
    await remoteLocalForage.removeItem(key);
    loadData();
  }

  /**
   * Reload the data
   */
  async function reloadData() {
    await loadInstances();
    await loadData();
  }

  /**
   * Filter data
   */
  useEffect(() => {
    filterRows();
  }, [filterValue, rowData])

  /**
   * On page Load or instance name changed
   */
  useEffect(() => {
    setFilterValue('');
    setFilteredRows([]);
    reloadData();

    // Listen for panel search
    Bridge.onMessage(BRIDGE_NEW_SEARCH, ({ data }) => {
      setFilterValue(data.query || '');
    });
    Bridge.onMessage(BRIDGE_CLEAR_SEARCH, () => {
      setFilterValue('');
    });

    // Refresh data on page load
    Bridge.onMessage(BRIDGE_PAGE_LOAD, reloadData);

    // Remove listeners
    return () => {
      Bridge.onMessageListeners.delete(BRIDGE_NEW_SEARCH);
      Bridge.onMessageListeners.delete(BRIDGE_CLEAR_SEARCH);
      Bridge.onMessageListeners.delete(BRIDGE_PAGE_LOAD);
    }
     // Udpate on instance name to prevent stale state.
  }, [instanceName]);

  return (
    <>
      <div className="panel-container">
        <Navigation
          reload={loadData}
          instances={instances}
          selectedInstance={instanceName}
          addInstance={addInstance}
          setInstanceName={setInstanceName}
          filterValue={filterValue}
          onFilterChange={setFilterValue}
        />
        <DataTable
          rows={filteredRows}
          onChange={onItemChange}
          removeItem={removeItem}
          filteredBy={filterValue}
          instanceName={instanceName} />
      </div>
      <style jsx>{colors}</style>
      <style jsx>{`
        .panel-container {
          font-size: 12px;
          font-family: Roboto;
          padding: 0;
          margin: 0;
          color: var(--color);
          background: var(--background);
        }
      `}</style>
    </>
  );
}
