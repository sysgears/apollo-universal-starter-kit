import React, { PropTypes } from 'react'

function Html({ content, state, css, commonCss }) {
  return (
    <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Apollo Fullstack Starter Kit</title>
      <style data-aphrodite>${css.content}</style>
      <style>${commonCss}</style>
    </head>
    <body>
    <div id="content" dangerouslySetInnerHTML={{ __html: content }} />
    <script
      dangerouslySetInnerHTML={{ __html: `window.__APOLLO_STATE__=${JSON.stringify(state)};` }}
      charSet="UTF-8"
    />
    <script src="/assets/bundle.js" charSet="utf-8" />
    </body>
    </html>
  );
}

Html.propTypes = {
  content: PropTypes.string.isRequired,
  state: PropTypes.object.isRequired,
  css: PropTypes.object.isRequired,
  commonCss: PropTypes.string.isRequired,
};

export default Html;
