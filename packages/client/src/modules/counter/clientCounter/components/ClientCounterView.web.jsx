import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button } from '../../../common/components/web';

const Section = styled.section`
  margin-bottom: 30px;
  text-align: center;
`;

export const ClientCounterView = ({ t, children, counterState }) => (
  <Section>
    <p>{t('apolloCount.text', { counterState })}</p>
    {children}
  </Section>
);

ClientCounterView.propTypes = {
  t: PropTypes.func,
  children: PropTypes.node,
  counterState: PropTypes.number
};

export const ClientCounterButton = ({ addCounterState, amount, t }) => (
  <Button id="apollo-link-button" color="primary" onClick={addCounterState(amount)}>
    {t('apolloCount.btnLabel')}
  </Button>
);

ClientCounterButton.propTypes = {
  addCounterState: PropTypes.func,
  amount: PropTypes.number,
  t: PropTypes.func
};
