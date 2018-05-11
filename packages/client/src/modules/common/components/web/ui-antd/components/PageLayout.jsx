import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, NavLink } from 'react-router-dom';
import { Layout, Menu } from 'antd';

import { Row, Col, MenuItem, Icon } from './index';
import modules from '../../../../../../modules';
import settings from '../../../../../../../../../settings';

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
            {modules.navItems}
          </Menu>
        </Sider>
        <Layout>
          {navBar !== false && (
            <Header style={{ padding: 0 }}>
              <Row gutter={8}>
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
                    {modules.navItemsRight}
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
          <Content id="content" style={{ background: '#fff', padding: 24 }}>
            {children}
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            &copy; {new Date().getFullYear()}. {settings.app.name}.
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(PageLayout);
