/* eslint-disable react/display-name */
import React from 'react';

interface TabBarProps {
  tintColor?: string;
}

const createTabBarIconWrapper = (
  TabBarIconComponent: any,
  defaultProps: any
  // eslint-disable-next-line react/prop-types
) => (props: TabBarProps) => <TabBarIconComponent {...defaultProps} color={props.tintColor} />;

export default createTabBarIconWrapper;
