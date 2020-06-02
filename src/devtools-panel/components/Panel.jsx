import React, { useState, useEffect } from 'react';
import remoteLocalForage from '../modules/remoteLocalForage';

import Navigation from './Navigation';
import DataTable from './DataTable';

export default function Panel() {
  const [ rowData, setRowData ] = useState([]);
  const [ filteredRows, setFilteredRows ] = useState([]);
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

    const search = filterValue.trim().toLowerCase();
    const filtered = rowData.filter(({ key, value }) => {
      return (key.toLowerCase().includes(search) || value.includes(search));
    });
    setFilteredRows(filtered);
  }

  /**
   * Load data from localforage
   */
  async function loadData() {
    try {
      console.log('Get data?');
      const storeData = await remoteLocalForage.getData(instanceName);
      console.log('Return', storeData);
      const dataMap = new Map();

      // Use a map to maintain order
      rowData.forEach((item) => {
        dataMap.set(item.key, item.value);
      });

      // Add elements
      Object.entries(storeData).forEach(([key, rawValue]) => {
        let value = rawValue;
        if (typeof value !== 'string' && typeof value !== 'number') {
          value = JSON.stringify(value);
        }
        dataMap.set(key, value);
      });

      // Export to array
      // Remove elements not included in store data
      const dataArr = [];
      dataMap.forEach((value, key) => {
        if (typeof storeData[key] !== 'undefined') {
          dataArr.push({ key, value: storeData[key] });
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
  async function onChange(oldData, newData) {
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
   * Localforage instance name changed
   */
  useEffect(() => {
    setFilterValue('');
    setFilteredRows([]);
    loadData();
  }, [instanceName]);

  /**
   * Filter data
   */
  useEffect(() => {
    filterRows();
  }, [filterValue, rowData])

  return (
    <>
      <div className="panel-container">
        <Navigation
          reload={loadData}
          setInstanceName={setInstanceName}
          filterValue={filterValue}
          onFilterChange={setFilterValue}
        />
        <DataTable
          rows={filteredRows}
          onChange={onChange}
          removeItem={removeItem}
          filteredBy={filterValue}
          instanceName={instanceName} />
      </div>
      <style jsx>{`
        .panel-container {
          font-size: 12px;
          font-family: Roboto;
          padding: 0;
          margin: 0;
        }

        /* Light mode */
        .panel-container {
          color: #303942;
          background: #f3f3f3;
        }
        /* Dark mode */
        @media (prefers-color-scheme: dark) {
          .panel-container {
            color: #bec6cf;
            background: #333;
          }

        }
      `}</style>
    </>
  );
}
