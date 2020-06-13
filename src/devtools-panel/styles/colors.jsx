import css from 'styled-jsx/css'

export default css.global`
  :root {
    --color: #303942;
    --background: #f3f3f3;
    --border-color: #aaa;

    --table-background: #f3f3f3;
    --table-header-background: #f3f3f3;
    --table-row-odd-background: #fff;
    --table-row-even-background: #f2f7fe;
    --table-row-selected-color: #fff;
    --table-row-selected-background: #1b73e8;
    --table-input-color: var(--color);
    --table-input-background: #fff;

    --input-color: #808080;
    --input-background: #fff;
    --input-hover-border: #e0e0e0;
    --input-focus-border: #1b73e8;
    --input-clear-btn-color: #d2d2d2;

    --icon-button-color: #656565;
    --icon-button-hover-color: #333;
    --icon-button-focus-background: #e0e0e0;

    --modal-color: var(--color);
    --modal-background: #f2f7fe;
    --modal-mask-background: rgba(0,0,0, 0.5);
    --modal-header-background: #e0e0e0;
    --modal-actions-background: #e0e0e0;
    --modal-button-color: #fff;
    --modal-button-background: #246dce;
    --modal-button-border: #246dce;
    --modal-button-hover-border: #5a5a5a;
    --modal-button-focus-border: #0f639d;
  }
  /* Chrome dark color scheme */
  @media (prefers-color-scheme: dark)  {
    :root .chrome-browser {
      --color: #bec6cf;
      --background: #333;
      --border-color: #555;

      --table-background: #242424;
      --table-header-background: #333;
      --table-row-odd-background: #333;
      --table-row-even-background: #0b2544;
      --table-row-selected-color: inherit;
      --table-row-selected-background: #0f639d;
      --table-input-color: #bec6cf;
      --table-input-background: #242424;

      --input-color: #7f7f7f;
      --input-background: #242424;
      --input-hover-border: #5a5a5a;
      --input-focus-border: #0f639d;
      --input-clear-btn-color: #8f8f8f;

      --icon-button-color: #919191;
      --icon-button-hover-color: #ccc;
      --icon-button-focus-background: #434343;

      --modal-color: var(--color);
      --modal-background: #434343;
      --modal-mask-background: rgba(0,0,0, 0.5);
      --modal-header-background: #333;
      --modal-actions-background: #333;
      --modal-button-color: #7f7f7f;
      --modal-button-background: #242424;
      --modal-button-border: #242424;
      --modal-button-hover-border: #5a5a5a;
      --modal-button-focus-border: #0f639d;
    }
  }
`;
