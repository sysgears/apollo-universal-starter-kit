import React from 'react';
import PropTypes from 'prop-types';
import { List as ListComponent } from 'antd-mobile';

const List = ({ children, ...props }) => {
  return <ListComponent {...props}>{children}</ListComponent>;
};

List.propTypes = {
  children: PropTypes.node
};

export default List;
