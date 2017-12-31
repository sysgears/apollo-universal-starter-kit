import React from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import changeCase from 'change-case';

import { Container, Row, Col, ListGroup, ListItem } from '../../../web';

class Layout extends React.Component {
  renderMenu() {
    const { activeTab, mainview, subviews } = this.props;
    return (
      <ListGroup style={{ listStyle: 'none' }}>
        <li>
          <ListItem
            active
            action
            tag="a"
            href={(mainview.baseUrl ? mainview.baseUrl : '/' + mainview.name) + '#'}
            style={{ color: 'white' }}
            key={mainview.name}
          >
            {changeCase.titleCase(mainview.name)}
          </ListItem>
        </li>
        {subviews.map(view => {
          const name = view.name;
          const linkUrl = (mainview.baseUrl ? mainview.baseUrl : '/' + mainview.name) + '#' + name;
          const Name = changeCase.titleCase(name);
          console.log('link', activeTab, name, linkUrl);
          if (name === activeTab) {
            return (
              <li>
                <ListItem style={{ color: '#0B0' }} key={name}>
                  <span style={{ color: '#0B0' }}>{Name}</span>
                </ListItem>
              </li>
            );
          } else {
            return (
              <li>
                <ListItem action tag="a" href={linkUrl} style={{ color: '#007bff' }} key={name}>
                  <span style={{ color: '#007bff' }}>{Name}</span>
                </ListItem>
              </li>
            );
          }
        })}
      </ListGroup>
    );
  }

  renderContent() {
    const { activeTab, mainview, subviews } = this.props;
    console.log('activeTab:', activeTab);
    console.log('tab-browser props', this.props);

    if (activeTab === '') {
      let View = mainview.component;
      return <View {...this.props} />;
    } else {
      let activeView = _.find(subviews, v => v.name === activeTab);
      let View = activeView.component;
      return <View {...this.props} />;
    }
  }

  render() {
    console.log('Layout.render()');
    return (
      <Container>
        <Row>
          <Col xs={12} md={3} style={{ marginBottom: '2rem' }}>
            {this.renderMenu()}
          </Col>
          <Col xs={12} md={9}>
            {this.renderContent()}
          </Col>
        </Row>
      </Container>
    );
  }
}

Layout.propTypes = {
  mainview: PropTypes.object.isRequired,
  subviews: PropTypes.array.isRequired,
  activeTab: PropTypes.string.isRequired
};

export default Layout;
