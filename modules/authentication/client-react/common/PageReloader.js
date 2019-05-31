import React from 'react';
import PropTypes from 'prop-types';

export default class PageReloader extends React.Component {
  state = { key: 1 };

  reloadPage = () => {
    this.setState({ key: this.setState + 1 });
  };

  render() {
    return <React.Fragment key={this.state.key}>{this.props.children}</React.Fragment>;
  }
}

PageReloader.propTypes = {
  children: PropTypes.node
};
