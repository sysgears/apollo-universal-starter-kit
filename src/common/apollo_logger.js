import { print } from 'graphql';

var apolloLogging = true;

export const enableApolloLogging = () => apolloLogging = true;
export const disableApolloLogging = () => apolloLogging = false;

const addNetworkInterfaceLogger = netIfc => {
  return {
    async query(request) {
      let result;
      try {
        result = await netIfc.query(request);
      } finally {
        if (apolloLogging) { console.log(print(request.query).trim(), "=>", JSON.stringify(result)); }
      }
      return result;
    },
    subscribe(request, handler) {
      let result;
      try {
        const logHandler = (error, result) => {
          if (apolloLogging) {
            console.log(JSON.stringify(error ? error : result));
          }
          return handler(error, result);
        };
        result = netIfc.subscribe(request, logHandler);
      } finally {
        if (apolloLogging) { console.log(print(request.query).trim(), "=>", result); }
      }
      return result;
    },
    unsubscribe(subId) {
      try {
        netIfc.unsubscribe(subId);
      } finally {
        if (apolloLogging) { console.log("unsubscribe =>", subId); }
      }
    }
  };
};

const addSubscriptionManagerLogger = manager => {
  const setupFunctions = manager.setupFunctions;
  manager.setupFunctions = {};
  for (let key of Object.keys(setupFunctions)) {
    manager.setupFunctions[key] = (...setupArgs) => {
      let triggerMap = setupFunctions[key](...setupArgs);
      const loggedMap = {};
      for (let key of Object.keys(triggerMap)) {
        loggedMap[key] = (...args) => {
          let result;
          try {
            result = triggerMap[key](...args);
          } finally {
            console.log(args, setupArgs);
            if (apolloLogging) { console.log('pubsub trigger', key, `(${args.join(',')})`, 'setup args ', `(${setupArgs.join(',')})`, '=>', result); }
          }
          return result;
        };
      }
      return loggedMap;
    };
  }
  const pubsub = manager.pubsub;
  manager.pubsub = {
    publish(...args) {
      console.log('pubsub publish', args);
      return pubsub.publish(...args);
    },
    async subscribe(trigger, handler) {
      let result;
      try {
        const logHandler = !apolloLogging ? handler : (msg) => {
          console.log("pubsub msg", JSON.stringify(msg));
          return handler(msg);
        };
        result = await pubsub.subscribe(trigger, logHandler);
      } finally {
        if (apolloLogging) { console.log('pubsub subscribe', trigger, "=>", result); }
      }
      return result;
    },
    unsubscribe(...args) {
      console.log('pubsub unsubscribe', args);
      return pubsub.unsubscribe(...args);
    }
  };
  return manager;
};

export const addApolloLogging = obj => obj.query ?
  addNetworkInterfaceLogger(obj) :
  addSubscriptionManagerLogger(obj);
