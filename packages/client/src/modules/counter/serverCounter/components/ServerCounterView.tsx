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
        <p>{t('text', { amount: counter.amount })}</p>
        {children}
      </Section>
    );
  }
};

ServerCounterView.propTypes = {
  t: PropTypes.func,
  children: PropTypes.node,
  serverCounter: PropTypes.object,
  loading: PropTypes.bool
};

export const ServerCounterButton = ({ onClick, text }) => (
  <Button id="graphql-button" color="primary" onClick={onClick}>
    {text}
  </Button>
);

ServerCounterButton.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string
};
