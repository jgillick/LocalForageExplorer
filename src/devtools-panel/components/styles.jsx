/* styles.js */
import css from 'styled-jsx/css'

export const button = css`
  button {
    appearance: none;
    padding: 2px;
    margin: 0;
    border: none;
    background: none;
    outline: none;
    font-size: 16px;
    border-radius: 2px;
  }
  button:hover {
    color: #333;
  }
  button,
  button:active {
    color: #656565;
  }
  button:focus {
    background: #e0e0e0;
  }

  /* Dark mode */
  @media (prefers-color-scheme: dark) {
    button:hover {
      color: #ccc;
    }
    button,
    button:active {
      color: #919191;
    }
    button:focus {
      background: #434343;
    }
  }
`;

export const input = css`
  /* Light mode */
  input,
  select {
    color: #808080;
    background: #fff;
    border: 1px solid #fff;
  }

  input:hover,
  select:hover {
    border-color: #e0e0e0;
  }

  input:focus,
  select:focus {
    border-color: #1b73e8;
    outline: none;
  }
  /* Dark mode */
  @media (prefers-color-scheme: dark) {
    input,
    select {
      color: #7f7f7f;
      background: #242424;
      border: 1px solid #242424;
    }

    input:hover,
    select:hover {
      border-color: #5a5a5a;
    }

    input:focus,
    select:focus {
      border-color: #0f639d;
      outline: none;
    }
  }
`
