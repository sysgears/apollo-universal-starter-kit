// Loading the initialization for service workers
require('!file-loader?name=./initServiceWorker.js!./initServiceWorker.js'); // eslint-disable-line import/no-webpack-loader-syntax
// Logading the service workers
require('!file-loader?name=./basicServiceWorker.js!./sw/basicServiceWorker.js'); // eslint-disable-line import/no-webpack-loader-syntax