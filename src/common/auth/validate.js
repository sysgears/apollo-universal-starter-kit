/* eslint-disable no-unused-vars */
import _ from 'lodash';
import expandBrackets from './brackets';
import settings from '../../../settings';

const authz = settings.auth.authorization;

export function validateScope(required, provided) {
  console.log('validateScope', required, provided);
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

  return validateScope_v3(required, provided);
}

export function validateScope_v3(required, provided) {
  let reqd = [];
  for (let scope of required) {
    let expansions = expandBrackets(scope);
    reqd = reqd.concat(expansions);
  }

  return validateScope_v2(reqd, provided);
  // return validateScope_v2_bool(reqd, provided);
}

export function validateScope_v2_bool(required, provided) {
  // erm, sort at leas the provided, then bin search provided
  // required is not likely worth it, but provided definitely will need it
  // work should be started, and they may be sorted at this point.
  // haven't checked
  for (let scope of required) {
    if (scope.includes('&&')) {
      // and clause in required scopes item
      const andScopes = scope.split('&&');
      let pass = true;
      let passes = [];
      for (let elem of andScopes) {
        passPermLoop: for (let perm of provided) {
          if (scope === perm) {
            // we have this one, so "goto" the next andScope
            passes.push(perm);
            break passPermLoop;
          }
        }
        // made to through a condition without finding a provided match
        // so fail and discontinue search for this required "AND" scope
        pass = false;
        break;
      }

      // we've now made it through the andScopes, did we pass?
      if (pass) {
        passes = _.uniq(passes);
        return `${passes} >> ${scope}`;
      }
    } else {
      // simple scope
      for (let perm of provided) {
        if (scope === perm) {
          return `${perm} >> ${scope}`;
        }
      }
    }
  }

  return false;
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
