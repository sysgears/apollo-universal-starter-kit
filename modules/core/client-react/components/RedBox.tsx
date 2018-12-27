import React from 'react';
import ErrorStackParser from 'error-stack-parser';
import { StackFrame } from 'error-stack-parser';
import { mapStackTrace } from 'sourcemapped-stacktrace';

import settings from '../../../../settings';

const format = (fmt: string, ...args: any[]) =>
  fmt.replace(/{(\d+)}/g, (match: any, index: number) => (typeof args[index] !== 'undefined' ? args[index] : match));

interface RedBoxState {
  mapped: boolean;
}

interface RedBoxProps {
  error?: Error;
}

export default class RedBox extends React.Component<RedBoxProps, RedBoxState> {
  constructor(props: RedBoxProps) {
    super(props);
    this.state = { mapped: false };
  }

  public componentDidMount() {
    if (!this.state.mapped) {
      mapStackTrace(this.props.error.stack, (mappedStack: string[]) => {
        const processStack = __DEV__
          ? fetch('/servdir')
              .then((res: any) => res.text())
              .then((servDir: string) => mappedStack.map((frame: string) => frame.replace('webpack:///', servDir)))
          : Promise.resolve(mappedStack);
        processStack.then((stack: string[]) => {
          this.props.error.stack = stack.join('\n');
          this.setState({ mapped: true });
        });
      });
    }
  }

  public renderFrames(frames: StackFrame[]) {
    const { frame: frameStyle, file, linkToFile } = styles;

    return frames.map((frame: StackFrame, index: number) => {
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
  }

  public render() {
    const error: Error = this.props.error;
    const { redbox, message, stack, frame } = styles;
    let frames: any;

    try {
      if (error.message.indexOf('\n    at ') >= 0) {
        // We probably have stack in our error message
        // a trick used by our errorMiddleware to pass error stack
        // when GraphQL context creation failed, use that stack
        error.stack = error.message;
        error.message = error.stack.split('\n')[0];
      }
      frames = this.renderFrames(ErrorStackParser.parse(error));
    } catch (e) {
      frames = (
        <div style={frame} key={0}>
          <div>Failed to parse stack trace. Stack trace information unavailable.</div>
        </div>
      );
    }

    return (
      <div style={redbox}>
        <div style={message}>
          {error.name}: {error.message}
        </div>
        <div style={stack}>{frames}</div>
      </div>
    );
  }
}

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
