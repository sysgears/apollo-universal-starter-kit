import React from 'react';
import PropTypes from 'prop-types';
import Layout from 'antd/lib/layout';

//import { Icon } from './index';
import NavBar from './NavBar';
import settings from '../../../../../../../../../settings';

const { Header, Content, Footer, Sider } = Layout;

class PageLayout extends React.Component {
  state = {
    collapsed: false
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  render() {
    const { children, navBar } = this.props;

    return (
      <div className="flex-grow">
        <Layout hasSider={true}>
          <Sider
            collapsible
            collapsed={this.state.collapsed}
            onCollapse={this.toggle}
            breakpoint="lg"
            collapsedWidth="0"
          >
            Sider
          </Sider>
          <Layout>
            <section className="flex-grow">
              {navBar !== false && (
                <Header style={{ background: '#fff', padding: 0 }}>
                  {/*<Icon
                    className="trigger"
                    type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggle}
                  />*/}
                  <NavBar />
                </Header>
              )}
              <Content id="content" style={{ background: '#fff', padding: 24 }}>
                {children}
              </Content>
            </section>
            <Footer style={{ textAlign: 'center' }}>&copy; 2017. {settings.app.name}.</Footer>
          </Layout>
        </Layout>
      </div>
    );
  }
}

PageLayout.propTypes = {
  children: PropTypes.node,
  navBar: PropTypes.bool
};

export default PageLayout;
