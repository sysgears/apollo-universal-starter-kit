import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { withRouter, NavLink } from 'react-router-dom';
import { Layout, Menu } from 'antd';

import settings from '@gqlapp/config';

import { Row, Col, MenuItem, Icon } from './index';
import styles from '../styles/styles.less';

const ref = { modules: null };

export const onAppCreate = modules => (ref.modules = modules);

const { Header, Content, Footer, Sider } = Layout;

class PageLayout extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    navBar: PropTypes.bool,
    location: PropTypes.object.isRequired
  };

  state = {
    collapsed: false,
    current: '/'
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  handleClick = e => {
    this.setState({
      current: e.key
    });
  };

  render() {
    const { children, navBar } = this.props;

    return (
      <Layout hasSider={true}>
        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.toggle}
          breakpoint="lg"
          collapsedWidth="0"
        >
          <Menu onClick={this.handleClick} selectedKeys={[this.props.location.pathname]} mode="inline" theme="dark">
            <MenuItem key="/">
              <NavLink to="/" className="nav-link">
                {settings.app.name}
              </NavLink>
            </MenuItem>
            {ref.modules.navItems}
          </Menu>
        </Sider>
        <Layout>
          {navBar !== false && (
            <Header className="no-print" style={{ padding: 0 }}>
              <Row gutter={0}>
                <Col span={14}>
                  <Menu mode="horizontal" theme="dark" selectable={false} style={{ lineHeight: '64px' }}>
                    <MenuItem key="trigger">
                      <Icon
                        className="trigger"
                        type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                        onClick={this.toggle}
                      />
                    </MenuItem>
                  </Menu>
                </Col>
                <Col span={10}>
                  <Menu
                    onClick={this.handleClick}
                    selectedKeys={[this.props.location.pathname]}
                    mode="horizontal"
                    theme="dark"
                    style={{ lineHeight: '64px', float: 'right' }}
                  >
                    {ref.modules.navItemsRight}
                    {__DEV__ && (
                      <MenuItem>
                        <a href="/graphiql">GraphiQL</a>
                      </MenuItem>
                    )}
                  </Menu>
                </Col>
              </Row>
            </Header>
          )}
          {__SERVER__ && __DEV__ && (
            <Helmet>
              <style type="text/css">{styles._getCss()}</style>
            </Helmet>
          )}
          <Content id="content" style={{ background: '#fff', padding: 24 }}>
            {children}
          </Content>
          <Footer className="no-print" style={{ textAlign: 'center' }}>
            &copy; {new Date().getFullYear()}. {settings.app.name}.
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(PageLayout);
