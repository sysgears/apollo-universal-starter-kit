const exportedAssets = {};

if (!__TEST__) {
  // Favicon.ico should not be hashed, since some browsers expect it to be exactly on /favicon.ico URL
  require('!file-loader?name=[name].[ext]!./assets/favicon.ico'); // eslint-disable-line

  // Require all files from assets dir recursively addding them into assets.json
  const req = require.context('!file-loader?name=[hash].[ext]!./assets', true, /.*/);
  req.keys().map((key) => {
    exportedAssets[`${key.replace('./', '')}`] = req(key);
  });
}

export default exportedAssets;
