import React, { useState, useEffect, useRef } from 'react';
import {Column, Table, AutoSizer, ArrowKeyStepper} from 'react-virtualized';

import EditableCell from './EditableCell';

import 'react-virtualized/styles.css';

export default function({ rows, onChange, removeItem, instanceName, filteredBy }) {
  const [ selectedRow, setSelectedRow ] = useState(undefined);
  const fields = useRef([]);
  const editing = useRef(null)
  const containerRef = useRef(null);
  const tableRef = useRef(null);

  /**
   * Save a cell change
   */
  async function onCellChanged(newVal, field) {
    const { context } = field;
    const { dataKey, rowData, rowIndex } = context;
    const oldData = { ...rowData };
    const newData = { ...oldData };
    newData[dataKey] = newVal;

    // If this is a new field key, edit the value too
    if (rowData.isNew && dataKey === 'key') {
      editNextField(field);
    } else {

    }

    if (typeof onChange === 'function') {
      await onChange(oldData, newData);
    }
  }

  /**
   * Edit the next field in the row
   * @param {int} field - The current field
   */
  function editNextField(field) {
    const { context } = field;
    const { rowIndex, dataKey } = context;
    const nextField = (dataKey === 'key') ? 'value' : 'key';
    const rowFields = fields.current[rowIndex];

    // Keep this saved, so that if the table updates, it stayes editable
    editing.current = {
      row: rowIndex,
      key: nextField,
    };

    if (rowFields && rowFields[nextField]) {
      rowFields[nextField].setEditable(true);
    }
  }

  /**
   * Edit the selected row
   */
  function editSelectedRow() {
    const field = fields.current[selectedRow];
    if (!field) return;

    // This is the new item row
    if (selectedRow >= rows.length) {
      field.key.setEditable(true);
    } else {
      field.value.setEditable(true);
    }
  }

  /**
   * Keypress handler
   * @param {Event} evt
   */
  function onKeyPress(evt) {
    // No row selected
    if (typeof selectedRow !== 'number') {
      return;
    }

    const row = rows[selectedRow];
    switch (evt.key) {
      // Delete selected row
      case 'Backspace':
      case 'Delete':
        if (row && typeof removeItem === 'function') {
          removeItem(row.key);
        }
        break;
      // Edit row
      case 'Enter':
        editSelectedRow();
        break;

    }
  }

  /**
   * A field editability changed
   * @param {EditableCell} field
   */
  function onEditableChange(field) {
    const { dataKey, rowIndex } = field.context;
    const { isNew } = field.context.rowData;

    // If this is the new item row, make sure we set the key first
    if (field.isEditable && isNew && dataKey === 'value') {
      const keyField = fields.current[rowIndex]?.key;
      if (!keyField) return;

      // Key already has value
      const keyValue = keyField.fieldValue
      if (keyValue) return;

      keyField.setEditable(true);
      return false;
    }

    // Track which field is currently being edited (this way we can keep it editing if the table updates)
    if (field.isEditable) {
      editing.current = {
        row: rowIndex,
        key: dataKey,
      }
    } else if (editing.current && rowIndex === editing.current.row && dataKey == editing.current.key) {
      editing.current = null;
    }

    // Return keyboard control to the table
    if (!editing.current && typeof selectedRow === 'number') {
      const grid = containerRef.current.querySelector('.ReactVirtualized__Table__Grid');
      grid.focus();
      window.scrollTo(0, 0);
    }
  }

  /**
   * Generate a class name for a row
   */
  function rowClassName({ index }) {
    let name = 'row';
    if (selectedRow === index) {
      name += ' selected-row';
    }
    if (index % 2) {
      name += ' even';
    } else {
      name += ' odd';
    }
    return name;
  }

  /**
   * Return row data
   */
  function rowGetter({ index }) {
    if (index >= rows.length) {
      return { key: '', value: '', isNew: true };
    }
    return rows[index];
  }

  /**
   * Render a single data cell
   * @param {Object} context - An object with information about the row and cell
   */
  function cellRenderer(context) {
    const { rowData, cellData, dataKey, rowIndex } = context;
    const key = `${dataKey}-${rowData.key}`;
    const isEditing = editing.current || {};
    fields.current[rowIndex] = fields.current[rowIndex] || {};

    function onLoad(obj) {
      fields.current[rowIndex][dataKey] = obj;
    }

    return (
      <EditableCell
        key={key}
        value={cellData}
        context={context}
        defaultEditable={(isEditing.row === rowIndex && isEditing.key === dataKey)}
        onLoad={onLoad}
        onEditableChange={onEditableChange}
        onChange={onCellChanged}
        nextField={editNextField}
      >
        {cellData}
      </EditableCell>
    );
  }

  /**
   * On load/mount
   */
  useEffect(() => {
    window.tableRef = tableRef;
  }, []);

  /**
   * When the LocalForage instance or filter string changes
   */
  useEffect(() => {
    fields.current = [];
    setSelectedRow(undefined);
  }, [ instanceName, filteredBy ]);


  /**
   * Add focus handler to the table grid
   */
  useEffect(() => {
    const grid = containerRef.current.querySelector('.ReactVirtualized__Table__Grid');

    // Select the first row if one isn't selected yet
    const focusHandler = () => {
      const selection = grid.querySelector('.ReactVirtualized__Table__row.selected-row')
      if (!selection) {
        setSelectedRow(0);
      }
      window.scrollTo(0, 0); // keep the window from jumping
    };

    if (grid) {
      grid.addEventListener('focus', focusHandler);
    }

    // Unregister
    return () => {
      grid.removeEventListener('focus', focusHandler);
    }
  }, []);

  return (
    <>
      <section ref={containerRef} onKeyDown={onKeyPress}>
        <AutoSizer>
          {({height, width}) => (
            <ArrowKeyStepper
              columnCount={1}
              rowCount={rows.length + 1}
              isControlled={true}
              scrollToRow={selectedRow}
              scrollToColumn={0}
              onScrollToChange={({ scrollToRow }) => setSelectedRow(scrollToRow)}
              mode="cells"
            >
              {({onSectionRendered, scrollToRow}) => (
                <Table
                  ref={tableRef}
                  height={height}
                  width={width}
                  headerHeight={20}
                  rowHeight={30}
                  rowCount={rows.length + 1}
                  rowGetter={rowGetter}
                  scrollToIndex={scrollToRow}
                  onRowsRendered={({ startIndex, stopIndex }) => {
                    onSectionRendered({
                      rowStartIndex: startIndex,
                      rowStopIndex: stopIndex
                    });
                  }}
                  onRowClick={({ index }) => setSelectedRow(index)}
                  rowClassName={rowClassName}
                >
                  <Column
                    label="Key"
                    dataKey="key"
                    width={width * .25}
                    className="key-column"
                    cellRenderer={(renderData) => cellRenderer(renderData)}
                  />
                  <Column
                    label="Value"
                    dataKey="value"
                    width={width * .75}
                    className="value-column"
                    cellRenderer={(renderData) => cellRenderer(renderData)}
                  />
                </Table>
              )}
            </ArrowKeyStepper>
          )}
        </AutoSizer>
      </section>
      <style jsx>{`
        section {
          position: absolute;
          width: 100%;
          top: 30px;
          left: 0;
          right: 0;
          bottom: 0;
          border-top: 2px solid var(--border-color);
        }
        section :global(.ReactVirtualized__Table__Grid) {
          background: var(--table-background);
          outline: none;
        }
        section :global(.ReactVirtualized__Table__headerTruncatedText) {
          text-transform: none;
          font-weight: 400;
        }
        section :global(.ReactVirtualized__Table__row) {
          outline: none;
        }
        section :global(.ReactVirtualized__Table__headerRow) {
          line-height: 20px;
          background: var(--table-header-background);
          border-bottom: 1px solid var(--border-color);
        }
        section :global(.ReactVirtualized__Table__headerColumn) {
          margin: 0;
        }
        section :global(.ReactVirtualized__Table__headerTruncatedText) {
          padding: 0 10px;
        }
        section :global(.ReactVirtualized__Table__rowColumn) {
          margin: 0;
        }
        section :global(.ReactVirtualized__Table__headerColumn),
        section :global(.ReactVirtualized__Table__rowColumn) {
          border-right: 1px solid var(--border-color);
        }
        section :global(.ReactVirtualized__Table__headerColumn):last-child,
        section :global(.ReactVirtualized__Table__rowColumn):last-child {
          border-right: none;
        }
        section :global(.ReactVirtualized__Table__row.even) {
          background-color: var(--table-row-even-background);
        }
        section :global(.ReactVirtualized__Table__row.odd) {
          background-color: var(--table-row-odd-background);
        }
        section :global(.ReactVirtualized__Table__row.selected-row) {
          color: var(--table-row-selected-color);
          background-color: var(--table-row-selected-background);
        }
      `}</style>
    </>
  );
}
