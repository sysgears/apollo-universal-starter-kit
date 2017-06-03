require('react-native/packager/src/Resolver/polyfills/require.js');
require('react-native/packager/src/Resolver/polyfills/polyfills.js');
require('react-native/packager/src/Resolver/polyfills/console.js');
require('react-native/packager/src/Resolver/polyfills/error-guard.js');
require('react-native/packager/src/Resolver/polyfills/Number.es6.js');
require('react-native/packager/src/Resolver/polyfills/String.prototype.es6.js');
require('react-native/packager/src/Resolver/polyfills/Array.prototype.es6.js');
require('react-native/packager/src/Resolver/polyfills/Array.es6.js');
require('react-native/packager/src/Resolver/polyfills/Object.es7.js');
require('react-native/packager/src/Resolver/polyfills/babelHelpers.js');

global['__DEV__'] = __DEV__;
global.__BUNDLE_START_TIME__ = Date.now();

require("react-native/Libraries/BatchedBridge/NativeModules.js");
require("react-native/Libraries/Core/InitializeCore.js");
require("react-native/Libraries/Network/fetch.js");
