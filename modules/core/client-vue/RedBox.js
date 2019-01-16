import { mapStackTrace } from 'sourcemapped-stacktrace';
import ErrorStackParser from 'error-stack-parser';
import settings from '../../../settings';

const format = (fmt, ...args) =>
  fmt.replace(/{(\d+)}/g, (match, index) => (typeof args[index] !== 'undefined' ? args[index] : match));

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

export default {
  name: 'RedBox',
  props: {
    error: Error
  },
  data: () => ({
    mapped: false
  }),
  methods: {
    renderFrames: function(frames) {
      const { frame: frameStyle, file, linkToFile } = styles;

      return frames.map((frame, index) => {
        const text = `at ${frame.fileName}:${frame.lineNumber}:${frame.columnNumber}`;
        const url = format(settings.app.stackFragmentFormat, frame.fileName, frame.lineNumber, frame.columnNumber);

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
  },
  mounted() {
    if (this.mapped) {
      return false;
    }

    const mapper = mappedStack => {
      const processStack = __DEV__
        ? fetch('/servdir')
            .then(res => res.text())
            .then(servDir => mappedStack.map(frame => frame.replace('webpack:///', servDir)))
        : Promise.resolve(mappedStack);

      processStack.then(stack => {
        this.error.stack = stack.join('\n');
        this.mapped = true;
      });
    };

    mapStackTrace(this.error.stack, mapper);
  },
  // eslint-disable-next-line
  render(h) {
    const { redbox, message, stack, frame } = styles;
    let frames;

    try {
      if (this.error.message.indexOf('\n    at ') >= 0) {
        // We probably have stack in our error message
        // a trick used by our errorMiddleware to pass error stack
        // when GraphQL context creation failed, use that stack
        this.error.stack = this.error.message;
        this.error.message = this.error.stack.split('\n')[0];
      }

      frames = this.renderFrames(ErrorStackParser.parse(this.error));
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
          {this.error.name}: {this.error.message}
        </div>
        <div style={stack}>{frames}</div>
      </div>
    );
  }
};
