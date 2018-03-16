import React from 'react';
import PropTypes from 'prop-types';

const SubscribersOnlyView = ({ loading, number }) => {
  return (
    <section>
      <h1>Private</h1>
      <p>Your magic number is {loading ? 'loading...' : number}.</p>
    </section>
  );
};

SubscribersOnlyView.propTypes = {
  loading: PropTypes.bool.isRequired,
  number: PropTypes.number
};

export default SubscribersOnlyView;
