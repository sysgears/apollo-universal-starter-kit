import React from 'react';
import PropTypes from 'prop-types';
import { List as ListComponent } from 'native-base';

const List = ({ children, ...props }) => {
  return <ListComponent {...props}>{children}</ListComponent>;
};

List.propTypes = {
  children: PropTypes.node
};

export default List;
