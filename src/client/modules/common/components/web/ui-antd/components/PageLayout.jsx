import React from 'react';
import PropTypes from 'prop-types';
import LocaleProvider from 'antd/lib/locale-provider';
import enUS from 'antd/lib/locale-provider/en_US';
import Layout from 'antd/lib/layout';

import NavBar from './NavBar';
import settings from '../../../../../../../../settings';

const { Header, Content, Footer } = Layout;

const PageLayout = ({ children, navBar }) => {
  return (
    <LocaleProvider locale={enUS}>
      <Layout>
        <Header>{navBar !== false && <NavBar />}</Header>
        <Content id="content" style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          {children}
        </Content>
        <Footer style={{ textAlign: 'center' }}>&copy; 2017. {settings.app.name}.</Footer>
      </Layout>
    </LocaleProvider>
  );
};

PageLayout.propTypes = {
  children: PropTypes.node,
  navBar: PropTypes.bool
};

export default PageLayout;
