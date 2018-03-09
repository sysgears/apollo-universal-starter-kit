import React from 'react';
import ADCol from 'antd/lib/col';

interface ColProps {
  children: any;
  xs: number;
}

const Col = ({ children, xs, ...props }: ColProps) => {
  return (
    <ADCol span={xs * 2} {...props}>
      {children}
    </ADCol>
  );
};

export default Col;
