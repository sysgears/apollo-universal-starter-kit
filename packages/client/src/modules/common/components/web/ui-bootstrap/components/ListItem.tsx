import React from 'react';
import { ListGroupItem } from 'reactstrap';

interface ListItemProps {
  children: any;
}

const ListItem = ({ children, ...props }: ListItemProps) => {
  return <ListGroupItem {...props}>{children}</ListGroupItem>;
};

export default ListItem;
