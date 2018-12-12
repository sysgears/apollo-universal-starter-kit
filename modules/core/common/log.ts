import minilog from 'minilog';
import settings from '../../../settings';

minilog.enable();

const loggerName = typeof window !== 'undefined' ? 'frontend' : 'backend';

const log = minilog(loggerName);
(log as any).suggest.defaultResult = false;
(log as any).suggest.clear().allow(loggerName, settings.app.logging.level);

if (__DEV__ && __SERVER__) {
  const consoleLog = global.console.log;
  global.console.log = (...args: any[]) => {
    if (args.length === 1 && typeof args[0] === 'string' && args[0].match(/^\[(HMR|WDS)\]/)) {
      consoleLog('backend ' + args[0]);
    } else {
      consoleLog.apply(global.console, args);
    }
  };
}

export default log;
