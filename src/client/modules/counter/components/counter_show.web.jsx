import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Button } from 'reactstrap';
import styled from 'styled-components';

const Section = styled.section`
  margin-bottom: 30px;
`;

const CounterShow = ({ loading, count, addCount, reduxCount, onReduxIncrement }) => {

  const renderMetaData = () => (
    <Helmet
      title="Apollo Starter Kit - Counter"
      meta={[{
        name: 'description',
        content: 'Apollo Fullstack Starter Kit - Counter example page'
      }]}/>
  );

  if (loading) {
    return (
      <section>
        {renderMetaData()}
        <div className="text-center">
          Loading...
        </div>
      </section>
    );
  } else {
    return (
      <div>
        {renderMetaData()}
        <div className="text-center mt-4 mb-4">
          <Section>
            <p>
              Current count, is {count.amount}. This is being stored server-side in the database and using Apollo
              subscription for real-time updates.
            </p>
            <Button id="graphql-button" color="primary" onClick={addCount(1)}>
              Click to increase count
            </Button>
          </Section>
          <Section>
            <p>
              Current reduxCount, is {reduxCount}. This is being stored client-side with Redux.
            </p>
            <Button id="redux-button" color="primary" onClick={onReduxIncrement(1)}>
              Click to increase reduxCount
            </Button>
          </Section>
        </div>
      </div>
    );
  }
};

CounterShow.propTypes = {
  loading: PropTypes.bool.isRequired,
  count: PropTypes.object,
  addCount: PropTypes.func.isRequired,
  reduxCount: PropTypes.number.isRequired,
  onReduxIncrement: PropTypes.func.isRequired,
};

export default CounterShow;
