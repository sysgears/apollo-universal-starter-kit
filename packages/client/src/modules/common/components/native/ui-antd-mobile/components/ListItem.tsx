import React from 'react';
import List from 'antd-mobile/lib/list';

interface ListItemProps {
  children: any;  
}

const ListItem = ({ children, ...props }: ListItemProps) => {
  return <List.Item {...props}>{children}</List.Item>;
};

export default ListItem;
