import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Button } from 'reactstrap';
import styled from 'styled-components';
import PageLayout from '../../../app/PageLayout';

const Section = styled.section`margin-bottom: 30px;`;

const CounterView = ({ loading, counter, addCounter, reduxCount, onReduxIncrement }) => {
  const renderMetaData = () => (
    <Helmet
      title="Apollo Starter Kit - Counter"
      meta={[
        {
          name: 'description',
          content: 'Apollo Fullstack Starter Kit - Counter example page'
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
        <div className="text-center mt-4 mb-4">
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
        </div>
      </PageLayout>
    );
  }
};

CounterView.propTypes = {
  loading: PropTypes.bool.isRequired,
  counter: PropTypes.object,
  addCounter: PropTypes.func.isRequired,
  reduxCount: PropTypes.number.isRequired,
  onReduxIncrement: PropTypes.func.isRequired
};

export default CounterView;
