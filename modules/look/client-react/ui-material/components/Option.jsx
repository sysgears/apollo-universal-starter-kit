import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';

export default class Option extends React.Component {
  render() {
    const { children, ...props } = this.props;
    return <MenuItem {...props}>{children}</MenuItem>;
  }
}

Option.propTypes = {
  children: PropTypes.node
};
