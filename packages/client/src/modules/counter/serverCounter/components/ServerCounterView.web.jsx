import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button } from '../../../common/components/web';

const Section = styled.section`
  margin-bottom: 30px;
  text-align: center;
`;

export const ServerCounterView = ({ t, children, counter }) => (
  <Section>
    <p>{t('counter.text', { counter })}</p>
    {children}
  </Section>
);

ServerCounterView.propTypes = {
  t: PropTypes.func,
  children: PropTypes.node,
  counter: PropTypes.object
};

export const ServerCounterButton = ({ addCounter, amount, t }) => (
  <Button id="graphql-button" color="primary" onClick={addCounter(amount)}>
    {t('counter.btnLabel')}
  </Button>
);

ServerCounterButton.propTypes = {
  addCounter: PropTypes.func,
  amount: PropTypes.number,
  t: PropTypes.func
};
