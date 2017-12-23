import React from 'react';
import PropTypes from 'prop-types';
import { PageLayout } from '../../common/components/web';

const SubscribersOnlyView = ({ loading, number }) => {
  return (
    <PageLayout>
      <h1>Private</h1>
      <p>Your magic number is {loading ? 'loading...' : number}.</p>
    </PageLayout>
  );
};

SubscribersOnlyView.propTypes = {
  loading: PropTypes.bool.isRequired,
  number: PropTypes.number
};

export default SubscribersOnlyView;
