import PropTypes from 'prop-types';
import ErrorStackParser from 'error-stack-parser';
import { mapStackTrace } from 'sourcemapped-stacktrace';
import React from 'react';
import settings from '../../../../settings';

const format = (fmt, ...args) =>
  fmt.replace(/{(\d+)}/g, (match, number) => (typeof args[number] != 'undefined' ? args[number] : match));

export default class RedBox extends React.Component {
  static propTypes = {
    error: PropTypes.instanceOf(Error).isRequired
  };

  constructor(props) {
    super(props);
  }

  state = {
    mapped: false
  };

  componentDidMount() {
    if (!this.state.mapped) {
      mapStackTrace(this.props.error.stack, mappedStack => {
        const processStack = __DEV__
          ? fetch('/servdir')
              .then(res => res.text())
              .then(servDir => mappedStack.map(frame => frame.replace('webpack:///', servDir)))
          : Promise.resolve(mappedStack);
        processStack.then(stack => {
          this.props.error.stack = stack.join('\n');
          this.setState({ mapped: true });
        });
      });
    }
  }

  renderFrames(frames) {
    const { frame, file, linkToFile } = styles;
    return frames.map((f, index) => {
      const text = `at ${f.fileName}:${f.lineNumber}:${f.columnNumber}`;
      const url = format(settings.app.stackFragmentFormat, f.fileName, f.lineNumber, f.columnNumber);

      return (
        <div style={frame} key={index}>
          <div>{f.functionName}</div>
          <div style={file}>
            <a href={url} style={linkToFile}>
              {text}
            </a>
          </div>
        </div>
      );
    });
  }

  render() {
    const error = this.props.error;

    const { redbox, message, stack, frame } = styles;

    let frames;
    let parseError;
    try {
      if (error.message.indexOf('\n    at ') >= 0) {
        // We probably have stack in our error message
        // a trick used by our errorMiddleware to pass error stack
        // when GraphQL context creation failed, use that stack
        error.stack = error.message;
        error.message = error.stack.split('\n')[0];
      }
      frames = ErrorStackParser.parse(error);
    } catch (e) {
      parseError = new Error('Failed to parse stack trace. Stack trace information unavailable.');
    }

    if (parseError) {
      frames = (
        <div style={frame} key={0}>
          <div>{parseError.message}</div>
        </div>
      );
    } else {
      frames = this.renderFrames(frames);
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

const styles = {
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
