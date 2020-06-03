import css from 'styled-jsx/css'
import colors from './colors';

export const iconButton = css`
  {colors}
  .icon-button {
    appearance: none;
    padding: 2px;
    margin: 0;
    border: none;
    background: none;
    outline: none;
    font-size: 16px;
    border-radius: 2px;
  }
  .icon-button:hover {
    color: var(--icon-button-hover-color);
  }
  .icon-button,
  .icon-button:active {
    color: var(--icon-button-color);
  }
  .icon-button:focus {
    background: var(--icon-button-focus-background);
  }
`;

export const input = css`
  {colors}
  input,
  select {
    color: var(--input-color);
    background: var(--input-background);
    border: 1px solid var(--input-background);
  }

  input:hover,
  select:hover {
    border-color: var(--input-hover-border);
  }

  input:focus,
  select:focus {
    border-color: var(--input-hover-border);
    outline: none;
  }
`
