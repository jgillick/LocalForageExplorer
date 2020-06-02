import React from 'react';
import Filter from './Filter';
import Reload from './Reload';
import InstanceSelector from './InstanceSelector';

export default function Navigation({
  reload,
  setInstanceName,
  filterValue,
  onFilterChange,
}) {
  return (
    <>
      <nav>
        <Reload reload={reload} />
        <Filter value={filterValue} onChange={onFilterChange} />
        <InstanceSelector setInstanceName={setInstanceName} />
      </nav>
      <style jsx>{`
        nav {
          padding: 5px 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          align-content: stretch;
        }
      `}</style>
    </>
  );
}
