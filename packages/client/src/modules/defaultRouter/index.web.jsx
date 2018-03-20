import React from 'react';
import PropTypes from 'prop-types';
import { Switch, withRouter } from 'react-router-dom';

import modules from '../';
import PageLayout from './components/PageLayout';
import Feature from '../connector';

const Wrapper = ({ location: { pathname }, children }) => {
  let content = children;
  modules.containers.find(cont => {
    if (cont.path.includes(pathname)) {
      content = React.createElement(cont.wrapper, cont.props, children);
      return true;
    } else if (cont.path[0] === '*') {
      content = React.createElement(cont.wrapper, cont.props, children);
    }
  });
  return content;
};

const container = { path: ['*'], wrapper: PageLayout };

const routerFactory = () => {
  const WrapperComponent = withRouter(Wrapper);

  return (
    <WrapperComponent>
      <Switch>{modules.routes}</Switch>
    </WrapperComponent>
  );
};

export default new Feature({
  routerFactory,
  container
});

Wrapper.propTypes = {
  location: PropTypes.object,
  children: PropTypes.object
};
