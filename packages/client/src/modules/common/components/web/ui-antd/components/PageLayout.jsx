import React from 'react';
import PropTypes from 'prop-types';
import Layout from 'antd/lib/layout';

import NavBar from './NavBar';
import settings from '../../../../../../../../../settings';

const { Header, Content, Footer } = Layout;

const PageLayout = ({ children, navBar }) => {
  return (
    <div className="flex-grow">
      <Layout>
        <section className="flex-grow">
          {navBar !== false && (
            <Header>
              <NavBar />
            </Header>
          )}
          <Content id="content" style={{ background: '#fff', padding: 24 }}>
            {children}
          </Content>
        </section>
        <Footer style={{ textAlign: 'center' }}>&copy; 2017. {settings.app.name}.</Footer>
      </Layout>
    </div>
  );
};

PageLayout.propTypes = {
  children: PropTypes.node,
  navBar: PropTypes.bool
};

export default PageLayout;
