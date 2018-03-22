import React from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { Button } from '../../common/components/web';
import PageLayout from '../../common/components/web/ui-bootstrap/components/PageLayout';
import settings from '../../../../../../settings';

import { CounterProps } from '../types';

const Section = styled.section`
  margin-bottom: 30px;
  text-align: center;
`;

const CounterView = ({
  loading,
  counter,
  addCounter,
  reduxCounter,
  onReduxIncrement,
  stateCounter,
  addStateCounter
}: CounterProps) => {
  const renderMetaData = () => (
    <Helmet
      title={`${settings.app.name} - Counter`}
      meta={[
        {
          name: 'description',
          content: `${settings.app.name} - Counter example page`
        }
      ]}
    />
  );

  if (loading) {
    return (
      <PageLayout>
        {renderMetaData()}
        <div className="text-center">Loading...</div>
      </PageLayout>
    );
  } else {
    return (
      <PageLayout>
        {renderMetaData()}
        <Section>
          <p>
            Current counter, is {counter.amount}. This is being stored server-side in the database and using Apollo
            subscription for real-time updates.
          </p>
          <Button id="graphql-button" color="primary" onClick={addCounter(1)}>
            Click to increase counter
          </Button>
        </Section>
        <Section>
          <p>Current reduxCount, is {reduxCounter.amount}. This is being stored client-side with Redux.</p>
          <Button id="redux-button" color="primary" onClick={onReduxIncrement(1)}>
            Click to increase reduxCount
          </Button>
        </Section>
        <Section>
          <p>
            Current apolloLinkStateCount, is {stateCounter.amount}. This is being stored client-side with Apollo Link
            State.
          </p>
          <Button id="apollo-link-button" color="primary" onClick={addStateCounter(1)}>
            Click to increase apolloLinkState
          </Button>
        </Section>
      </PageLayout>
    );
  }
};

export default CounterView;
