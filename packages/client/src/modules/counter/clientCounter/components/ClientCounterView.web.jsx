import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button } from '../../../common/components/web';

const Section = styled.section`
  margin-bottom: 30px;
  text-align: center;
`;

export const ClientCounterView = ({ text, children }) => (
  <Section>
    <p>{text}</p>
    {children}
  </Section>
);

ClientCounterView.propTypes = {
  text: PropTypes.string,
  children: PropTypes.node
};

export const ClientCounterButton = ({ onClick, text }) => (
  <Button id="apollo-link-button" color="primary" onClick={onClick}>
    {text}
  </Button>
);

ClientCounterButton.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string
};
