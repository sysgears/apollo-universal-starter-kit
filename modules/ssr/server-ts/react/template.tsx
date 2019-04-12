import React, { ReactElement } from 'react';
import { HelmetData } from 'react-helmet';
import serialize from 'serialize-javascript';
import ClientModule from '@gqlapp/module-client-react';
import { styles } from '@gqlapp/look-client-react';

export interface DocumentProps {
  content: string;
  state: any;
  css: Array<ReactElement<{}>>;
  helmet: HelmetData;
  clientModules: ClientModule;
  assetMap: { [key: string]: string };
}

const mapStylesToTags = (style: any) => style._getCss();
const mapScriptsToTags = (script: string, i: number) => script && <script key={i} src={script} />;

export const Document = ({ content, state, css, helmet, clientModules, assetMap }: DocumentProps) => {
  return (
    <html lang="en" {...helmet.htmlAttributes.toComponent()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

        {helmet.title.toComponent()}
        {helmet.meta.toComponent()}
        {helmet.link.toComponent()}

        <link rel="apple-touch-icon" sizes="180x180" href={`${assetMap['apple-touch-icon.png']}`} />
        <link rel="icon" type="image/png" href={`${assetMap['favicon-32x32.png']}`} sizes="32x32" />
        <link rel="icon" type="image/png" href={`${assetMap['favicon-16x16.png']}`} sizes="16x16" />
        <link rel="manifest" href={`${assetMap['manifest.xjson']}`} />
        <link rel="mask-icon" href={`${assetMap['safari-pinned-tab.svg']}`} color="#5bbad5" />
        <link rel="shortcut icon" href={`${assetMap['favicon.ico']}`} />

        <meta name="msapplication-config" content={`${assetMap['browserconfig.xml']}`} />
        <meta name="theme-color" content="#ffffff" />

        {!__DEV__ && <link rel="stylesheet" type="text/css" href={`${assetMap['index.css']}`} />}
        {!!__DEV__ && (
          <style
            dangerouslySetInnerHTML={{
              __html: styles._getCss() + clientModules.stylesInserts.map(mapStylesToTags).join('')
            }}
          />
        )}
        {!!css && css}
        {clientModules.scriptsInserts.map(mapScriptsToTags)}
      </head>
      <body {...helmet.bodyAttributes.toComponent()}>
        <div id="root" dangerouslySetInnerHTML={{ __html: content || '' }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__APOLLO_STATE__=${serialize(state, {
              isJSON: true
            })};`
          }}
          charSet="UTF-8"
        />
        {assetMap['vendor.js'] && <script src={`${assetMap['vendor.js']}`} charSet="utf-8" />}
        <script src={`${assetMap['index.js']}`} charSet="utf-8" />
      </body>
    </html>
  );
};
