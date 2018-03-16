import React from 'react';
import PropTypes from 'prop-types';
import { Switch, withRouter } from 'react-router-dom';

import modules from '../';
import { PageLayout } from '../common/components/web';
import Feature from '../connector';

const Wrapper = ({ children }) => {
  return <PageLayout>{children}</PageLayout>;
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
  location: PropTypes.string,
  children: PropTypes.object
};
