import React from 'react';
import { MdRefresh } from "react-icons/md";
import { button } from '../styles';

/**
 * Reload button
 */
export default function Reload({ reload }) {
  return (
    <>
      <button title="Reload" onClick={reload}>
        <MdRefresh className="reload-icon" size={16} />
      </button>
      <style jsx>{button}</style>
      <style jsx>{`
        button :global(svg) {
          stroke-width: 0.5;
        }
      `}</style>
    </>
  );
}
