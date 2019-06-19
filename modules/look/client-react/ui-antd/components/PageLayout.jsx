import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';

import settings from '@gqlapp/config';

import NavBar from './NavBar';

const { Header, Content, Footer } = Layout;

const PageLayout = ({ children, navBar }) => (
  <Layout>
    {navBar !== false && (
      <Header className="no-print">
        <NavBar />
      </Header>
    )}
    <Content id="content" style={{ background: '#fff', padding: 24 }}>
      {children}
    </Content>
    <Footer className="no-print" style={{ textAlign: 'center' }}>
      &copy; {new Date().getFullYear()}. {settings.app.name}.
    </Footer>
  </Layout>
);

PageLayout.propTypes = {
  children: PropTypes.node,
  navBar: PropTypes.bool
};

export default PageLayout;
