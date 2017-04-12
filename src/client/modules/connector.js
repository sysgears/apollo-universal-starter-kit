import React from 'react';

export const routes = [];
export const addRoutes = (...routesArg) => {
  routes.push(...routesArg.map((component, idx) =>
      React.cloneElement(component, { key: idx + routes.length })
  ));
};

export const navItems = [];
export const addNavItems = (...navItemsArg) => {
  navItems.push(...navItemsArg.map((component, idx) =>
      React.cloneElement(component, { key: idx + navItems.length })
  ));
};

export const addReducers = reducersArg => {
  Object.assign(reducers, reducersArg);
};
export const reducers = {};
