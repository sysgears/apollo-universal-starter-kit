declare let __TEST__: boolean;
declare let __SERVER__: boolean;
declare let __CLIENT__: boolean;
declare let __SSR__: boolean;
declare let __API_URL__: string;
declare let __WEBSITE_URL__: string;

interface Window {
  __APOLLO_STATE__?: any;
  __SERVER_ERROR__?: any;
}

// packages without types
declare module 'react-native-credit-card-input';
declare module 'sourcemapped-stacktrace';
declare module 'minilog';

// Fix VS Code auto-import issue with console:
// https://stackoverflow.com/questions/53279182/vscode-imports-import-console-requireconsole-automatically
declare module 'console' {
  export = typeof import('console');
}

declare module '@fortawesome/react-fontawesome' {
  import ReactFontawesome from '@fortawesome/react-fontawesome';
  import React from 'react';

  type IconProps = React.DOMAttributes<SVGSVGElement> & ReactFontawesome.Props;

  export function FontAwesomeIcon(props: IconProps): JSX.Element;
}
