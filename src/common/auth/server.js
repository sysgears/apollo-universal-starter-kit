/* eslint-disable no-unused-vars */
import { validateScope } from './validate';

import { ContextError, AuthorizationError } from './errors';

import settings from '../../../settings';

const authz = settings.auth.authorization;

export const authSwitch = scopingList => {
  const localScopings = scopingList;

  return async function(_, __, context, info) {
    // check for the auth object on the context
    if (!context.auth) return new ContextError();
    if (!context.auth.isAuthenticated) return new AuthorizationError('Not Authenticated!');

    let path = [];
    let ipath = info.path;
    while (ipath) {
      path.push(ipath.key);
      ipath = ipath.prev;
    }
    context.auth.path = path;

    // loop ever scoping elements
    let pass = false;
    for (let scoping of localScopings) {
      /// some local vars
      let localRequiredScopes = scoping.requiredScopes;
      let localPresentedScopes = scoping.presentedScopes;
      let localCallback = scoping.callback;

      // We've already passed validation, now the work is being passed down the line
      if (pass === 'next') {
        // hot potato
        if (localCallback === 'next') {
          continue;
        }

        // finally, drop into a callback and do some authenticated work
        // seems out of place considering all the checking happens next
        // see below for the initiation of this section of code
        return localCallback(_, __, context, info);
      }

      // check for custom scope validation (i.e. scopes is a function to determine requred Scopes)
      if (localRequiredScopes && typeof localRequiredScopes === 'function') {
        // user the required Scope callback
        localRequiredScopes = await Promise.resolve().then(() => localRequiredScopes(_, __, context, info));
      }
      if (localPresentedScopes && typeof localPresentedScopes === 'function') {
        // user the required Scope callback
        localPresentedScopes = await Promise.resolve().then(() => localPresentedScopes(_, __, context, info));
      }

      // Check that there are requirements, but no scope presented
      const presentedScopes = localPresentedScopes ? localPresentedScopes : context.auth.scope;
      if (localRequiredScopes && localRequiredScopes.length && !presentedScopes) {
        continue;
      }

      // Now check validate the presented scopes against the required scopes
      //   returns false or a string. string can be deny, skip, or the successful scope matching
      pass = validateScope(localRequiredScopes, presentedScopes);
      if (pass) {
        // Stop immediately and return bad news
        if (pass === 'deny') {
          return false;
        }

        // Do nothing and let the pipeline continue
        if (pass === 'skip') {
          pass = false;
          continue;
        }

        // We've passed go, now lets collect 200BTC
        context.auth.validation = pass;

        // leave it for the next guy
        if (localCallback === 'next') {
          pass = 'next';
          continue;
        }

        // or call our callback
        return localCallback(_, __, context, info);
      } // else, pass was false, which is the default, and we look at the next scoping
    } // End scoping loop

    // Otherwise, none of the mappings passed, so return authz error
    return new AuthorizationError();
  };
};

export const authBatching = scopingList => {
  const localScopings = scopingList;

  return async function(sources, args, context, info) {
    // check for the auth object on the context
    if (!context.auth) return new ContextError();
    if (!context.auth.isAuthenticated) return new AuthorizationError('Not Authenticated!');

    let path = [];
    let ipath = info.path;
    while (ipath) {
      path.push(ipath.key);
      ipath = ipath.prev;
    }
    context.auth.path = path;

    console.log('authBatching - ultimate sources');
    console.log(sources);

    let finalResults = new Array(sources.length);
    finalResults.fill([]);

    let remainingSources = sources.slice(0);

    // loop ever scoping elements
    for (let scoping of localScopings) {
      /// some local vars
      let localRequiredScopes = scoping.requiredScopes;
      let localPresentedScopes = scoping.presentedScopes;
      let localCallback = scoping.callback;
      if (!localPresentedScopes) {
        // console.log("Rught ROooh")
        localPresentedScopes = new Array(sources.length);
        localPresentedScopes.fill([]);
      }

      // check for custom scope validation (i.e. scopes is a function to determine requred Scopes)
      if (localRequiredScopes && typeof localRequiredScopes === 'function') {
        // use the supplied requiredScopes callback
        localRequiredScopes = await Promise.resolve().then(() =>
          localRequiredScopes(remainingSources, args, context, info)
        );
      }
      if (localPresentedScopes && typeof localPresentedScopes === 'function') {
        // use the supplied presentedScopes callback
        localPresentedScopes = await Promise.resolve().then(() =>
          localPresentedScopes(remainingSources, args, context, info)
        );
      }

      // Check that there are requirements, but no scope presented
      if (localRequiredScopes && localRequiredScopes.length && !localPresentedScopes) {
        continue;
      }

      console.log('AuthBatching - requiredScopes', localRequiredScopes);
      console.log('AuthBatching - presentedScopes', localPresentedScopes);

      // Now check validate the presented scopes against the required scopes
      //   returns false or a string. string can be deny, skip, or the successful scope matching
      let skippedSources = new Array(sources.length);
      let passedSources = new Array(sources.length);
      for (let sid in remainingSources) {
        let src = remainingSources[sid];
        console.log(`[${sid}] ${src}`);
        if (!src) {
          console.log('  - skip:', src);
          skippedSources[sid] = null;
          passedSources[sid] = {};
          continue;
        }

        let pass = validateScope(localRequiredScopes, localPresentedScopes[sid]);
        console.log('  ? ', pass);
        if (pass) {
          // Immediately send some bad news to the final results
          if (pass === 'deny') {
            finalResults[sid] = new AuthorizationError();
            skippedSources[sid] = null;
            passedSources[sid] = {};
            continue;
          }

          // Do nothing and let the source pass down the pipeline
          if (pass === 'skip') {
            skippedSources[sid] = src;
            passedSources[sid] = {};
            continue;
          }

          // Else we're good
          skippedSources[sid] = null;
          passedSources[sid] = src;
        } else {
          skippedSources[sid] = src;
          passedSources[sid] = {};
        }
      }

      remainingSources = skippedSources;

      console.log('AuthBatching - passedSources', passedSources);
      console.log('AuthBatching - remainingSources', remainingSources);

      let passedResults = await localCallback(passedSources, args, context, info);

      for (let sid in passedResults) {
        if (passedResults[sid] && finalResults[sid].length < passedResults[sid].length) {
          finalResults[sid] = passedResults[sid];
        }
      }
      console.log('loop final', localRequiredScopes, finalResults);
    } // End scoping loop

    return finalResults;
  };
};

export default authSwitch;
