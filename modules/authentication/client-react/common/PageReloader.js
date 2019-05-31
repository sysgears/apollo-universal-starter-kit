import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';

export default class PageReloader extends React.Component {
  state = { key: uuid.v4() };

  reloadPage = () => {
    this.setState({ key: uuid.v4() });
  };

  render() {
    return <React.Fragment key={this.state.key}>{this.props.children}</React.Fragment>;
  }
}

PageReloader.propTypes = {
  children: PropTypes.node
};
