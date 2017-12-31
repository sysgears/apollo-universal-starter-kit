/* eslint-disable no-unused-vars */
import settings from '../../../settings';

const authz = settings.auth.authorization;

export function validateScope(required, provided) {
  if (!provided) {
    return false;
  }
  if ((required && required === 'deny') || required === 'skip') {
    return required;
  }
  if (required && required.length === 1 && (required[0] === 'deny' || required[0] === 'skip')) {
    return required[0];
  }

  if (!required || required.length == 0) {
    return true;
  }

  return validateScope_v2(required, provided);
}

export function validateScope_v2(required, provided) {
  // erm, sort at leas the provided, then bin search provided
  // required is not likely worth it, but provided definitely will need it
  // work should be started, and they may be sorted at this point.
  // haven't checked
  for (let scope of required) {
    for (let perm of provided) {
      if (scope === perm) {
        return `${perm} >> ${scope}`;
      }
    }
  }

  return false;
}

export function validateScope_v1(required, provided) {
  for (let perm of provided) {
    let permReStr = '^' + perm.replace(/\*/g, '.*') + '$';
    var permRe = new RegExp(permReStr);
    for (let scope of required) {
      // user:* -> user:create, user:view:self
      if (permRe.exec(scope)) {
        return `${perm} >> ${scope} (${permReStr})`;
      }
    }
  }

  return false;
}
