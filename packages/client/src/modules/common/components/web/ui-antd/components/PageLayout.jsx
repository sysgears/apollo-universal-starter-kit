import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';

import NavBar from './NavBar';
import settings from '../../../../../../../../../settings';

const { Header, Content, Footer } = Layout;

class PageLayout extends React.Component {
  render() {
    const { children, navBar } = this.props;

    return (
      <Layout>
        {navBar !== false && (
          <Header>
            <NavBar />
          </Header>
        )}
        <Content id="content" style={{ background: '#fff', padding: 24 }}>
          {children}
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          &copy; {new Date().getFullYear()}. {settings.app.name}.
        </Footer>
      </Layout>
    );
  }
}

PageLayout.propTypes = {
  children: PropTypes.node,
  navBar: PropTypes.bool
};

export default PageLayout;
