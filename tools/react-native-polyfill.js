/**
 * Copyright 2017-present, Callstack.
 * All rights reserved.
 *
 * MIT License
 *
 * Copyright (c) 2017 Mike Grabowski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * polyfillEnvironment.js
 *
 * This file is loaded as a part of user bundle
 */

/* eslint-disable import/no-extraneous-dependencies */
require('haul-cli/vendor/polyfills/console.js');
require('haul-cli/vendor/polyfills/error-guard.js');
require('haul-cli/vendor/polyfills/Number.es6.js');
require('haul-cli/vendor/polyfills/String.prototype.es6.js');
require('haul-cli/vendor/polyfills/Array.prototype.es6.js');
require('haul-cli/vendor/polyfills/Array.es6.js');
require('haul-cli/vendor/polyfills/Object.es6.js');
require('haul-cli/vendor/polyfills/Object.es7.js');
require('haul-cli/vendor/polyfills/babelHelpers.js');

// HACK:
//   This is horrible.  I know.  But this hack seems to be needed due to the way
//   React Native lazy evaluates `fetch` within `InitializeCore`.  This was fixed
//   in 34-ish, but seems to be back again.  I hope I'm wrong because I lost sleep
//   on this one.
//
//   Without this in place, global.fetch will be undefined and cause the symbolicate
//   check to fail.  This must be something that the packager is doing that haul isn't.
//   I also so people complaining about this in Jest as well.
//
if (!global.self) {
  global.self = global; /* eslint-disable-line */
}

// Needed to be loaded first for React Native <= 0.42.x
require("react-native/Libraries/BatchedBridge/NativeModules.js");
require("react-native/Libraries/Core/InitializeCore.js");
