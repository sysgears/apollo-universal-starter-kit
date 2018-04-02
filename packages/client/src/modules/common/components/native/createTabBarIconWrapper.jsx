/* eslint-disable react/display-name */
import React from 'react';

const createTabBarIconWrapper = (
  TabBarIconComponent,
  defaultProps
  // eslint-disable-next-line react/prop-types
) => props => <TabBarIconComponent {...defaultProps} color={props.tintColor} />;

export default createTabBarIconWrapper;
