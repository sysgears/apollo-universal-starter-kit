import React, { PropTypes } from 'react'

export const footerHeight = '40px';

const Html = ({ content, state, assetMap, css }) => {
  return (
    <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Apollo Fullstack Starter Kit</title>
      <style data-aphrodite>${css.content}</style>
      <style type="text/css" dangerouslySetInnerHTML={{ __html: `
        html {
          min-height: 100%;
          position: relative;
        }

        body {
          margin-bottom: ${footerHeight}
        }
      ` }}/>
    </head>
    <body>
    <div id="content" dangerouslySetInnerHTML={{ __html: content }} />
    <script
      dangerouslySetInnerHTML={{ __html: `window.__APOLLO_STATE__=${JSON.stringify(state)};` }}
      charSet="UTF-8"
    />
    <script src={"/assets/" + assetMap['bundle.js']} charSet="utf-8" />
    </body>
    </html>
  );
};

Html.propTypes = {
  content: PropTypes.string.isRequired,
  state: PropTypes.object.isRequired,
  assetMap: PropTypes.object.isRequired,
  css: PropTypes.object.isRequired,
};

export default Html;
