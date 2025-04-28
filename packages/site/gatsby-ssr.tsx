// packages/site/gatsby-browser.tsx  (and the same in gatsby-ssr.tsx)
import React from "react";
import type { WrapRootElementBrowserArgs } from "gatsby";
import { ThemeProvider } from "styled-components";
import App from "./src/App";
import { theme } from "./src/theme";

export const wrapRootElement = ({
  element,
}: WrapRootElementBrowserArgs): React.ReactNode => {
  return (
    <ThemeProvider theme={theme}>
      <App>{element}</App>
    </ThemeProvider>
  );
};