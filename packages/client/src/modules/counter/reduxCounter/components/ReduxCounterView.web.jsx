import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button } from '../../../common/components/web';

const Section = styled.section`
  margin-bottom: 30px;
  text-align: center;
`;

export const ReduxCounterView = ({ t, children, reduxCount }) => (
  <Section>
    <p>{t('reduxCounter.text', { reduxCount })}</p>
    {children}
  </Section>
);

ReduxCounterView.propTypes = {
  t: PropTypes.func,
  children: PropTypes.node,
  reduxCount: PropTypes.number
};

export const ReduxCounterButton = ({ onReduxIncrement, amount, t }) => (
  <Button id="redux-button" color="primary" onClick={onReduxIncrement(amount)}>
    {t('reduxCounter.btnLabel')}
  </Button>
);

ReduxCounterButton.propTypes = {
  onReduxIncrement: PropTypes.func,
  amount: PropTypes.number,
  t: PropTypes.func
};
