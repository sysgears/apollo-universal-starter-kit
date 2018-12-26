import React from 'react';
import PropTypes from 'prop-types';
import { List as NBList } from 'native-base';

const List = ({ children, ...props }) => {
  return <NBList {...props}>{children}</NBList>;
};

List.propTypes = {
  children: PropTypes.node
};

export default List;
