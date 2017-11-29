import minilog from 'minilog';

minilog.enable();

const log = typeof window !== 'undefined' ? minilog('frontend') : minilog('backend');

if (__DEV__ && __SERVER__) {
  let console_log = global.console.log;
  global.console.log = function() {
    if (arguments.length == 1 && typeof arguments[0] === 'string' && arguments[0].match(/^\[(HMR|WDS)\]/)) {
      console_log('backend ' + arguments[0]);
    } else {
      console_log.apply(global.console, arguments);
    }
  };
}

export default log;
