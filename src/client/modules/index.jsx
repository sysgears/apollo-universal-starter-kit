import React from 'react';

let routeList = [];
let navItemList = [];
let req = require.context('.', true, /\.\/[^\/]+\/index$/);
const reducers = {};
req.keys().map(name => {
  const module = req(name);
  if (module.getRoutes) {
    routeList = routeList.concat(module.getRoutes());
  }
  if (module.getNavItems) {
    navItemList = navItemList.concat(module.getNavItems());
  }
  if (module.getReducers) {
    Object.assign(reducers, module.getReducers());
  }
});

export const moduleReducers = reducers;

export const modulesRoutes = routeList.map((component, idx) =>
  React.cloneElement(component, {key: idx})
);

export const moduleNavItems = navItemList.map((component, idx) =>
  React.cloneElement(component, {key: idx})
);

