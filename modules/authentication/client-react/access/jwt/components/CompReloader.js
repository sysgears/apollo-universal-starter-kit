import React from 'react';
import PropTypes from 'prop-types';

export default class CompReloader extends React.Component {
  state = { key: 1 };

  reloadComp = () => {
    this.setState({ key: this.setState + 1 });
  };

  render() {
    return <React.Fragment key={this.state.key}>{this.props.children}</React.Fragment>;
  }
}

CompReloader.propTypes = {
  children: PropTypes.node
};
