import React from 'react';

interface ListItemProps {
  children: any;
}

const ListItem = ({ children, ...props }: ListItemProps) => {
  return <li {...props}>{children}</li>;
};

export default ListItem;
