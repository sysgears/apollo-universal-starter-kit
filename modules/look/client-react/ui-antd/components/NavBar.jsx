import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, NavLink } from 'react-router-dom';
import { Menu, Row, Col } from 'antd';

import settings from '@gqlapp/config';

import MenuItem from './MenuItem';

const ref = { modules: null };

export const onAppCreate = async modules => (ref.modules = modules);

const NavBar = ({ location: { pathname } }) => (
  <Row gutter={0}>
    <Col span={14}>
      <Menu selectedKeys={[pathname]} mode="horizontal" theme="dark" style={{ lineHeight: '64px' }}>
        <MenuItem key="/">
          <NavLink to="/" className="nav-link">
            {settings.app.name}
          </NavLink>
        </MenuItem>
        {ref.modules.navItems}
      </Menu>
    </Col>
    <Col span={10}>
      <Menu selectedKeys={[pathname]} mode="horizontal" theme="dark" style={{ lineHeight: '64px', float: 'right' }}>
        {ref.modules.navItemsRight}
        {__DEV__ && (
          <MenuItem>
            <a href="/graphiql">GraphiQL</a>
          </MenuItem>
        )}
      </Menu>
    </Col>
  </Row>
);

NavBar.propTypes = {
  location: PropTypes.object.isRequired
};

export default withRouter(NavBar);
