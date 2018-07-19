import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button } from '../../../common/components/web';

const Section = styled.section`
  margin-bottom: 30px;
  text-align: center;
`;

export const ReduxCounterView = ({ text, children }) => (
  <Section>
    <p>{text}</p>
    {children}
  </Section>
);

ReduxCounterView.propTypes = {
  text: PropTypes.string,
  children: PropTypes.node
};

export const ReduxCounterButton = ({ onClick, text }) => (
  <Button id="redux-button" color="primary" onClick={onClick}>
    {text}
  </Button>
);

ReduxCounterButton.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string
};
