import minilog from 'minilog';

// Temp workaround for React alpha 6
if (__SERVER__) {
  global.window = global;
  window.addEventListener = () => {};
  window.requestAnimationFrame = () => {
    throw new Error('requestAnimationFrame is not supported in Node');
  };
}

minilog.enable();

const log = typeof window !== 'undefined' ? minilog('frontend') : minilog('backend');

if (__DEV__ && __SERVER__) {
  let console_log = global.console.log;
  global.console.log = function() {
    if (arguments.length == 1 && typeof arguments[0] === 'string' && arguments[0].match(/^\[(HMR|WDS)\]/)) {
      console_log('backend ' + arguments[0]);
    } else {
      console_log.apply(console_log, arguments);
    }
  };
}

export default log;
