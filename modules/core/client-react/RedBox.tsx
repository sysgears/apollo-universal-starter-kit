import React, { useState, useEffect } from 'react';
import ErrorStackParser from 'error-stack-parser';
import { StackFrame } from 'error-stack-parser';
import { mapStackTrace } from 'sourcemapped-stacktrace';

import settings from '@gqlapp/config';

const format = (fmt: string, ...args: any[]) =>
  fmt.replace(/{(\d+)}/g, (match: any, index: number) => (typeof args[index] !== 'undefined' ? args[index] : match));

interface RedBoxProps {
  error?: Error;
}

const RedBox = ({ error }: RedBoxProps) => {
  const { file, linkToFile, redbox, message, stack: styleStack, frame: frameStyle } = styles;

  const [mapped, setMapped] = useState(false);

  useEffect(() => {
    if (!mapped && !__TEST__) {
      mapStackTrace(error.stack, (mappedStack: string[]) => {
        const processStack = __DEV__
          ? fetch('/servdir')
              .then((res: any) => res.text())
              .then((servDir: string) => mappedStack.map((frame: string) => frame.replace('webpack:///', servDir)))
          : Promise.resolve(mappedStack);
        processStack.then((stack: string[]) => {
          error.stack = stack.join('\n');
          setMapped(true);
        });
      });
    }
  }, []);

  const renderFrames = (framesData: StackFrame[]) => {
    return framesData.map((frame: StackFrame, index: number) => {
      const text: string = `at ${frame.fileName}:${frame.lineNumber}:${frame.columnNumber}`;
      const url: string = format(
        settings.app.stackFragmentFormat,
        frame.fileName,
        frame.lineNumber,
        frame.columnNumber
      );

      return (
        <div style={frameStyle} key={index}>
          <div>{frame.functionName}</div>
          <div style={file}>
            <a href={url} style={linkToFile}>
              {text}
            </a>
          </div>
        </div>
      );
    });
  };

  let frames: any;
  try {
    if (error.message.indexOf('\n    at ') >= 0) {
      // We probably have stack in our error message
      // a trick used by our errorMiddleware to pass error stack
      // when GraphQL context creation failed, use that stack
      error.stack = error.message;
      error.message = error.stack.split('\n')[0];
    }
    frames = renderFrames(ErrorStackParser.parse(error));
  } catch (e) {
    frames = (
      <div style={frameStyle} key={0}>
        <div>Failed to parse stack trace. Stack trace information unavailable.</div>
      </div>
    );
  }

  return (
    <div style={redbox}>
      <div style={message}>
        {error.name}: {error.message}
      </div>
      <div style={styleStack}>{frames}</div>
    </div>
  );
};

const styles: any = {
  redbox: {
    boxSizing: 'border-box',
    fontFamily: 'sans-serif',
    position: 'fixed',
    padding: 10,
    top: '0px',
    left: '0px',
    bottom: '0px',
    right: '0px',
    width: '100%',
    background: 'rgb(204, 0, 0)',
    color: 'white',
    zIndex: 2147483647,
    textAlign: 'left',
    fontSize: '16px',
    lineHeight: 1.2,
    overflow: 'auto'
  },
  message: {
    fontWeight: 'bold'
  },
  stack: {
    fontFamily: 'monospace',
    marginTop: '2em'
  },
  frame: {
    marginTop: '1em'
  },
  file: {
    fontSize: '0.8em',
    color: 'rgba(255, 255, 255, 0.7)'
  },
  linkToFile: {
    textDecoration: 'none',
    color: 'rgba(255, 255, 255, 0.7)'
  }
};

export default RedBox;
