import minilog from 'minilog'

minilog.enable();

const log = typeof window !== 'undefined' ? minilog('client') : minilog('backend');

export default log;