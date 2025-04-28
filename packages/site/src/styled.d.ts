// packages/site/src/styled.d.ts
import "styled-components";

// Tell TS exactly what our theme object contains
declare module "styled-components" {
  export interface DefaultTheme {
    mediaQueries: {
      small: string;
      medium: string;
      large: string;
    };
  }
}