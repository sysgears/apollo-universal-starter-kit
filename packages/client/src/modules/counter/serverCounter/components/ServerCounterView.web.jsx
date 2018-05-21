import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button } from '../../../common/components/web';

const Section = styled.section`
  margin-bottom: 30px;
  text-align: center;
`;

export const ServerCounterView = ({ t, children, counter, loading }) => {
  if (loading) {
    return (
      <Section>
        <div className="text-center">{t('loading')}</div>
      </Section>
    );
  } else {
    return (
      <Section>
        <p>{t('serverCounter.text', { counter })}</p>
        {children}
      </Section>
    );
  }
};

ServerCounterView.propTypes = {
  t: PropTypes.func,
  children: PropTypes.node,
  counter: PropTypes.object,
  loading: PropTypes.bool
};

export const ServerCounterButton = ({ addCounter, amount, t }) => (
  <Button id="graphql-button" color="primary" onClick={addCounter(amount)}>
    {t('serverCounter.btnLabel')}
  </Button>
);

ServerCounterButton.propTypes = {
  addCounter: PropTypes.func,
  amount: PropTypes.number,
  t: PropTypes.func
};
