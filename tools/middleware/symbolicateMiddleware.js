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

 * Updated by Victor Vlasenko (SysGears INC) to support Webpack DLL inside
 * generated bundle
 *
 * @flow
 *
 * --- OVERVIEW ---
 *
 *   When running in dev mode, React Native handles source map lookups by
 *   asking the packager to do it.
 *
 *   It does a POST to /symbolicate and passes the call stack and expects
 *   back the same structure, but with the appropriate lines, columns & files.
 *
 *   This is the express middleware which will handle that endpoint by reading
 *   the source map that is tucked away inside webpack's in-memory filesystem.
 *
 */
import type { $Request, Middleware } from 'express';
import type { ReactNativeStackFrame, ReactNativeStack } from 'haul-cli/src/types';

const SourceMapConsumer = require('source-map').SourceMapConsumer;
const path = require('path');
const delve = require('dlv');
const messages = require('haul-cli/src/messages');
const logger = require('haul-cli/src/logger');

type ReactNativeSymbolicateRequest = {
  stack: ReactNativeStack,
};

type ReactNativeSymbolicateResponse = {
  stack: ReactNativeStack,
};

/**
 * Creates a SourceMapConsumer so we can query it.
 */
function createSourceMapConsumer(compiler: *) {
  // turns /path/to/use into 'path.to.use'
  const outputPath: string = compiler.options.output.path;
  const hops: Array<string> = outputPath
    .split(path.sep)
    .filter((pathPart: string) => pathPart !== ''); // no blanks please

  // grab the base directory out of webpack's deeply nested filesystem
  const base = delve(compiler.outputFileSystem.data, hops);

  // grab the Buffer for the source map
  const sourceMapBuffer = base &&
    base[`${compiler.options.output.filename}.map`];

  // we stop here if we couldn't find that map
  if (!sourceMapBuffer) {
    logger.warn(messages.sourceMapFileNotFound());
    return null;
  }

  // feed the raw source map into our consumer
  try {
    const raw: string = sourceMapBuffer.toString();
    return new SourceMapConsumer(raw);
  } catch (err) {
    logger.error(messages.sourceMapInvalidFormat());
    return null;
  }
}

/**
 * Gets the stack frames that React Native wants us to convert.
 */
function getRequestedFrames(req: $Request): ?ReactNativeStack {
  if (typeof req.rawBody !== 'string') {
    return null;
  }

  try {
    const payload: ReactNativeSymbolicateRequest = JSON.parse(req.rawBody);
    return payload.stack;
  } catch (err) {
    // should happen, but at least we won't die
    return null;
  }
}

/**
 * Create an Express middleware for handling React Native symbolication requests
 */
function create(compiler: *, offset): Middleware {
  /**
   * The Express middleware for symbolicatin'.
   */
  function symbolicateMiddleware(req: $Request, res, next) {
    if (req.path !== '/symbolicate') return next();

    // grab our source map consumer
    const consumer = createSourceMapConsumer(compiler);
    if (!consumer) return next();

    // grab the source stack frames
    const unconvertedFrames = getRequestedFrames(req);
    if (!unconvertedFrames) return next();

    // the base directory
    const root = compiler.options.context;

    // error error on the wall, who's the fairest stack of all?
    const convertedFrames = unconvertedFrames.map(
      (originalFrame): ReactNativeStackFrame => {
        // find the original home of this line of code.
        const lookup = consumer.originalPositionFor({
          line: originalFrame.lineNumber - offset,
          column: originalFrame.column,
        });

        // console.log("line:", originalFrame.lineNumber, "column:", originalFrame.column, "offset:", offset, "lookup:", lookup);

        // If lookup fails, we get the same shape object, but with
        // all values set to null
        if (lookup.source == null) {
          // It is better to gracefully return the original frame
          // than to throw an exception
          return originalFrame;
        }

        // convert the original source into an absolute path
        const mappedFile = lookup.source
          .replace('webpack:///~', path.resolve(root, 'node_modules'))
          .replace('webpack://', root);

        // console.log("orig frame:", originalFrame);
        // convert these to a format which React Native wants
        return {
          ...originalFrame,
          file: mappedFile,
          methodName: originalFrame.methodName,
          lineNumber: lookup.line,
          column: lookup.column,
        };
      },
    );

    // send it back to React Native
    const responseObject: ReactNativeSymbolicateResponse = {
      stack: convertedFrames,
    };
    const response = JSON.stringify(responseObject);
    Promise.resolve(response).then(
      response => {
        console.log("symbol resp:", response);
        res.write(response);
        res.end();
      }
    );
  }

  return symbolicateMiddleware;
}

export default create;
