/* eslint-disable react/display-name */
import React from 'react';

const createTabBarIconWrapper = (TabBarIconComponent, defaultProps) => (props) =>
  (
    // eslint-disable-next-line react/prop-types
    <TabBarIconComponent {...defaultProps} color={props.tintColor} />
  );

export default createTabBarIconWrapper;
