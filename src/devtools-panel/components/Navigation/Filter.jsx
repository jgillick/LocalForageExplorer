import React, { useState, useEffect } from 'react';
import { MdAddCircle } from "react-icons/md";
import { button, input } from '../styles';

/**
 * Reload button
 */
export default function Filter({
  value,
  onChange
}) {

  /**
   * The filter value changed
   */
  function handleChange(event) {
    if (typeof onChange === 'function') {
      onChange(event.target.value);
    }
  }

  /**
   * Key pressed in the field
   */
  function onKeyPress(evt) {
    evt.stopPropagation();
    switch (evt.key) {
      case 'Escape':
        clearValue();
        break;
    }
  }

  /**
   * Clear the filter value
   */
  function clearValue() {
    if (typeof onChange === 'function') {
      onChange('');
    }
  }

  return (
    <>
      <div>
        <div className="compount-field">
          <input
            type="text"
            placeholder="Filter"
            value={value}
            onChange={handleChange}
            onKeyDown={onKeyPress}
          />
          {value && (
            <button className="clear" onClick={clearValue}>
              <MdAddCircle />
            </button>
          )}
        </div>
      </div>
      <style jsx>{button}</style>
      <style jsx>{input}</style>
      <style jsx>{`
        div {
          display: flex;
          justify-content: flex-start;
          flex-grow: 2;
          text-align: left;
          margin: 0 5px;
        }
        .compount-field {
          width: 100%;
          max-width: 200px;
          position: relative;
        }
        .clear {
          position: absolute;
          top: 2px;
          right: 2px;
          color: #d2d2d2;
        }
        .clear :global(svg) {
          transform: rotate(45deg);
        }
        input {
          height: 20px;
          width: 100%;
          padding: 4px 20px 4px 3px;
        }

        /* Dark mode */
        @media (prefers-color-scheme: dark) {
          .clear {
            color: #8f8f8f;
          }
        }
      `}</style>
    </>
  );
}
