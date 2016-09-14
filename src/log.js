import minilog from 'minilog'

minilog.enable();

const log = typeof window !== 'undefined' ? minilog('client') : minilog('server');

export default log;