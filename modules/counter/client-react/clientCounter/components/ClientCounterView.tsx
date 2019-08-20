import React from 'react';
import styled from 'styled-components';

import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';

const Section = styled.section`
  margin-bottom: 30px;
  text-align: center;
`;

interface ViewProps {
  children: any;
  t: TranslateFunction;
  counter: any;
  loading: boolean;
}

const ClientCounterView = ({ children, t, counter, loading }: ViewProps) => {
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

export default translate('clientCounter')(ClientCounterView);
