import minilog from 'minilog';

import settings from '@gqlapp/config';

minilog.enable();

const loggerName = typeof window !== 'undefined' ? 'frontend' : 'backend';

const log = minilog(loggerName);
(log as any).suggest.defaultResult = false;
(log as any).suggest.clear().allow(loggerName, settings.app.logging.level);

if (typeof __DEV__ !== 'undefined' && typeof __SERVER__ !== 'undefined' && typeof __TEST__ !== 'undefined') {
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
