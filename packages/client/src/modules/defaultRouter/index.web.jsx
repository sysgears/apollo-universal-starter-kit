import React from 'react';
import PropTypes from 'prop-types';
import { Switch, withRouter } from 'react-router-dom';

import modules from '../';
import PageLayout from './components/PageLayout';
import Feature from '../connector';

const Wrapper = ({ location: { pathname }, children }) => {
  let wrapper = <PageLayout>{children}</PageLayout>;
  modules.containers.forEach(cont => {
    if (cont.path.includes(pathname)) {
      wrapper = React.createElement(cont.wrapper, cont.props, children);
    }
  });
  return wrapper;
};

const routerFactory = () => {
  const WrapperComponent = withRouter(Wrapper);

  return (
    <WrapperComponent>
      <Switch>{modules.routes}</Switch>
    </WrapperComponent>
  );
};

export default new Feature({
  routerFactory
});

Wrapper.propTypes = {
  location: PropTypes.object,
  children: PropTypes.object
};
