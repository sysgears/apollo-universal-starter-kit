import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { PageLayout, Button } from '../../common/components/web';
import settings from '../../../../../../settings';

const Section = styled.section`
  margin-bottom: 30px;
  text-align: center;
`;

const CounterView = ({ loading, counter, addCounter, reduxCount, onReduxIncrement, counterState, addCounterState }) => {
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
          <p>Current reduxCount, is {reduxCount}. This is being stored client-side with Redux.</p>
          <Button id="redux-button" color="primary" onClick={onReduxIncrement(1)}>
            Click to increase reduxCount
          </Button>
        </Section>
        <Section>
          <p>
            Current apolloLinkStateCount, is {counterState}. This is being stored client-side with Apollo Link State.
          </p>
          <Button id="apollo-link-button" color="primary" onClick={addCounterState(1)}>
            Click to increase apolloLinkState
          </Button>
        </Section>
      </PageLayout>
    );
  }
};

CounterView.propTypes = {
  loading: PropTypes.bool.isRequired,
  counter: PropTypes.object,
  addCounter: PropTypes.func.isRequired,
  counterState: PropTypes.number.isRequired,
  addCounterState: PropTypes.func.isRequired,
  reduxCount: PropTypes.number.isRequired,
  onReduxIncrement: PropTypes.func.isRequired
};

export default CounterView;
