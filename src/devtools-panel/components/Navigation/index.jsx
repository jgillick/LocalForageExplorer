import React from 'react';
import Filter from './Filter';
import Reload from './Reload';
import InstanceSelector from './InstanceSelector';

export default function Navigation({
  reload,
  instances,
  addInstance,
  setInstanceName,
  selectedInstance,
  filterValue,
  onFilterChange,
}) {
  return (
    <>
      <nav>
        <Reload reload={reload} />
        <Filter value={filterValue} onChange={onFilterChange} />
        <InstanceSelector
          instances={instances}
          setInstanceName={setInstanceName}
          addInstance={addInstance}
          selectedInstance={selectedInstance}
        />
      </nav>
      <style jsx>{`
        nav {
          height: 30px;
          padding: 3px 10px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: space-between;
          align-content: stretch;
        }
      `}</style>
    </>
  );
}
