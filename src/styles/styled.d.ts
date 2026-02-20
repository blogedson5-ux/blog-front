import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      background: string;
      text: string;
      border: string;
      primary: string;
      hover: string;
    };
    breakpoints: {
      tablet: string;
      desktop: string;
    };
  }
}
