import React, { useRef, useState, useEffect } from 'react';

/**
 * Creates a table cell that is editable when double clicked
 */
export default function EditableCell({
  value,
  defaultEditable,
  context,
  onChange,
  onLoad,
  nextField,
  onEditableChange,
}) {
  const [ fieldValue, setFieldValue ] = useState(value);
  const [ isEditable, setEditable ] = useState(defaultEditable);
  const inputEl = useRef(null);
  const fieldAPI = useRef({
    context,
    isEditable,
    fieldValue,
    setEditable,
  });

  /**
   * Loaded
   */
  useEffect(() => {
    if (typeof onLoad === 'function') {
      onLoad(fieldAPI.current);
    }
  }, []);

  /**
   * API values changed
   */
  useEffect(() => {
    fieldAPI.current.context = context;
    fieldAPI.current.isEditable = isEditable;
    fieldAPI.current.fieldValue = fieldValue;
  }, [ context, isEditable, fieldValue]);

  /**
   * Focus/select text when field becomes editable
   */
  useEffect(() => {
    if (typeof onEditableChange === 'function') {
      const makeEditable = onEditableChange(fieldAPI.current);
      if (makeEditable === false) {
        setEditable(false);
        return;
      }
    }
    if (isEditable) {
      inputEl.current.focus();
      inputEl.current.select();
    }
  }, [isEditable]);

  /**
   * Save the input value change
   */
  function commitChange() {
    const newValue = inputEl.current.value.trim();
    if (newValue !== value) {
      if (typeof onChange === 'function') {
        onChange(newValue, fieldAPI.current);
      }
      setFieldValue(newValue);
    }
    setEditable(false);
  }

  /**
   * Double click on text
   */
  function onDoubleClick() {
    setEditable(true);
  }

  /**
   * Field has been blurred
   */
  function onBlur() {
    setEditable(false);
    commitChange();
  }

  /**
   * Key pressed in the field
   */
  function onKeyPress(evt) {
    evt.stopPropagation();
    switch (evt.key) {
      case 'Enter':
        commitChange();
        break;
      case 'Escape':
        setEditable(false);
        break;
      case 'Tab':
        nextField(fieldAPI.current);
        break;
    }
  }

  return (
    <>
      {(isEditable)
      ?
        <input
          ref={inputEl}
          defaultValue={fieldValue}
          onBlur={onBlur}
          onKeyDown={onKeyPress}
        />
      :
        <span
          className="display"
          onDoubleClick={onDoubleClick}
        >
          {fieldValue}
        </span>
      }
      <style jsx>{`
        input {
          border: none;
          cursor: default;
          width: 100%;
          color: var(--table-input-color);
          background: var(--table-input-background);
        }
        .display {
          display: block;
          line-height: 30px;
          align-items: center;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          width: auto;
        }
        input,
        .display {
          padding: 0 10px;
          height: 100%;
        }
      `}</style>
    </>
  );
}
