import React from 'react';
import { MdRefresh } from "react-icons/md";
import { iconButton } from '../../styles/controls';

/**
 * Reload button
 */
export default function Reload({ reload }) {
  return (
    <>
      <button title="Reload" onClick={reload} className="icon-button">
        <MdRefresh className="reload-icon" size={16} />
      </button>
      <style jsx>{iconButton}</style>
      <style jsx>{`
        .icon-button :global(svg) {
          stroke-width: 0.5;
        }
      `}</style>
    </>
  );
}
