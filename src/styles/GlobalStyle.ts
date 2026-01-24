import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', sans-serif;
    background: #fff;
    color: #111827;
  }

  button {
    cursor: pointer;
    border: none;
    font-family: inherit;
  }
`;
