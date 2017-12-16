export function mergeLoaders(res) {
  let ret = [];
  for (let r of res) {
    if (r === null || r.length == 0 || (r.length === 1 && r[0].id === null)) {
      continue;
    }
    return ret.concat(r);
  }
  return ret;
}

export function mergeResults(res) {
  let ret = [];
  for (let r of res) {
    if (r === null || r.length == 0 || (r.length === 1 && r[0].id === null)) {
      continue;
    }
    return ret.concat(r);
  }
  return ret;
}
