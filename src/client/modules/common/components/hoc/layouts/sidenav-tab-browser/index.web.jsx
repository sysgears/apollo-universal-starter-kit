import React from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import changeCase from 'change-case';

import { Container, Row, Col, ListGroup, ListItem } from '../../../web';

class Layout extends React.Component {
  renderMenu() {
    const { activeTab, mainview, subviews } = this.props;
    return (
      <ListGroup>
        <ListItem active action tag="a" href={'/' + mainview.name + '#'} style={{ color: 'white' }} key={mainview.name}>
          {changeCase.titleCase(mainview.name)}
        </ListItem>
        {subviews.map(view => {
          if (view.name === activeTab) {
            return (
              <ListItem style={{ color: '#0B0' }} key={view.name}>
                {changeCase.titleCase(view.name)}
              </ListItem>
            );
          } else {
            return (
              <ListItem
                action
                tag="a"
                href={'/' + mainview.name + '#' + view.name}
                style={{ color: '#007bff' }}
                key={view.name}
              >
                {changeCase.titleCase(view.name)}
              </ListItem>
            );
          }
        })}
      </ListGroup>
    );
  }

  renderContent() {
    const { activeTab, mainview, subviews } = this.props;

    if (activeTab === '') {
      let View = mainview.component;
      return <View />;
    } else {
      let activeView = _.find(subviews, v => v.name === activeTab);
      let View = activeView.component;
      return <View />;
    }
  }

  render() {
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
