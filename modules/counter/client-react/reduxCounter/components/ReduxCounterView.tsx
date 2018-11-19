import React from 'react';
import styled from 'styled-components';

import { Button } from '../../../../../packages/client/src/modules/common/components/web';

const Section = styled.section`
  margin-bottom: 30px;
  text-align: center;
`;

interface ViewProps {
  text: string;
  children: any;
}

export const ReduxCounterView = ({ text, children }: ViewProps): any => (
  <Section>
    <p>{text}</p>
    {children}
  </Section>
);

interface ButtonProps {
  onClick: () => any;
  text: string;
}

export const ReduxCounterButton = ({ onClick, text }: ButtonProps): any => (
  <Button id="redux-button" color="primary" onClick={onClick}>
    {text}
  </Button>
);
