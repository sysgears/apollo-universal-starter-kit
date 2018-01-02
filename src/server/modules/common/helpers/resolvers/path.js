export function pathExtractor(info) {
  let path = [];
  let ipath = info.path;
  while (ipath) {
    path.push(ipath.key);
    ipath = ipath.prev;
  }
  return path;
}

export function pathProcessor(options) {
  const opts = options;
  return (sources, args, context, info) => {
    let paths = pathExtractor(info);
    if (opts.skipFirst) {
      paths = paths.slice(1);
    }

    for (let path of paths) {
      for (let handler of opts.handlers) {
        if (handler.keys.includes(path)) {
          handler.callback(sources, args, context, info);
          if (!opts.doAll) {
            return;
          }
        }
      }
    }
  };
}
